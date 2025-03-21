import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logTest, LogEntities } from '@/lib/logger';

export async function GET(request: Request) {
  console.log('🧪 Iniciando teste de conectividade com o MongoDB...');
  
  const diagnostics = {
    connectionTest: false,
    writeTest: false,
    readTest: false,
    deleteTest: false,
    userCount: 0,
    error: null,
    message: '',
    timestamp: new Date().toISOString()
  };
  
  try {
    // Desconectar qualquer conexão prévia
    await prisma.$disconnect();
    console.log('🔌 Desconectado de conexões anteriores');
    
    // Tentar estabelecer uma nova conexão
    await prisma.$connect();
    console.log('✅ Conexão com o MongoDB estabelecida com sucesso');
    diagnostics.connectionTest = true;
    
    try {
      // Contar usuários existentes para diagnóstico
      const userCount = await prisma.user.count();
      console.log(`📊 Contagem atual de usuários: ${userCount}`);
      diagnostics.userCount = userCount;
      
      // Testar criação de um registro temporário
      const testData = {
        name: `Teste Diagnóstico ${Date.now()}`,
        email: `teste.${Date.now()}@diagnostico.test`,
        password: 'senha-teste-123',
        role: 'TESTE',
      };
      
      console.log('🔄 Criando usuário de teste...');
      const createdUser = await prisma.user.create({
        data: {
          ...testData,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      
      console.log(`✅ Usuário de teste criado com sucesso. ID: ${createdUser.id}`);
      diagnostics.writeTest = true;
      
      // Tentar ler o usuário criado
      console.log('🔍 Verificando se o usuário foi salvo...');
      const foundUser = await prisma.user.findUnique({
        where: { id: createdUser.id }
      });
      
      if (foundUser) {
        console.log('✅ Usuário encontrado após criação');
        diagnostics.readTest = true;
      } else {
        console.error('❌ FALHA: Usuário não foi encontrado após criação');
      }
      
      // Excluir o usuário de teste
      console.log('🗑️ Removendo usuário de teste...');
      await prisma.user.delete({
        where: { id: createdUser.id }
      });
      
      console.log('✅ Usuário de teste removido com sucesso');
      diagnostics.deleteTest = true;
      
      // Nova contagem após o teste
      const finalCount = await prisma.user.count();
      console.log(`📊 Contagem final de usuários: ${finalCount}`);
      
      // Verificar se a contagem permaneceu a mesma
      if (finalCount === userCount) {
        console.log('✅ Contagem de usuários consistente após teste completo');
      } else {
        console.warn(`⚠️ Contagem de usuários inconsistente. Antes: ${userCount}, Depois: ${finalCount}`);
      }
      
      // Montar mensagem de diagnóstico
      diagnostics.message = 'Teste de conexão com MongoDB concluído com sucesso';
      
      // Registrar o sucesso nos logs
      await logTest(
        LogEntities.DATABASE,
        true,
        {
          userCount,
          finalCount,
          diagnostics,
          request: {
            url: request.url,
            method: request.method,
            headers: {
              userAgent: request.headers.get('user-agent'),
              host: request.headers.get('host')
            }
          }
        }
      );
    } catch (operationError) {
      console.error('❌ Erro durante operações de teste:', operationError);
      diagnostics.error = {
        message: operationError.message,
        code: operationError.code || 'UNKNOWN'
      };
      diagnostics.message = `Erro durante operações no banco de dados: ${operationError.message}`;
      
      // Registrar o erro nos logs
      await logTest(
        LogEntities.DATABASE,
        false,
        {
          errorType: 'OPERATION_ERROR',
          errorDetails: {
            message: operationError.message,
            code: operationError.code,
            stack: operationError.stack
          },
          diagnostics
        }
      );
    }
  } catch (connectionError) {
    console.error('❌ Erro ao conectar com MongoDB:', connectionError);
    diagnostics.error = {
      message: connectionError.message,
      code: connectionError.code || 'CONNECTION_FAILED'
    };
    diagnostics.message = `Falha na conexão com MongoDB: ${connectionError.message}`;
    
    // Tentamos registrar o erro em console apenas
    console.error('Não foi possível registrar no log devido a erro de conexão:', {
      errorType: 'CONNECTION_ERROR',
      errorDetails: {
        message: connectionError.message,
        code: connectionError.code,
        stack: connectionError.stack
      }
    });
  } finally {
    // Garantir que a conexão seja fechada
    try {
      await prisma.$disconnect();
      console.log('🔒 Conexão com MongoDB fechada');
    } catch (disconnectError) {
      console.warn('⚠️ Erro ao fechar conexão:', disconnectError);
    }
  }
  
  // Retornar resultado do diagnóstico
  return NextResponse.json({
    success: diagnostics.connectionTest && diagnostics.writeTest && diagnostics.readTest && diagnostics.deleteTest,
    diagnostics,
    mongoUrl: process.env.DATABASE_URL?.substring(0, 25) + '...' // Mostrar início da URL por segurança
  });
} 