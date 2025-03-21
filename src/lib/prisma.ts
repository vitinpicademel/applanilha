import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt';

// Configuração adicional para logs e debug
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query', 'error', 'warn'],
    errorFormat: 'pretty',
  })
}

// Tipo para o global no Node.js
declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

// Usar um cliente global em desenvolvimento para evitar muitas conexões 
// durante hot-reloading, ou criar um novo para produção
export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

// Função para verificar a conexão com o MongoDB
export async function testConnection() {
  try {
    await prisma.$connect()
    console.log('✅ Conexão com MongoDB estabelecida com sucesso!')
    return true
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error)
    return false
  } finally {
    await prisma.$disconnect()
  }
}

// Funções utilitárias para operações padronizadas
export const dbHelpers = {
  // Função para criar um usuário com timestamps automáticos
  async createUser(userData: any) {
    try {
      // Garantir que a conexão está estabelecida
      await prisma.$connect();
      console.log('✅ Conexão estabelecida para criar usuário');
      
      // Remover campos inválidos que possam causar problemas
      const { id, _id, ...cleanedData } = userData;
      
      // Adicionar timestamps
      const dataWithTimestamps = {
        ...cleanedData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      console.log('🔧 Preparando dados para criação:', 
        JSON.stringify({
          ...dataWithTimestamps,
          password: '[REDACTED]'
        }, null, 2)
      );
      
      // Criar o usuário
      const user = await prisma.user.create({
        data: dataWithTimestamps
      });
      
      console.log(`✅ Usuário criado com sucesso. ID gerado: ${user.id}`);
      
      // Verificar se o usuário foi realmente criado
      const verifiedUser = await prisma.user.findUnique({
        where: { id: user.id }
      });
      
      if (!verifiedUser) {
        throw new Error('Falha na verificação: usuário não encontrado após criação');
      }
      
      console.log(`✅ Verificação concluída: usuário ${verifiedUser.email} existe no banco de dados`);
      
      return { success: true, user };
    } catch (error) {
      console.error('❌ Erro ao criar usuário:', error);
      return { success: false, error };
    } finally {
      // Garantir que a conexão seja fechada
      try {
        await prisma.$disconnect();
        console.log('🔒 Conexão com MongoDB fechada após criação de usuário');
      } catch (disconnectError) {
        console.error('⚠️ Erro ao desconectar do MongoDB:', disconnectError);
      }
    }
  },
  
  // Função para atualizar o timestamp de último login
  async updateLastLogin(userId: string) {
    try {
      await prisma.$connect();
      const user = await prisma.user.update({
        where: { id: userId },
        data: { 
          lastLogin: new Date(),
          updatedAt: new Date()
        }
      });
      return { success: true, user };
    } catch (error) {
      console.error('❌ Erro ao atualizar último login:', error);
      return { success: false, error };
    } finally {
      await prisma.$disconnect();
    }
  },
  
  // Função para buscar usuários com filtros
  async getUsers(filters: any = {}) {
    try {
      await prisma.$connect();
      
      const users = await prisma.user.findMany({
        where: filters,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          teamId: true,
          managerId: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      
      return { success: true, users };
    } catch (error) {
      console.error('❌ Erro ao buscar usuários:', error);
      return { success: false, error };
    } finally {
      await prisma.$disconnect();
    }
  },
  
  // Função para excluir um usuário
  async deleteUser(userId: string) {
    try {
      await prisma.$connect();
      
      // Verificar se o usuário existe
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      
      if (!user) {
        return { success: false, error: { message: 'Usuário não encontrado' } };
      }
      
      // Excluir o usuário
      await prisma.user.delete({
        where: { id: userId }
      });
      
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao excluir usuário:', error);
      return { success: false, error };
    } finally {
      await prisma.$disconnect();
    }
  },
  
  // Função para atualizar um usuário
  async updateUser(userId: string, userData: any) {
    try {
      await prisma.$connect();
      
      // Verificar se o usuário existe
      const existingUser = await prisma.user.findUnique({
        where: { id: userId }
      });
      
      if (!existingUser) {
        return { success: false, error: { message: 'Usuário não encontrado' } };
      }
      
      // Se a senha estiver sendo atualizada, criptografá-la
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
      }
      
      // Atualizar o usuário sempre com o timestamp atualizado
      const data = {
        ...userData,
        updatedAt: new Date()
      };
      
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data
      });
      
      // Remover a senha antes de retornar
      const { password, ...userWithoutPassword } = updatedUser;
      
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error('❌ Erro ao atualizar usuário:', error);
      return { success: false, error };
    } finally {
      await prisma.$disconnect();
    }
  }
}; 