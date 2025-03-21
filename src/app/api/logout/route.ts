import { NextResponse } from 'next/server';
import { logAuth } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const { userId, email } = await request.json();
    console.log('🚪 Registrando logout para usuário:', email);
    
    // Registrar o logout nos logs do sistema
    await logAuth('LOGOUT', userId, email, true, {
      timestamp: new Date().toISOString()
    }, request);
    
    console.log('✅ Logout registrado com sucesso para:', email);
    
    return NextResponse.json({
      success: true,
      message: 'Logout registrado com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao registrar logout:', error);
    
    try {
      // Tentar registrar o erro de logout
      await logAuth('LOGOUT', undefined, 'unknown', false, {
        error: error instanceof Error ? error.message : String(error)
      }, request);
    } catch (logError) {
      console.error('❌ Erro adicional ao tentar registrar falha de logout:', logError);
    }
    
    return NextResponse.json(
      { error: 'Erro ao registrar logout' },
      { status: 500 }
    );
  }
} 