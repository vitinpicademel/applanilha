'use client';

import { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import { ExcelData, ExcelDataKey } from '@/types/excel';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useData } from '@/app/context/DataContext';
import { useAuth } from '@/app/context/AuthContext';

interface ExcelTableProps {
  data: ExcelData[];
  onDataChange: (newData: ExcelData[]) => void;
}

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
] as const;

// Define larguras personalizadas para colunas específicas
const COLUMN_WIDTHS: { [key: string]: string } = {
  'ITEM': '120px',
  'DATA': '150px',
  'CLIENTE': '250px',
  'CPF': '180px',
  'CORRETOR(A)': '250px',
  'PARCERIA CORRETORES': '250px',
  'PARCERIA GESTORES': '250px',
  'ORIGEM DO LEAD': '180px',
  'INCORPORADORA': '250px',
  'TIPO DO IMÓVEL': '180px',
  'INFORMAÇÃO DO IMÓVEL': '400px',
  'VGV R$': '180px',
  'FORMA DE PAGAMENTO': '250px',
  'APROVAÇÃO': '180px',
  'OBS': '1000px',
  'SITUAÇÃO': '180px',
  '% COMISSÃO PREVISTA': '180px',
  'VGC PREVISTA': '180px',
  'VGC REAL': '180px',
  'CAPTADOR?': '180px',
  'NOME DO CAPTADOR': '250px',
  '% COMISSÃO REAL': '180px',
  '% COMISSÃO GESTOR': '180px'
};

const columnHelper = createColumnHelper<ExcelData>();

interface EditableCellProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  width: string;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const EditableCell = memo(({ value, onChange, onBlur, width, onKeyDown }: EditableCellProps) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  return (
    <input
      value={localValue}
      onChange={handleChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      style={{ minWidth: width }}
      className="w-full bg-transparent p-2 border border-transparent hover:border-[#938667] focus:border-[#373737] outline-none text-[#373737]"
    />
  );
});

EditableCell.displayName = 'EditableCell';

interface EditModalProps {
  data: ExcelData;
  onSave: (data: ExcelData) => void;
  rowIndex: number;
}

const EditModal = ({ data, onSave, rowIndex }: EditModalProps) => {
  const [formData, setFormData] = useState<ExcelData>(data);
  const { setEditModalOpen } = useData();

  useEffect(() => {
    setFormData(data);
  }, [data]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setEditModalOpen(false);
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
    setFormData(prev => ({
      ...prev,
      [col]: value
    }));
  };

  const getDisplayValue = (col: string, value: any) => {
    if (col === 'CPF') return formatCPF(value?.toString() ?? '');
    if (col.includes('VGV') || col.includes('VGC')) return formatCurrency(Number(value) || 0);
    if (col.includes('COMISSÃO')) return formatPercentage(Number(value) || 0);
    if (col === 'DATA') return value || '';
    return value?.toString() ?? '';
  };

  return (
    <div className="fixed inset-0 bg-[#373737] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#373737]">Editar Linha {rowIndex + 1}</h2>
          <button
            onClick={() => setEditModalOpen(false)}
            className="text-[#938667] hover:text-[#373737]"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {EXPECTED_COLUMNS.map(col => (
            <div key={col} className="flex flex-col">
              <label className="text-sm font-medium text-[#373737] mb-1">
                {col}
              </label>
              <div className="relative">
                {col === 'DATA' ? (
                  <input
                    type="text"
                    value={getInputValue(col, formData[col])}
                    onChange={(e) => handleDateChange(e, col)}
                    placeholder="DD/MM/AAAA"
                    maxLength={10}
                    autoComplete="off"
                    className="w-full border border-[#938667] rounded p-2 focus:border-[#373737] outline-none text-[#373737] font-medium"
                  />
                ) : (
                  <input
                    type={getInputType(col)}
                    value={getInputValue(col, formData[col as keyof ExcelData])}
                    onChange={(e) => {
                      if (col === 'CPF') {
                        handleCPFChange(e);
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          [col]: col.includes('VGV') || col.includes('COMISSÃO') || col.includes('VGC')
                            ? parseFloat(e.target.value) || 0
                            : e.target.value
                        }));
                      }
                    }}
                    className="w-full border border-[#938667] rounded p-2 focus:border-[#373737] outline-none text-[#373737] font-medium"
                    placeholder={col === 'CPF' ? '000.000.000-00' : ''}
                  />
                )}
                {(col.includes('VGV') || col.includes('VGC') || col.includes('COMISSÃO') || col === 'CPF') && (
                  <span className="absolute right-3 top-2 text-sm text-[#938667] font-medium">
                    {getDisplayValue(col, formData[col as keyof ExcelData])}
                  </span>
                )}
              </div>
            </div>
          ))}
          <div className="col-span-2 flex justify-end gap-4 mt-6 pt-4 border-t border-[#938667]">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 bg-[#938667]/10 text-[#373737] rounded hover:bg-[#938667]/20 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#373737] text-white rounded hover:bg-[#938667] font-medium"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function ExcelTable({ data, onDataChange }: ExcelTableProps) {
  const { selectedRow, setSelectedRow, setEditModalOpen } = useData();
  const { user } = useAuth();
  const [sorting, setSorting] = useState<SortingState>([]);

  const handleRowClick = (row: ExcelData, index: number) => {
    if (user?.role === 'CORRETOR') {
      return;
    }
    setSelectedRow({ data: row, index });
    setEditModalOpen(true);
  };

  const handleDeleteRow = (index: number) => {
    if (user?.role === 'CORRETOR') {
      return;
    }
    if (window.confirm('Tem certeza que deseja excluir esta linha?')) {
      const newData = data.filter((_, i) => i !== index);
      const adjustedData = newData.map((row, i) => ({
        ...row,
        ITEM: (i + 1).toString()
      }));
      onDataChange(adjustedData);
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    if (user?.role === 'CORRETOR') {
      return;
    }
    if (window.confirm('Tem certeza que deseja excluir esta coluna?')) {
      const newData = data.map(row => {
        const newRow = { ...row };
        delete newRow[columnId];
        return newRow;
      });
      onDataChange(newData);
    }
  };

  const columns = useMemo(() => {
    return EXPECTED_COLUMNS.map(col => {
      return columnHelper.accessor((row: ExcelData) => row[col as keyof ExcelData], {
        id: col,
        header: ({ column }) => (
          <div className="relative group">
            <div
              className="px-4 py-2 bg-[#373737] font-semibold text-white cursor-pointer hover:bg-[#938667] flex items-center justify-between"
              onClick={() => column.toggleSorting()}
            >
              <span className="text-white">{col}</span>
              {user?.role !== 'CORRETOR' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteColumn(col);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-white hover:text-red-300 ml-2"
                  title="Excluir coluna"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ),
        cell: ({ row, getValue }) => {
          const value = getValue();
          const isEditing = selectedRow?.index === row.index && selectedRow?.data[col] !== value;
          
          if (isEditing && user?.role !== 'CORRETOR') {
            return (
              <EditableCell
                value={value?.toString() ?? ''}
                onChange={(newValue) => {
                  const newData = [...data];
                  newData[row.index] = {
                    ...newData[row.index],
                    [col]: newValue
                  };
                  onDataChange(newData);
                }}
                onBlur={() => setSelectedRow(null)}
                width={COLUMN_WIDTHS[col]}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSelectedRow(null);
                  }
                }}
              />
            );
          }

          return (
            <div
              className={`px-4 py-2 text-[#373737] ${user?.role !== 'CORRETOR' ? 'hover:bg-[#938667]/10 cursor-pointer' : ''} whitespace-nowrap overflow-hidden text-ellipsis`}
              onClick={() => handleRowClick(row.original, row.index)}
            >
              {value?.toString() ?? ''}
            </div>
          );
        },
        enableSorting: true,
        sortingFn: (rowA, rowB, columnId) => {
          const a = rowA.getValue(columnId);
          const b = rowB.getValue(columnId);
          
          if (typeof a === 'number' && typeof b === 'number') {
            return a - b;
          }
          
          return String(a).localeCompare(String(b));
        }
      });
    });
  }, [data, selectedRow, onDataChange, user?.role]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="w-full h-full border border-[#938667]">
      <div className="w-full h-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {table.getHeaderGroups().map(headerGroup => (
                headerGroup.headers.map((header, index) => (
                  <>
                    <th 
                      key={header.id} 
                      className="border-b border-[#938667] bg-[#373737] px-6 py-4 text-sm whitespace-nowrap text-white relative"
                      style={{ width: COLUMN_WIDTHS[header.column.id] }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {index < headerGroup.headers.length - 1 && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-[1px] bg-[#938667]"></div>
                      )}
                    </th>
                  </>
                ))
              ))}
              <th 
                className="border-b border-[#938667] bg-[#373737] w-24 px-6 py-4 text-sm whitespace-nowrap text-white relative"
                style={{ width: '96px' }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-[1px] bg-[#938667]"></div>
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                className={`hover:bg-gray-50 ${user?.role !== 'CORRETOR' ? 'cursor-pointer' : ''} bg-white`}
                onClick={() => handleRowClick(row.original, index)}
              >
                {row.getVisibleCells().map((cell, index) => (
                  <td 
                    key={cell.id} 
                    className="border-b border-gray-200 px-6 py-4 text-sm text-gray-900 relative"
                    style={{ width: COLUMN_WIDTHS[cell.column.id] }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    {index < row.getVisibleCells().length - 1 && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-[1px] bg-[#938667]"></div>
                    )}
                  </td>
                ))}
                <td 
                  className="border-b border-gray-200 px-6 py-4 relative"
                  style={{ width: '96px' }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-[1px] bg-[#938667]"></div>
                  {user?.role !== 'CORRETOR' && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(row.original, index);
                        }}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Editar linha"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRow(index);
                        }}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Excluir linha"
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
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 