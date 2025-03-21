import { NextResponse } from 'next/server';
import { prisma, dbHelpers } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    console.log('🗑️ Solicitação para excluir usuário ID:', id);

    if (!id) {
      console.error('❌ ID do usuário não fornecido');
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      );
    }
    
    // Excluir o usuário usando a função auxiliar
    const result = await dbHelpers.deleteUser(id);
    
    if (!result.success) {
      console.error('❌ Erro ao excluir usuário:', result.error);
      
      // Se o usuário não foi encontrado
      if (result.error.message === 'Usuário não encontrado') {
        return NextResponse.json(
          { error: 'Usuário não encontrado' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: `Erro ao excluir usuário: ${result.error.message}` },
        { status: 500 }
      );
    }
    
    console.log('✅ Usuário excluído com sucesso');

    return NextResponse.json({
      success: true,
      message: 'Usuário excluído com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir usuário' },
      { status: 500 }
    );
  }
} 