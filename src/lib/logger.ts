import { prisma } from './prisma';

// Tipos de ação para logs
export const LogActions = {
  LOGIN: 'LOGIN',
  LOGIN_FAILED: 'LOGIN_FAILED',
  LOGOUT: 'LOGOUT',
  CREATE: 'CREATE',
  READ: 'READ',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  IMPORT: 'IMPORT',
  EXPORT: 'EXPORT',
  ERROR: 'ERROR',
  TEST: 'TEST',
  INIT: 'INIT'
} as const;

// Entidades do sistema para logs
export const LogEntities = {
  USER: 'USER',
  EXCEL_DATA: 'EXCEL_DATA',
  SYSTEM: 'SYSTEM',
  DATABASE: 'DATABASE',
  AUTH: 'AUTH'
} as const;

type LogAction = typeof LogActions[keyof typeof LogActions];
type LogEntity = typeof LogEntities[keyof typeof LogEntities];

// Interface para registros de log
interface LogData {
  userId?: string;
  action: LogAction;
  entity: LogEntity;
  details: Record<string, any>;
  success: boolean;
  ip?: string;
  userAgent?: string;
}

/**
 * Registra uma operação no sistema
 * @param logData Dados do log
 * @returns Promessa com o log registrado ou null em caso de erro
 */
export async function logSystemAction(logData: LogData) {
  try {
    // Certifique-se de que a conexão está estabelecida
    await prisma.$connect();
    
    // Convertemos detalhes para string JSON
    const details = JSON.stringify(logData.details);
    
    // Registramos no banco de dados
    const log = await prisma.systemLog.create({
      data: {
        userId: logData.userId,
        action: logData.action,
        entity: logData.entity,
        details,
        success: logData.success,
        ip: logData.ip,
        userAgent: logData.userAgent
      }
    });
    
    // Log de console simplificado para monitoramento
    console.log(`📝 LOG [${logData.action}] ${logData.entity}: ${logData.success ? '✅' : '❌'} ${details.substring(0, 100)}${details.length > 100 ? '...' : ''}`);
    
    return log;
  } catch (error) {
    // Em caso de erro, apenas registramos no console
    console.error('Erro ao registrar log:', error);
    return null;
  } finally {
    try {
      await prisma.$disconnect();
    } catch (error) {
      console.warn('Erro ao desconectar prisma no logger:', error);
    }
  }
}

/**
 * Registra uma operação de autenticação
 * @param action A ação de autenticação
 * @param userId ID do usuário (opcional)
 * @param email Email do usuário
 * @param success Se a autenticação foi bem-sucedida
 * @param details Detalhes adicionais
 * @param req Objeto de requisição (opcional, para obter IP e User-Agent)
 */
export async function logAuth(
  action: 'LOGIN' | 'LOGIN_FAILED' | 'LOGOUT', 
  userId: string | undefined, 
  email: string, 
  success: boolean,
  details: Record<string, any> = {},
  req?: Request
) {
  const ip = req?.headers.get('x-forwarded-for') || req?.headers.get('x-real-ip');
  const userAgent = req?.headers.get('user-agent');
  
  return logSystemAction({
    userId,
    action: action as LogAction,
    entity: LogEntities.AUTH,
    details: {
      email,
      ...details
    },
    success,
    ip: ip?.toString(),
    userAgent: userAgent?.toString()
  });
}

/**
 * Registra uma operação CRUD
 * @param action Ação CRUD
 * @param entity Entidade afetada
 * @param userId ID do usuário que realizou a ação
 * @param itemId ID do item afetado
 * @param success Se a operação foi bem-sucedida
 * @param details Detalhes adicionais
 */
export async function logCrud(
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE',
  entity: LogEntity,
  userId: string | undefined,
  itemId: string | undefined,
  success: boolean,
  details: Record<string, any> = {}
) {
  return logSystemAction({
    userId,
    action: action as LogAction,
    entity,
    details: {
      itemId,
      ...details
    },
    success
  });
}

/**
 * Registra um erro do sistema
 * @param entity Entidade relacionada ao erro
 * @param userId ID do usuário (se disponível)
 * @param error Objeto de erro
 * @param context Contexto adicional
 */
export async function logError(
  entity: LogEntity,
  userId: string | undefined,
  error: Error | unknown,
  context: Record<string, any> = {}
) {
  const errorDetails = error instanceof Error 
    ? { message: error.message, stack: error.stack }
    : { error };
    
  return logSystemAction({
    userId,
    action: LogActions.ERROR,
    entity,
    details: {
      ...errorDetails,
      ...context
    },
    success: false
  });
}

/**
 * Registra uma operação de teste ou diagnóstico
 * @param entity Entidade testada
 * @param success Se o teste foi bem-sucedido
 * @param details Detalhes do teste
 */
export async function logTest(
  entity: LogEntity,
  success: boolean,
  details: Record<string, any> = {}
) {
  return logSystemAction({
    action: LogActions.TEST,
    entity,
    details,
    success
  });
}