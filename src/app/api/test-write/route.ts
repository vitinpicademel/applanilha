import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Endpoint para testar as operações de escrita no MongoDB
export async function GET(request: Request) {
  console.log('🔍 Testando operações de escrita no MongoDB...');
  
  try {
    // Conectar explicitamente ao banco de dados
    await prisma.$connect();
    console.log('✅ Conexão com o MongoDB estabelecida');
    
    // Criar um usuário de teste
    const testUser = {
      name: `Teste Write ${Date.now()}`,
      email: `teste-write-${Date.now()}@teste.com.br`,
      password: 'senha123',
      role: 'TESTER',
    };
    
    console.log('📝 Tentando criar usuário de teste:', testUser.email);
    
    // Criar o usuário no banco de dados
    const newUser = await prisma.user.create({
      data: {
        name: testUser.name,
        email: testUser.email,
        password: testUser.password,
        role: testUser.role,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    
    console.log('✅ Usuário criado com sucesso. ID:', newUser.id);
    
    // Verificar se o usuário foi salvo corretamente
    const savedUser = await prisma.user.findUnique({
      where: { id: newUser.id }
    });
    
    if (!savedUser) {
      throw new Error('Usuário não encontrado após a criação');
    }
    
    console.log('✅ Usuário recuperado com sucesso:', savedUser.email);
    
    // Contar o número total de usuários no banco
    const userCount = await prisma.user.count();
    
    // Remover o usuário de teste
    await prisma.user.delete({
      where: { id: newUser.id }
    });
    
    console.log('✅ Usuário de teste removido com sucesso');
    
    return NextResponse.json({
      success: true,
      message: 'Teste de escrita no MongoDB concluído com sucesso',
      details: {
        userCreated: true,
        userRetrieved: !!savedUser,
        userDeleted: true,
        totalUsers: userCount
      }
    });
  } catch (error) {
    console.error('❌ Erro durante o teste de escrita:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erro durante o teste de escrita no MongoDB',
      error: error.message
    }, { status: 500 });
  } finally {
    // Sempre fechar a conexão com o banco
    await prisma.$disconnect();
    console.log('🔒 Conexão com o MongoDB fechada');
  }
} 