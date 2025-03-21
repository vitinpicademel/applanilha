'use client';

import { createContext, useContext, useState, useRef } from 'react';
import { ExcelData } from '@/types/excel';
import { HistoryEntry } from '@/types/history';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';

const EXPECTED_COLUMNS = [
  'ITEM',
  'DATA',
  'CLIENTE',
  'CPF',
  'CORRETOR(A)',
  'PARCERIA CORRETORES',
  'PARCERIA GESTORES',
  'ORIGEM DO LEAD',
  'INCORPORADORA',
  'TIPO DO IMÓVEL',
  'INFORMAÇÃO DO IMÓVEL',
  'VGV R$',
  'FORMA DE PAGAMENTO',
  'APROVAÇÃO',
  'OBS',
  'SITUAÇÃO',
  '% COMISSÃO PREVISTA',
  'VGC PREVISTA',
  'VGC REAL',
  'CAPTADOR?',
  'NOME DO CAPTADOR',
  '% COMISSÃO REAL',
  '% COMISSÃO GESTOR'
];

interface DataContextType {
  excelData: ExcelData[];
  setExcelData: (data: ExcelData[]) => void;
  selectedRow: { data: ExcelData; index: number } | null;
  setSelectedRow: (row: { data: ExcelData; index: number } | null) => void;
  editModalOpen: boolean;
  setEditModalOpen: (open: boolean) => void;
  clearAllData: () => void;
  history: HistoryEntry[];
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  addHistoryEntry: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  addNewRow: (data: Omit<ExcelData, 'ITEM'>) => void;
  addDataFromXLSX: () => void;
  handleExport: () => void;
  fetchFromMongoDB: () => Promise<boolean>;
  saveCurrentData: () => Promise<boolean>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [excelData, setExcelData] = useState<ExcelData[]>([]);
  const [selectedRow, setSelectedRow] = useState<{ data: ExcelData; index: number } | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const addHistoryEntry = (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
    };
    setHistory(prev => [newEntry, ...prev]);
  };

  const clearAllData = () => {
    if (excelData.length === 0) {
      toast.error('Não há dados para limpar na planilha.', {
        style: {
          background: '#373737',
          color: '#fff',
          border: '1px solid #938667',
        },
        iconTheme: {
          primary: '#938667',
          secondary: '#fff',
        },
      });
      return;
    }

    if (window.confirm('Tem certeza que deseja limpar todos os dados da planilha?')) {
      setExcelData([]);
      addHistoryEntry({
        type: 'REMOÇÃO',
        description: 'Todos os dados da planilha foram removidos',
        details: {
          before: excelData,
          after: []
        }
      });
      toast.success('Planilha limpa com sucesso!', {
        style: {
          background: '#373737',
          color: '#fff',
          border: '1px solid #938667',
        },
        iconTheme: {
          primary: '#938667',
          secondary: '#fff',
        },
      });
    }
  };

  const addNewRow = (data: Omit<ExcelData, 'ITEM'>) => {
    const newRow = {
      ITEM: (excelData.length + 1).toString(),
      ...data
    } as ExcelData;

    setExcelData(prev => [...prev, newRow]);
    addHistoryEntry({
      type: 'ADIÇÃO',
      description: 'Nova linha adicionada',
      details: {
        after: newRow
      }
    });

    toast.success('Nova linha adicionada localmente', {
      style: {
        background: '#373737',
        color: '#fff',
        border: '1px solid #938667'
      },
      iconTheme: {
        primary: '#938667',
        secondary: '#fff'
      }
    });
    
    toast.info('Clique em "Sincronizar DB" para salvar os dados no banco de dados', {
      duration: 5000,
      style: {
        background: '#373737',
        color: '#fff',
        border: '1px solid #007bff'
      },
      iconTheme: {
        primary: '#007bff',
        secondary: '#fff'
      }
    });
  };

  const addDataFromXLSX = () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.xlsx,.xls';
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          toast.error('Nenhum arquivo selecionado');
          return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const binaryString = event.target?.result;
            const workbook = XLSX.read(binaryString, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            
            // Converter para JSON mantendo os tipos de dados
            const rawData = XLSX.utils.sheet_to_json(worksheet, {
              raw: false,
              defval: '',
              blankrows: false
            });

            if (!Array.isArray(rawData) || rawData.length === 0) {
              toast.error('Nenhum dado encontrado na planilha');
              return;
            }

            // Criar array temporário para os novos dados
            const newDataArray: ExcelData[] = [];

            // Processar cada linha e filtrar linhas vazias
            rawData.forEach((row: any, index: number) => {
              // Verifica se a linha tem pelo menos um dos campos essenciais preenchidos
              if (row['CLIENTE'] || row['CPF'] || row['DATA'] || row['CORRETOR(A)']) {
                const newData = {
                  ITEM: (newDataArray.length + 1).toString(), // Reajusta a numeração
                  DATA: row['DATA'] || '',
                  CLIENTE: row['CLIENTE'] || '',
                  CPF: row['CPF'] || '',
                  'CORRETOR(A)': row['CORRETOR(A)'] || '',
                  'PARCERIA CORRETORES': row['PARCERIA CORRETORES'] || '',
                  'PARCERIA GESTORES': row['PARCERIA GESTORES'] || '',
                  'ORIGEM DO LEAD': row['ORIGEM DO LEAD'] || '',
                  INCORPORADORA: row['INCORPORADORA'] || '',
                  'TIPO DO IMÓVEL': row['TIPO DO IMÓVEL'] || '',
                  'INFORMAÇÃO DO IMÓVEL': row['INFORMAÇÃO DO IMÓVEL'] || '',
                  'VGV R$': row['VGV R$']?.toString() || '',
                  'FORMA DE PAGAMENTO': row['FORMA DE PAGAMENTO'] || '',
                  APROVAÇÃO: row['APROVAÇÃO'] || '',
                  OBS: row['OBS'] || '',
                  SITUAÇÃO: row['SITUAÇÃO'] || '',
                  '% COMISSÃO PREVISTA': row['% COMISSÃO PREVISTA']?.toString() || '',
                  'VGC PREVISTA': row['VGC PREVISTA']?.toString() || '',
                  'VGC REAL': row['VGC REAL']?.toString() || '',
                  'CAPTADOR?': row['CAPTADOR?'] || '',
                  'NOME DO CAPTADOR': row['NOME DO CAPTADOR'] || '',
                  '% COMISSÃO REAL': row['% COMISSÃO REAL']?.toString() || '',
                  '% COMISSÃO GESTOR': row['% COMISSÃO GESTOR']?.toString() || ''
                } as ExcelData;

                newDataArray.push(newData);
              }
            });

            // Atualizar o estado com todos os dados de uma vez
            setExcelData(newDataArray);

            // Adicionar entrada no histórico
            addHistoryEntry({
              type: 'IMPORTAÇÃO',
              description: `${newDataArray.length} registros importados do arquivo ${file.name}`,
              details: {
                after: newDataArray
              }
            });

            toast.success(`${newDataArray.length} registros importados localmente!`, {
              style: {
                background: '#373737',
                color: '#fff',
                border: '1px solid #938667'
              },
              iconTheme: {
                primary: '#938667',
                secondary: '#fff'
              }
            });
            
            toast.info('Clique em "Sincronizar DB" para salvar os dados no banco de dados', {
              duration: 5000,
              style: {
                background: '#373737',
                color: '#fff',
                border: '1px solid #007bff'
              },
              iconTheme: {
                primary: '#007bff',
                secondary: '#fff'
              }
            });
          } catch (error) {
            console.error('Erro ao processar arquivo:', error);
            toast.error('Erro ao processar o arquivo. Verifique se o formato está correto.');
          }
        };

        reader.onerror = () => {
          toast.error('Erro ao ler o arquivo');
        };

        reader.readAsBinaryString(file);
      };

      input.click();
    } catch (error) {
      console.error('Erro ao importar arquivo:', error);
      toast.error('Erro ao importar arquivo');
    }
  };

  const handleExport = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");
      XLSX.writeFile(workbook, "dados_exportados.xlsx");
      toast.success('Dados exportados com sucesso para Excel!', {
        style: {
          background: '#373737',
          color: '#fff',
          border: '1px solid #938667'
        },
        iconTheme: {
          primary: '#938667',
          secondary: '#fff'
        }
      });
    } catch (error) {
      console.error('Erro ao exportar arquivo:', error);
      toast.error('Erro ao exportar arquivo');
    }
  };

  // Função para salvar dados no MongoDB
  const saveToMongoDB = async (data: ExcelData | ExcelData[]) => {
    try {
      console.log('💾 Salvando dados no MongoDB...');
      
      const response = await fetch('/api/excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Dados salvos com sucesso no MongoDB: ${result.message}`);
        return true;
      } else {
        console.error('❌ Erro ao salvar no MongoDB:', result.message || 'Erro desconhecido');
        console.error('Detalhes do erro:', result.errors || result.error);
        
        toast.error(`Erro ao salvar no banco de dados: ${result.message || 'Falha na operação'}`, {
          style: {
            background: '#373737',
            color: '#fff',
            border: '1px solid #938667'
          },
          iconTheme: {
            primary: '#938667',
            secondary: '#fff'
          }
        });
        
        return false;
      }
    } catch (error) {
      console.error('❌ Exceção ao salvar no MongoDB:', error);
      
      toast.error('Erro de conexão ao salvar no banco de dados', {
        style: {
          background: '#373737',
          color: '#fff',
          border: '1px solid #938667'
        },
        iconTheme: {
          primary: '#938667',
          secondary: '#fff'
        }
      });
      
      return false;
    }
  };
  
  // Função para buscar dados do MongoDB
  const fetchFromMongoDB = async () => {
    try {
      console.log('🔄 Buscando dados do MongoDB...');
      
      const response = await fetch('/api/excel', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Dados recuperados com sucesso: ${result.count} registros`);
        // Converter os dados do formato MongoDB para o formato ExcelData
        const convertedData = result.data.map((item: any, index: number) => ({
          ITEM: (index + 1).toString(),
          'CORRETOR(A)': item.corretor || '',
          'PARCERIA GESTORES': item.parceriaGestor || 'NÃO',
          // Adicione outros campos conforme necessário
          DATA: new Date(item.createdAt).toLocaleDateString('pt-BR'),
          SITUAÇÃO: 'PENDENTE'
        } as ExcelData));
        
        setExcelData(convertedData);
        return true;
      } else {
        console.error('❌ Erro ao buscar dados:', result.message || 'Erro desconhecido');
        
        toast.error(`Erro ao carregar dados: ${result.message || 'Falha na operação'}`, {
          style: {
            background: '#373737',
            color: '#fff',
            border: '1px solid #938667'
          },
          iconTheme: {
            primary: '#938667',
            secondary: '#fff'
          }
        });
        
        return false;
      }
    } catch (error) {
      console.error('❌ Exceção ao buscar dados:', error);
      
      toast.error('Erro de conexão ao carregar dados', {
        style: {
          background: '#373737',
          color: '#fff',
          border: '1px solid #938667'
        },
        iconTheme: {
          primary: '#938667',
          secondary: '#fff'
        }
      });
      
      return false;
    }
  };

  // Nova função para salvar explicitamente os dados atuais no MongoDB
  const saveCurrentData = async () => {
    try {
      console.log('💾 Salvando dados atuais no MongoDB...');
      
      const loadingToast = toast.loading('Salvando dados no banco de dados...', {
        style: {
          background: '#373737',
          color: '#fff',
          border: '1px solid #938667'
        }
      });
      
      // Salvar os dados atuais no MongoDB
      const success = await saveToMongoDB(excelData);
      
      toast.dismiss(loadingToast);
      
      if (success) {
        toast.success('Dados salvos com sucesso no banco de dados!', {
          style: {
            background: '#373737',
            color: '#fff',
            border: '1px solid #938667'
          },
          iconTheme: {
            primary: '#938667',
            secondary: '#fff'
          }
        });
        return true;
      } else {
        toast.error('Erro ao salvar dados no banco de dados', {
          style: {
            background: '#373737',
            color: '#fff',
            border: '1px solid #938667'
          },
          iconTheme: {
            primary: '#938667',
            secondary: '#fff'
          }
        });
        return false;
      }
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      
      toast.error('Erro ao salvar dados no banco de dados', {
        style: {
          background: '#373737',
          color: '#fff',
          border: '1px solid #938667'
        },
        iconTheme: {
          primary: '#938667',
          secondary: '#fff'
        }
      });
      
      return false;
    }
  };

  return (
    <DataContext.Provider
      value={{
        excelData,
        setExcelData,
        selectedRow,
        setSelectedRow,
        editModalOpen,
        setEditModalOpen,
        clearAllData,
        history,
        showHistory,
        setShowHistory,
        addHistoryEntry,
        addNewRow,
        addDataFromXLSX,
        handleExport,
        fetchFromMongoDB,
        saveCurrentData
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData deve ser usado dentro de um DataProvider');
  }
  return context;
} 