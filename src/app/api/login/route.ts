import { NextResponse } from 'next/server';
import { prisma, dbHelpers } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { logAuth } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    console.log('🔑 Tentando fazer login com email:', email);

    try {
      // Conectando explicitamente ao banco
      await prisma.$connect();
      console.log('✅ Conexão com MongoDB estabelecida');
      
      // Procurar o usuário pelo e-mail
      const user = await prisma.user.findUnique({
        where: { email }
      });

      // Se não encontrar o usuário ou a senha estiver incorreta
      if (!user) {
        console.log('❌ Usuário não encontrado:', email);
        
        // Registrar falha de login
        await logAuth('LOGIN_FAILED', undefined, email, false, 
          { reason: 'user_not_found' }, 
          request
        );
        
        return NextResponse.json(
          { error: 'Email ou senha inválidos' },
          { status: 401 }
        );
      }

      // Verificar se a senha está correta
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        console.log('❌ Senha inválida para usuário:', email);
        
        // Registrar falha de login
        await logAuth('LOGIN_FAILED', user.id, email, false, 
          { reason: 'invalid_password' }, 
          request
        );
        
        return NextResponse.json(
          { error: 'Email ou senha inválidos' },
          { status: 401 }
        );
      }

      console.log('✅ Login bem-sucedido para usuário:', email);
      
      // Atualizar o lastLogin usando a função de ajuda
      const updateResult = await dbHelpers.updateLastLogin(user.id);
      
      if (!updateResult.success) {
        console.warn('⚠️ Aviso: Não foi possível atualizar o timestamp de login:', updateResult.error);
        // Continuamos com o login mesmo se não conseguirmos atualizar o timestamp
      }

      // Registrar login bem-sucedido
      await logAuth('LOGIN', user.id, email, true, 
        { 
          role: user.role,
          lastLogin: user.lastLogin
        }, 
        request
      );

      // Remover a senha antes de enviar o usuário
      const { password: _, ...userWithoutPassword } = user;

      return NextResponse.json({
        success: true,
        message: 'Login realizado com sucesso',
        user: userWithoutPassword
      });
    } catch (dbError) {
      console.error('❌ Erro ao acessar banco de dados:', dbError);
      
      // Registrar erro de login
      await logAuth('LOGIN_FAILED', undefined, email, false, 
        { 
          error: dbError.message,
          errorType: 'database_error'
        }, 
        request
      );
      
      return NextResponse.json(
        { error: `Erro ao acessar banco de dados: ${dbError.message}` },
        { status: 500 }
      );
    } finally {
      await prisma.$disconnect();
      console.log('🔒 Conexão com MongoDB fechada');
    }
  } catch (error) {
    console.error('❌ Erro ao processar login:', error);
    return NextResponse.json(
      { error: 'Erro ao realizar login' },
      { status: 500 }
    );
  }
} 