import { useState, useEffect } from 'react';
import { ExcelData, ExcelDataKey } from '@/types/excel';
import { useData } from '@/app/context/DataContext';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'react-hot-toast';

interface EditModalProps {
  data: ExcelData;
  onSave: (data: ExcelData) => void;
  rowIndex: number;
}

const tooltips: { [key: string]: string } = {
  'VGV R$': 'Valor Geral de Vendas em Reais',
  'CPF': 'Digite apenas números - a formatação é automática',
  'DATA': 'Digite a data no formato DD/MM/AAAA',
  '% COMISSÃO PREVISTA': 'Porcentagem da comissão prevista para a venda',
  'VGC PREVISTA': 'Valor Geral de Comissão Prevista',
  'VGC REAL': 'Valor Geral de Comissão Realizada',
  'CAPTADOR?': 'Indique se há um captador para esta venda',
  '% COMISSÃO REAL': 'Porcentagem da comissão efetivamente realizada',
  '% COMISSÃO GESTOR': 'Porcentagem da comissão destinada ao gestor'
};

export default function EditModal({ data, onSave, rowIndex }: EditModalProps) {
  const [formData, setFormData] = useState<ExcelData>(data);
  const [hasChanges, setHasChanges] = useState(false);
  const { setEditModalOpen } = useData();
  const { user } = useAuth();
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4').slice(0, 14);
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setFormData(prev => ({
      ...prev,
      CPF: formatted
    }));
  };

  const handleInputChange = (col: string, value: string) => {
    if (col === 'PARCERIA GESTORES' && user?.role !== 'MASTER') {
      toast.error('Apenas administradores podem alterar a equipe');
      return;
    }

    setHasChanges(true);
    if (col === 'CPF') {
      handleCPFChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>);
    } else {
      const newValue = col.includes('VGV') || col.includes('COMISSÃO') || col.includes('VGC')
        ? parseFloat(value) || 0
        : value;
      
      setFormData(prev => {
        const updated = {
          ...prev,
          [col]: newValue
        };
        // Verifica se realmente houve mudança
        const hasActualChanges = JSON.stringify(updated) !== JSON.stringify(data);
        setHasChanges(hasActualChanges);
        return updated;
      });
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      const confirmClose = window.confirm('Existem alterações não salvas. Deseja realmente sair?');
      if (confirmClose) {
        setEditModalOpen(false);
        toast('Alterações descartadas', {
          icon: '⚠️',
        });
      }
    } else {
      setEditModalOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onSave(formData);
      toast.success('Dados salvos com sucesso!');
      setHasChanges(false);
      setEditModalOpen(false);
    } catch (error) {
      toast.error('Erro ao salvar os dados. Tente novamente.');
      console.error('Erro ao salvar:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
  };

  const getInputType = (col: string) => {
    if (col === 'DATA') return 'text';
    if (col === 'CPF') return 'text';
    if (col.includes('VGV') || col.includes('VGC')) return 'number';
    if (col.includes('COMISSÃO')) return 'number';
    return 'text';
  };

  const getInputValue = (col: string, value: any) => {
    if (col === 'DATA') {
      return value || '';
    }
    return value?.toString() ?? '';
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, col: string) => {
    const value = e.target.value;
    setFormData(prev => {
      const updated = {
        ...prev,
        [col]: value
      };
      // Verifica se realmente houve mudança
      const hasActualChanges = JSON.stringify(updated) !== JSON.stringify(data);
      setHasChanges(hasActualChanges);
      return updated;
    });
  };

  const getDisplayValue = (col: string, value: any) => {
    if (col === 'CPF') return formatCPF(value?.toString() ?? '');
    if (col.includes('VGV') || col.includes('VGC')) return formatCurrency(Number(value) || 0);
    if (col.includes('COMISSÃO')) return formatPercentage(Number(value) || 0);
    if (col === 'DATA') return value || '';
    return value?.toString() ?? '';
  };

  return (
    <div className="fixed inset-0 bg-[#373737]/75 flex items-center justify-center z-50 p-4">
      <div className="bg-[#373737] rounded-lg w-[95%] max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-[#938667]">
          <h2 className="text-xl font-semibold text-white">Editar Linha {rowIndex + 1}</h2>
          <button
            onClick={handleClose}
            className="text-[#938667] hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(formData).map(([col, value]) => (
              <div key={col} className="flex flex-col relative">
                <label 
                  className="text-sm font-medium text-[#938667] mb-1 flex items-center gap-2"
                  onMouseEnter={() => setShowTooltip(col)}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  {col}
                  {tooltips[col] && (
                    <svg className="w-4 h-4 text-[#938667]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </label>
                {showTooltip === col && tooltips[col] && (
                  <div className="absolute -top-12 left-0 bg-[#2A2A2A] text-white text-sm p-2 rounded shadow-lg z-10">
                    {tooltips[col]}
                  </div>
                )}
                <div className="relative group">
                  {(col as ExcelDataKey) === 'DATA' ? (
                    <input
                      id={`input-${col}`}
                      name={col}
                      type="text"
                      value={getInputValue(col, value)}
                      onChange={(e) => {
                        handleDateChange(e, col);
                        setHasChanges(true);
                      }}
                      placeholder="DD/MM/AAAA"
                      maxLength={10}
                      autoComplete="off"
                      className="w-full h-[42px] bg-[#2A2A2A] border border-[#938667] rounded px-3 focus:border-[#938667] outline-none text-white transition-all group-hover:border-white"
                      disabled={(col as ExcelDataKey) === 'PARCERIA GESTORES' && user?.role !== 'MASTER'}
                    />
                  ) : (
                    <input
                      id={`input-${col}`}
                      name={col}
                      type={getInputType(col)}
                      value={getInputValue(col, value)}
                      onChange={(e) => handleInputChange(col, e.target.value)}
                      className={`w-full h-[42px] bg-[#2A2A2A] border border-[#938667] rounded px-3 focus:border-[#938667] outline-none text-white transition-all group-hover:border-white ${(col as ExcelDataKey) === 'PARCERIA GESTORES' && user?.role !== 'MASTER' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      placeholder={col === 'CPF' ? '000.000.000-00' : ''}
                      disabled={(col as ExcelDataKey) === 'PARCERIA GESTORES' && user?.role !== 'MASTER'}
                    />
                  )}
                  {(col.includes('VGV') || col.includes('VGC') || col.includes('COMISSÃO') || col === 'CPF') && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#938667]">
                      {getDisplayValue(col, value)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </form>

        <div className="p-6 border-t border-[#938667] bg-[#2A2A2A]">
          <div className="flex justify-between items-center">
            <div className="text-sm text-[#938667]">
              {hasChanges ? 'Existem alterações não salvas' : 'Nenhuma alteração pendente'}
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 text-sm font-medium text-white bg-[#373737] hover:bg-[#938667] rounded transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={!hasChanges}
                className="px-6 py-2 text-sm font-medium text-white bg-[#938667] hover:bg-[#7a6f55] rounded transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 