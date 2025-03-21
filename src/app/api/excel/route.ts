import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ExcelData } from '@/types/excel';
import { logSystemAction } from '@/lib/logger';

// API para salvar dados do Excel no MongoDB
export async function POST(request: Request) {
  console.log('🧮 Iniciando salvamento de dados Excel no MongoDB');
  
  try {
    const data = await request.json();
    console.log(`📊 Recebido ${Array.isArray(data) ? data.length : 1} registros para salvar`);
    
    // Conectando explicitamente ao banco
    await prisma.$connect();
    console.log('✅ Conexão com MongoDB estabelecida');
    
    let savedCount = 0;
    const errors = [];
    
    if (Array.isArray(data)) {
      // Processamento de múltiplos registros
      console.log(`🔄 Processando ${data.length} registros em lote`);
      
      for (const item of data) {
        try {
          // Convertendo dados do Excel para o formato do modelo ExcelData do Prisma
          const excelData = await prisma.excelData.create({
            data: {
              corretor: item['CORRETOR(A)'] || '',
              parceriaGestor: item['PARCERIA GESTORES'] || 'NÃO',
              teamId: item['PARCERIA GESTORES'] || 'default',
              gestorId: null, // Este campo seria preenchido com base na lógica de negócio
              // Outros campos podem ser adicionados conforme necessário
            }
          });
          
          console.log(`✅ Registro salvo com ID: ${excelData.id}`);
          savedCount++;
          
          // Registrar a criação do registro no log do sistema
          await logSystemAction({
            action: 'CREATE',
            entity: 'EXCEL_DATA',
            details: {
              event: 'excel_data_created',
              id: excelData.id,
              corretor: excelData.corretor
            },
            success: true
          });
        } catch (itemError) {
          console.error(`❌ Erro ao salvar registro: ${itemError.message}`);
          errors.push(itemError.message);
        }
      }
    } else {
      // Processamento de um único registro
      try {
        // Convertendo dados do Excel para o formato do modelo ExcelData do Prisma
        const excelData = await prisma.excelData.create({
          data: {
            corretor: data['CORRETOR(A)'] || '',
            parceriaGestor: data['PARCERIA GESTORES'] || 'NÃO',
            teamId: data['PARCERIA GESTORES'] || 'default',
            gestorId: null, // Este campo seria preenchido com base na lógica de negócio
            // Outros campos podem ser adicionados conforme necessário
          }
        });
        
        console.log(`✅ Registro único salvo com ID: ${excelData.id}`);
        savedCount++;
        
        // Registrar a criação do registro no log do sistema
        await logSystemAction({
          action: 'CREATE',
          entity: 'EXCEL_DATA',
          details: {
            event: 'excel_data_created',
            id: excelData.id,
            corretor: excelData.corretor
          },
          success: true
        });
      } catch (itemError) {
        console.error(`❌ Erro ao salvar registro único: ${itemError.message}`);
        errors.push(itemError.message);
      }
    }
    
    // Retornar resultado
    if (savedCount > 0) {
      return NextResponse.json({
        success: true,
        message: `${savedCount} registros salvos com sucesso`,
        savedCount,
        errorsCount: errors.length,
        errors: errors.length > 0 ? errors : undefined
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Não foi possível salvar os dados',
        errors
      }, { status: 500 });
    }
  } catch (error) {
    console.error('❌ Erro ao processar dados do Excel:', error);
    
    try {
      // Registrar o erro no log do sistema
      await logSystemAction({
        action: 'ERROR',
        entity: 'EXCEL_DATA',
        details: {
          event: 'excel_data_save_error',
          error: error.message
        },
        success: false
      });
    } catch (logError) {
      console.error('❌ Erro adicional ao registrar erro:', logError);
    }
    
    return NextResponse.json({
      success: false,
      message: 'Erro ao processar dados do Excel',
      error: error.message
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
    console.log('🔒 Conexão com MongoDB fechada');
  }
}

// API para buscar dados do Excel no MongoDB
export async function GET(request: Request) {
  console.log('🧮 Iniciando busca de dados Excel no MongoDB');
  
  try {
    const url = new URL(request.url);
    const teamId = url.searchParams.get('teamId');
    const corretor = url.searchParams.get('corretor');
    
    console.log(`📊 Buscando dados com filtros: teamId=${teamId || 'todos'}, corretor=${corretor || 'todos'}`);
    
    // Conectando explicitamente ao banco
    await prisma.$connect();
    console.log('✅ Conexão com MongoDB estabelecida');
    
    // Construir o filtro
    const filter: any = { active: true };
    if (teamId) filter.teamId = teamId;
    if (corretor) filter.corretor = corretor;
    
    // Buscar dados
    const excelData = await prisma.excelData.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`✅ Encontrados ${excelData.length} registros`);
    
    // Contagem total de registros
    const totalCount = await prisma.excelData.count({
      where: { active: true }
    });
    
    return NextResponse.json({
      success: true,
      data: excelData,
      count: excelData.length,
      totalCount
    });
  } catch (error) {
    console.error('❌ Erro ao buscar dados do Excel:', error);
    
    try {
      // Registrar o erro no log do sistema
      await logSystemAction({
        action: 'ERROR',
        entity: 'EXCEL_DATA',
        details: {
          event: 'excel_data_fetch_error',
          error: error.message
        },
        success: false
      });
    } catch (logError) {
      console.error('❌ Erro adicional ao registrar erro:', logError);
    }
    
    return NextResponse.json({
      success: false,
      message: 'Erro ao buscar dados do Excel',
      error: error.message
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
    console.log('🔒 Conexão com MongoDB fechada');
  }
} 