import { prisma } from './prisma';

async function testDatabaseConnection() {
  try {
    // Tenta conectar ao banco de dados
    await prisma.$connect();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');

    // Tenta criar um usuário de teste
    const testUser = await prisma.user.create({
      data: {
        name: 'Teste',
        email: 'teste@teste.com',
        password: '123456',
        role: 'MASTER',
      },
    });
    console.log('✅ Usuário de teste criado com sucesso:', testUser);

    // Deleta o usuário de teste
    await prisma.user.delete({
      where: {
        email: 'teste@teste.com',
      },
    });
    console.log('✅ Usuário de teste removido com sucesso');

  } catch (error) {
    console.error('❌ Erro ao testar o banco de dados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection(); 