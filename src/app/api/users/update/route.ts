import { NextResponse } from 'next/server';
import { prisma, dbHelpers } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { id, ...userData } = data;
    console.log('✏️ Solicitação para atualizar usuário ID:', id);

    if (!id) {
      console.error('❌ ID do usuário não fornecido');
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      );
    }

    // Atualizar o usuário usando a função auxiliar
    const result = await dbHelpers.updateUser(id, userData);
    
    if (!result.success) {
      console.error('❌ Erro ao atualizar usuário:', result.error);
      
      // Se o usuário não foi encontrado
      if (result.error.message === 'Usuário não encontrado') {
        return NextResponse.json(
          { error: 'Usuário não encontrado' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: `Erro ao atualizar usuário: ${result.error.message}` },
        { status: 500 }
      );
    }
    
    console.log('✅ Usuário atualizado com sucesso');

    return NextResponse.json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      user: result.user
    });
  } catch (error) {
    console.error('❌ Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar usuário' },
      { status: 500 }
    );
  }
} 