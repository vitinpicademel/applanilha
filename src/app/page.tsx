'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import ExcelTable from '@/components/ExcelTable';
import { useData } from './context/DataContext';
import EditModal from '@/components/EditModal';
import SearchAndFilter from '@/components/SearchAndFilter';
import HistoryModal from '@/components/HistoryModal';
import { ExcelData } from '@/types/excel';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuth } from './context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { 
    excelData, 
    setExcelData,
    selectedRow,
    editModalOpen,
    setEditModalOpen,
    setSelectedRow,
    clearAllData,
    history,
    showHistory,
    setShowHistory,
    addNewRow,
    addDataFromXLSX,
    fetchFromMongoDB,
    saveCurrentData
  } = useData();
  
  const { user, isAuthenticated } = useAuth();
  const [filteredData, setFilteredData] = useState<ExcelData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState('TODOS');
  const [selectedStatus, setSelectedStatus] = useState('TODAS');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [showInitialLoadPrompt, setShowInitialLoadPrompt] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Substituir o useEffect de carregamento automático com notificação
  useEffect(() => {
    if (isAuthenticated && user) {
      // Mostra mensagem informativa sobre o carregamento manual
      if (showInitialLoadPrompt) {
        toast(
          'Clique no botão "Carregar do DB" para carregar os dados do banco de dados',
          {
            duration: 5000,
            icon: '🔔',
            style: {
              background: '#373737',
              color: '#fff',
              border: '1px solid #007bff'
            },
            iconTheme: {
              primary: '#007bff',
              secondary: '#fff'
            }
          }
        );
        setShowInitialLoadPrompt(false);
      }
    }
  }, [isAuthenticated, user, showInitialLoadPrompt]);

  // Função para filtrar os dados baseado no cargo do usuário
  const filterDataByRole = useCallback((data: ExcelData[]) => {
    if (!user) {
      console.log('Sem usuário, retornando array vazio');
      return [];
    }

    console.log('Filtrando por cargo:', user.role);
    console.log('ID da equipe:', user.teamId);
    console.log('Nome do usuário:', user.name);
    console.log('Dados recebidos para filtrar:', data);

    switch (user.role) {
      case 'MASTER':
        console.log('Usuário MASTER - retornando todos os dados');
        return data;
      case 'GESTOR':
        console.log('Usuário GESTOR - retornando todos os dados temporariamente');
        return data;
      case 'CORRETOR':
        console.log('Usuário CORRETOR - filtrando por nome');
        const filteredByCorretor = data.filter(row => row['CORRETOR(A)'] === user.name);
        console.log('Dados filtrados para CORRETOR:', filteredByCorretor);
        return filteredByCorretor;
      default:
        console.log('Cargo desconhecido, retornando array vazio');
        return [];
    }
  }, [user]);

  // Atualiza os dados filtrados quando os filtros ou dados mudam
  useEffect(() => {
    console.log('useEffect: Atualizando dados filtrados');
    console.log('excelData:', excelData);
    console.log('user:', user);
    
    // Se não houver dados, não faz nada
    if (!excelData || excelData.length === 0) {
      console.log('Nenhum dado disponível');
      setFilteredData([]);
      return;
    }

    // Se não houver usuário, não faz nada
    if (!user) {
      console.log('Nenhum usuário logado');
      setFilteredData([]);
      return;
    }

    // Aplica o filtro por cargo
    let result = filterDataByRole(excelData);
    console.log('Dados após filtro por cargo:', result);

    // Aplica o filtro de busca
    if (searchTerm.trim()) {
      result = result.filter(item => {
        if (selectedField === 'TODOS') {
          return Object.values(item).some(value =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
          );
        } else {
          return item[selectedField]?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        }
      });
    }

    // Aplica o filtro de situação
    if (selectedStatus !== 'TODAS') {
      result = result.filter(item => item['SITUAÇÃO'] === selectedStatus);
    }

    // Atualiza os dados filtrados
    setFilteredData(result);
  }, [excelData, user, filterDataByRole, searchTerm, selectedField, selectedStatus]);

  const handleAddRow = () => {
    if (user?.role === 'CORRETOR') {
      toast.error('Corretores não podem adicionar novos dados');
      return;
    }

    const newData: Omit<ExcelData, 'ITEM'> = {
      DATA: new Date().toLocaleDateString('pt-BR'),
      CLIENTE: '',
      CPF: '',
      'CORRETOR(A)': user?.role === 'GESTOR' ? '' : user?.name || '',
      'PARCERIA CORRETORES': '',
      'PARCERIA GESTORES': user?.role === 'GESTOR' ? user.teamId || '' : '',
      'ORIGEM DO LEAD': '',
      INCORPORADORA: '',
      'TIPO DO IMÓVEL': '',
      'INFORMAÇÃO DO IMÓVEL': '',
      'VGV R$': '',
      'FORMA DE PAGAMENTO': '',
      APROVAÇÃO: '',
      OBS: '',
      SITUAÇÃO: 'PENDENTE',
      '% COMISSÃO PREVISTA': '',
      'VGC PREVISTA': '',
      'VGC REAL': '',
      'CAPTADOR?': '',
      'NOME DO CAPTADOR': '',
      '% COMISSÃO REAL': '',
      '% COMISSÃO GESTOR': ''
    };

    addNewRow(newData);
  };

  const handleSaveRow = (updatedData: ExcelData) => {
    if (!selectedRow) return;
    
    const newData = [...excelData];
    newData[selectedRow.index] = updatedData;
    setExcelData(newData);
    setSelectedRow(null);
    setEditModalOpen(false);
    toast.success('Linha atualizada com sucesso!');
  };

  const handleDataChange = (newData: ExcelData[]) => {
    setExcelData(newData);
    toast.success('Dados atualizados com sucesso!');
  };

  // Função para exportar dados
  const exportData = (format: 'xlsx' | 'csv' | 'pdf') => {
    try {
      if (format === 'xlsx' || format === 'csv') {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");
        
        if (format === 'xlsx') {
          XLSX.writeFile(workbook, "dados_exportados.xlsx");
          toast.success('Dados exportados com sucesso para Excel!');
        } else {
          XLSX.writeFile(workbook, "dados_exportados.csv");
          toast.success('Dados exportados com sucesso para CSV!');
        }
      } else if (format === 'pdf') {
        const doc = new jsPDF('l', 'mm', 'a4');
        doc.setFont('helvetica');
        doc.setFontSize(16);
        doc.text('Relatório de Vendas', 15, 15);
        doc.setFontSize(10);
        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 15, 22);
        
        const headers = Object.keys(filteredData[0] || {});
        const data = filteredData.map(row => 
          headers.map(header => {
            const value = row[header];
            return typeof value === 'number' 
              ? value.toLocaleString('pt-BR')
              : String(value || '');
          })
        );
        
        autoTable(doc, {
          head: [headers],
          body: data,
          startY: 30,
          theme: 'grid',
          styles: {
            fontSize: 8,
            cellPadding: 1,
            overflow: 'linebreak',
            cellWidth: 'wrap'
          },
          headStyles: {
            fillColor: [55, 55, 55],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245]
          }
        });
        
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.text(
            `Página ${i} de ${pageCount}`,
            doc.internal.pageSize.width - 20,
            doc.internal.pageSize.height - 10,
            { align: 'right' }
          );
        }
        
        doc.save('dados_exportados.pdf');
        toast.success('Dados exportados com sucesso para PDF!');
      }
    } catch (error) {
      toast.error('Erro ao exportar dados');
      console.error('Erro na exportação:', error);
    }
  };

  // Função para carregar dados do MongoDB
  const handleLoadFromDB = () => {
    if (confirm('Deseja carregar os dados do banco de dados? Isso substituirá os dados atuais.')) {
      const loadingToast = toast.loading('Carregando dados do banco de dados...', {
        style: {
          background: '#373737',
          color: '#fff',
          border: '1px solid #938667'
        }
      });
      
      fetchFromMongoDB()
        .then(success => {
          toast.dismiss(loadingToast);
          if (success) {
            toast.success('Dados carregados com sucesso!', {
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
          }
        })
        .catch(error => {
          toast.dismiss(loadingToast);
          console.error('Erro ao carregar dados:', error);
          toast.error('Erro ao carregar dados do banco de dados', {
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
        });
    }
  };

  // Função para salvar dados no MongoDB
  const handleSaveToDB = () => {
    if (confirm('Deseja salvar os dados atuais no banco de dados?')) {
      saveCurrentData()
        .then(success => {
          if (success) {
            // Feedback já é fornecido na função saveCurrentData
          }
        })
        .catch(error => {
          console.error('Erro ao salvar dados:', error);
          toast.error('Erro inesperado ao salvar dados', {
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
        });
    }
  };

  return (
    <div className="min-h-screen bg-[#373737]">
      {/* Header */}
      <header className="bg-[#373737] text-white p-4">
        <div className="flex items-center justify-between px-12">
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-lg p-2">
              <img src="/images/logo.png" alt="Logo" className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Controle de Vendas</h1>
              <p className="text-sm text-[#938667]">Importe e gerencie seus dados de forma eficiente</p>
            </div>
          </div>
          <button
            onClick={() => setShowHistory(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-[#938667] hover:bg-[#7a6f55] rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Histórico
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 py-6">
        {/* Import Section com novos botões de exportação */}
        <div className="bg-[#938667] rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Gerenciar Dados</h2>
              <p className="text-sm text-white/70 mt-1">Adicione ou remova dados da planilha</p>
            </div>
            <div className="flex gap-4">
              {(user?.role === 'MASTER' || user?.role === 'GESTOR') && (
                <>
                  <button
                    onClick={handleAddRow}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#373737] hover:bg-[#373737]/80 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Adicionar Dados
                  </button>
                  <button
                    onClick={addDataFromXLSX}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#373737] hover:bg-[#373737]/80 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    Importar XLSX
                  </button>
                  <button
                    onClick={clearAllData}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#373737] hover:bg-[#7a6f55] rounded-lg transition-colors flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Limpar Planilha
                  </button>
                </>
              )}
              <div className="flex items-center space-x-1 mb-2">
                <button
                  onClick={() => exportData('xlsx')}
                  className="bg-[#373737] hover:bg-[#454545] text-white px-4 py-2 rounded shadow text-sm"
                >
                  Exportar Excel
                </button>
                <button
                  onClick={() => exportData('csv')}
                  className="bg-[#373737] hover:bg-[#454545] text-white px-4 py-2 rounded shadow text-sm"
                >
                  Exportar CSV
                </button>
                <button
                  onClick={() => exportData('pdf')}
                  className="bg-[#373737] hover:bg-[#454545] text-white px-4 py-2 rounded shadow text-sm"
                >
                  Exportar PDF
                </button>
                <button
                  onClick={handleLoadFromDB}
                  className="bg-[#007bff] hover:bg-[#0069d9] text-white px-4 py-2 rounded shadow text-sm flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Carregar do DB
                </button>
                
                <button
                  onClick={handleSaveToDB}
                  className="bg-[#28a745] hover:bg-[#218838] text-white px-4 py-2 rounded shadow text-sm flex items-center ml-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Salvar no DB
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-[#373737]/50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Buscar por */}
            <div className="relative flex flex-col">
              <label htmlFor="searchTerm" className="mb-2 text-sm font-medium text-[#938667]">Buscar por</label>
              <input
                id="searchTerm"
                name="searchTerm"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-[42px] px-4 py-2 bg-[#373737] border border-[#938667] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#7a6f55]"
                placeholder="Digite para buscar..."
              />
            </div>

            {/* Campo */}
            <div className="relative flex flex-col">
              <label htmlFor="selectedField" className="mb-2 text-sm font-medium text-[#938667]">Campo</label>
              <select 
                id="selectedField"
                name="selectedField"
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                className="w-full h-[42px] px-4 py-2 bg-[#373737] border border-[#938667] rounded-lg text-white focus:outline-none focus:border-[#7a6f55] appearance-none"
              >
                <option value="TODOS">TODOS</option>
                <option value="CLIENTE">CLIENTE</option>
                <option value="CPF">CPF</option>
                <option value="CORRETOR(A)">CORRETOR(A)</option>
                <option value="INCORPORADORA">INCORPORADORA</option>
              </select>
              <div className="absolute right-3 top-[38px] pointer-events-none">
                <svg className="w-4 h-4 text-[#938667]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Situação */}
            <div className="relative flex flex-col">
              <label htmlFor="selectedStatus" className="mb-2 text-sm font-medium text-[#938667]">Situação</label>
              <select 
                id="selectedStatus"
                name="selectedStatus"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full h-[42px] px-4 py-2 bg-[#373737] border border-[#938667] rounded-lg text-white focus:outline-none focus:border-[#7a6f55] appearance-none"
              >
                <option value="TODAS">TODAS</option>
                <option value="PENDENTE">PENDENTE</option>
                <option value="APROVADO">APROVADO</option>
                <option value="REPROVADO">REPROVADO</option>
              </select>
              <div className="absolute right-3 top-[38px] pointer-events-none">
                <svg className="w-4 h-4 text-[#938667]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-[#938667] rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#373737]">
            <h2 className="text-lg font-semibold text-white">Dados Importados</h2>
            <p className="text-sm text-white mt-1">
              Total de registros: {filteredData.length} de {excelData.length}
            </p>
          </div>
          <div className="relative">
            <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
              <ExcelTable 
                data={filteredData} 
                onDataChange={handleDataChange}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {editModalOpen && selectedRow && (
        <EditModal
          data={selectedRow.data}
          onSave={handleSaveRow}
          rowIndex={selectedRow.index}
        />
      )}

      <HistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
      />

      <div className="fixed bottom-4 right-4 text-xs text-[#938667]">
        Desenvolvido por Kaka®
      </div>
    </div>
  );
}
