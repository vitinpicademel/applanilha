import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { logError, LogEntities } from '@/lib/logger';

export async function GET(request: Request) {
  try {
    // Verificar autenticação e autorização
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ 
        error: 'Acesso não autorizado' 
      }, { status: 403 });
    }

    // Obter parâmetros da URL
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const entity = searchParams.get('entity');
    const successParam = searchParams.get('success');
    const limit = Number(searchParams.get('limit') || '100');
    
    console.log(`🔍 Consultando logs com filtros: action=${action}, entity=${entity}, success=${successParam}, limit=${limit}`);

    // Construir query base
    const whereClause: any = {};
    
    if (action) {
      whereClause.action = action;
    }
    
    if (entity) {
      whereClause.entity = entity;
    }
    
    if (successParam !== null) {
      whereClause.success = successParam === 'true';
    }

    // Tentar estabelecer conexão
    await prisma.$connect();

    // Buscar logs com paginação e ordenação
    const logs = await prisma.systemLog.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
      take: Math.min(limit, 500), // Limitar a no máximo 500 registros
    });
    
    // Contar total de registros que atendem aos critérios
    const totalCount = await prisma.systemLog.count({
      where: whereClause,
    });
    
    console.log(`📊 Encontrados ${logs.length} logs de um total de ${totalCount}`);

    // Fechar conexão
    await prisma.$disconnect();

    // Retornar resultados
    return NextResponse.json({
      logs,
      totalCount,
      filters: {
        action,
        entity,
        success: successParam,
        limit,
      },
    });
  } catch (error) {
    console.error('❌ Erro ao consultar logs:', error);
    
    // Registrar o erro (se possível)
    try {
      await logError(
        LogEntities.SYSTEM,
        undefined,
        error,
        { 
          endpoint: '/api/logs',
          method: 'GET',
          url: request.url
        }
      );
    } catch (logError) {
      console.error('Erro adicional ao tentar registrar erro:', logError);
    }
    
    // Retornar erro
    return NextResponse.json({
      error: 'Erro ao consultar logs do sistema',
      details: process.env.NODE_ENV === 'development' 
        ? error instanceof Error ? error.message : String(error)
        : undefined
    }, { status: 500 });
  } finally {
    // Garantir que a conexão seja fechada em qualquer caso
    try {
      await prisma.$disconnect();
    } catch (e) {
      // Ignorar erros de desconexão
    }
  }
} 