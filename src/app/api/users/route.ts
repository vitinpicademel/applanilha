import { NextResponse } from 'next/server';
import { prisma, dbHelpers } from '@/lib/prisma';
import { NextRequest } from 'next/server';

// Função comum para processar a requisição
async function handleRequest(request: NextRequest) {
  try {
    console.log('📋 Buscando usuários...');
    
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get('role');
    const managerId = searchParams.get('managerId');
    const timestamp = searchParams.get('_t'); // Isso ajuda a evitar cache

    console.log(`🔍 Parâmetros: role=${role || 'todos'}, managerId=${managerId || 'N/A'}, timestamp=${timestamp || 'nenhum'}`);

    let whereClause = {};

    // Filtrar por papel, se fornecido
    if (role) {
      whereClause = { ...whereClause, role };
      console.log(`🔍 Filtrando por cargo: ${role}`);
    }

    // Filtrar por gestor, se fornecido
    if (managerId) {
      whereClause = { ...whereClause, managerId };
      console.log(`🔍 Filtrando por gestor: ${managerId}`);
    }

    try {
      // Garantir uma conexão fresca
      await prisma.$disconnect();
      await prisma.$connect();
      console.log('✅ Conexão com o MongoDB estabelecida');
      
      // Buscar usuários diretamente com o Prisma
      console.log('🔍 Consultando usuários no banco de dados...');
      const users = await prisma.user.findMany({
        where: whereClause,
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
      
      console.log(`✅ ${users.length} usuários encontrados`);
      
      // Contar total de usuários para verificação
      const totalUsers = await prisma.user.count();
      console.log(`📊 Total de usuários no banco: ${totalUsers}`);

      return NextResponse.json({
        success: true,
        users,
        totalCount: totalUsers
      });
    } catch (dbError) {
      console.error('❌ Erro ao acessar banco de dados:', dbError);
      return NextResponse.json(
        { error: `Erro ao buscar usuários: ${dbError.message}` },
        { status: 500 }
      );
    } finally {
      await prisma.$disconnect();
      console.log('🔒 Conexão com o MongoDB fechada');
    }
  } catch (error) {
    console.error('❌ Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar usuários' },
      { status: 500 }
    );
  }
}

// Suportar tanto GET quanto POST para garantir que o cliente possa evitar cache
export const GET = handleRequest;
export const POST = handleRequest; 