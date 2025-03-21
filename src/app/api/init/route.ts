import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { logSystemAction, LogActions, LogEntities } from '@/lib/logger';

export async function GET(request: Request) {
  console.log('🚀 Iniciando processo de inicialização do sistema...');
  
  try {
    // Verificar conexão com o MongoDB
    try {
      // Conectando explicitamente ao banco
      await prisma.$disconnect();
      await prisma.$connect();
      console.log('✅ Conexão com o MongoDB estabelecida com sucesso!');
      
      // Registrar a inicialização do sistema
      await logSystemAction({
        action: LogActions.INIT,
        entity: LogEntities.SYSTEM,
        details: {
          event: 'system_initialization',
          url: request.url,
          headers: {
            userAgent: request.headers.get('user-agent'),
            host: request.headers.get('host')
          }
        },
        success: true
      });
      
      // Verificar se já existe um usuário MASTER
      const existingMaster = await prisma.user.findFirst({
        where: { role: 'MASTER' }
      });

      // Se já existir, retorna informações dele
      if (existingMaster) {
        console.log('👤 Usuário master já existe:', existingMaster.email);
        const { password: _, ...masterWithoutPassword } = existingMaster;
        
        await logSystemAction({
          action: LogActions.INIT,
          entity: LogEntities.USER,
          details: {
            event: 'master_user_exists',
            userId: existingMaster.id,
            email: existingMaster.email
          },
          success: true
        });
        
        return NextResponse.json({
          success: true,
          message: 'Usuário master já existe',
          user: masterWithoutPassword,
          credentials: {
            email: existingMaster.email,
            password: 'Senha oculta por segurança. Use a senha original.'
          }
        });
      }

      console.log('🔧 Criando novo usuário master...');
      
      // Criar um novo usuário MASTER
      const password = 'admin123'; // Senha padrão
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const masterUser = await prisma.user.create({
        data: {
          name: 'Administrador',
          email: 'admin@admin.com',
          password: hashedPassword,
          role: 'MASTER',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      console.log('✅ Usuário master criado com sucesso:', masterUser.id);
      
      // Registrar a criação do usuário master
      await logSystemAction({
        action: LogActions.CREATE,
        entity: LogEntities.USER,
        details: {
          event: 'master_user_created',
          userId: masterUser.id,
          email: masterUser.email
        },
        success: true
      });
      
      // Remover a senha antes de retornar
      const { password: _, ...userWithoutPassword } = masterUser;

      return NextResponse.json({
        success: true,
        message: 'Usuário master criado com sucesso',
        user: userWithoutPassword,
        credentials: {
          email: 'admin@admin.com',
          password: 'admin123'
        }
      });
    } catch (dbError) {
      console.error('❌ Erro ao acessar banco de dados:', dbError);
      
      // Registrar o erro
      await logSystemAction({
        action: LogActions.ERROR,
        entity: LogEntities.DATABASE,
        details: {
          event: 'initialization_db_error',
          error: dbError.message,
          stack: dbError.stack
        },
        success: false
      });
      
      return NextResponse.json(
        { 
          error: 'Erro ao acessar banco de dados', 
          details: dbError.message,
          stack: process.env.NODE_ENV === 'development' ? dbError.stack : undefined
        },
        { status: 500 }
      );
    } finally {
      await prisma.$disconnect();
      console.log('🔒 Conexão com MongoDB fechada');
    }
  } catch (error) {
    console.error('❌ Erro ao inicializar sistema:', error);
    
    try {
      // Tentar registrar o erro, mesmo se houver problemas de conexão
      await logSystemAction({
        action: LogActions.ERROR,
        entity: LogEntities.SYSTEM,
        details: {
          event: 'initialization_error',
          error: error instanceof Error ? error.message : String(error)
        },
        success: false
      });
    } catch (logError) {
      console.error('❌ Erro adicional ao tentar registrar erro:', logError);
    }
    
    return NextResponse.json(
      { error: 'Erro ao inicializar o sistema' },
      { status: 500 }
    );
  }
} 