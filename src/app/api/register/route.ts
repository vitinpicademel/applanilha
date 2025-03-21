import { NextResponse } from 'next/server';
import { prisma, dbHelpers } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  console.log('📝 Iniciando processo de registro de usuário...');
  
  try {
    const { name, email, password, role, teamId, managerId } = await request.json();
    console.log(`📋 Dados recebidos: nome=${name}, email=${email}, role=${role}, teamId=${teamId || 'N/A'}, managerId=${managerId || 'N/A'}`);

    // Verificar se o email já existe
    try {
      // Garantir que temos uma conexão fresca com o banco
      await prisma.$disconnect();
      await prisma.$connect();
      console.log('✅ Conexão com MongoDB estabelecida');
      
      // Verificar duplicação de email
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        console.log(`❌ Email já cadastrado: ${email}`);
        return NextResponse.json(
          { error: 'Email já cadastrado' },
          { status: 400 }
        );
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('🔐 Senha criptografada com sucesso');
      
      // Preparar dados do usuário
      console.log('🔄 Preparando para criar usuário no banco de dados...');
      const userData = {
        name,
        email,
        password: hashedPassword,
        role,
        teamId: teamId || undefined,
        managerId: managerId || undefined
      };
      
      // Tentar criar o usuário diretamente com o Prisma para ter mais controle
      console.log('🔄 Criando usuário diretamente com Prisma...');
      const newUser = await prisma.user.create({
        data: {
          ...userData,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      
      console.log(`✅ Usuário criado com Prisma! ID: ${newUser.id}`);
      
      // Verificar se o usuário foi salvo
      console.log('🔍 Verificando se o usuário foi salvo...');
      const savedUser = await prisma.user.findUnique({
        where: { id: newUser.id }
      });
      
      if (!savedUser) {
        console.error('❌ ERRO CRÍTICO: Usuário não encontrado após criação!');
        return NextResponse.json(
          { error: 'Falha ao salvar usuário no banco de dados' },
          { status: 500 }
        );
      }
      
      console.log(`✅ Usuário verificado no banco de dados! Email: ${savedUser.email}, ID: ${savedUser.id}`);
      
      // Contar quantos usuários existem para verificar
      const userCount = await prisma.user.count();
      console.log(`📊 Total de usuários no banco de dados: ${userCount}`);
      
      // Remover a senha antes de retornar
      const { password: _, ...userWithoutPassword } = savedUser;

      // Retornar resposta de sucesso
      return NextResponse.json({
        success: true,
        message: 'Usuário criado com sucesso',
        user: userWithoutPassword
      }, { status: 201 });
    } catch (dbError) {
      console.error('❌ Erro no banco de dados:', dbError);
      return NextResponse.json(
        { error: `Erro ao acessar banco de dados: ${dbError.message}` },
        { status: 500 }
      );
    } finally {
      await prisma.$disconnect();
      console.log('🔒 Conexão com o MongoDB fechada');
    }
  } catch (error) {
    console.error('❌ Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: 'Erro ao criar usuário' },
      { status: 500 }
    );
  }
} 