import { useState, useEffect } from 'react';
import { ExcelData } from '@/types/excel';

interface SearchAndFilterProps {
  data: ExcelData[];
  onFilteredData: (filteredData: ExcelData[]) => void;
}

export default function SearchAndFilter({ data, onFilteredData }: SearchAndFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterField, setFilterField] = useState('TODOS');
  const [situacaoFilter, setSituacaoFilter] = useState('TODAS');

  const fields = ['TODOS', 'CLIENTE', 'CPF', 'CORRETOR(A)', 'INCORPORADORA', 'SITUAÇÃO'];
  const situacoes = ['TODAS', 'PENDENTE', 'APROVADO', 'REPROVADO', 'EM ANÁLISE'];

  // Atualiza os dados filtrados sempre que os dados originais mudarem
  useEffect(() => {
    handleSearch(searchTerm, filterField, situacaoFilter);
  }, [data]);

  const handleSearch = (term: string, field: string, situacao: string) => {
    let filtered = [...data];

    // Só aplica o filtro se houver termo de busca
    if (term.trim()) {
      filtered = filtered.filter(item => {
        if (field === 'TODOS') {
          return Object.values(item).some(value =>
            value.toString().toLowerCase().includes(term.toLowerCase())
          );
        } else {
          return item[field]?.toString().toLowerCase().includes(term.toLowerCase());
        }
      });
    }

    // Só aplica o filtro de situação se não for 'TODAS'
    if (situacao !== 'TODAS') {
      filtered = filtered.filter(item => item['SITUAÇÃO'] === situacao);
    }

    onFilteredData(filtered);
  };

  const inputClasses = "w-full bg-[#2A2A2A] text-white rounded-lg py-3 px-4 border border-[#938667] focus:outline-none focus:border-[#938667] h-[42px]";

  return (
    <div className="bg-[#373737] p-4 rounded-lg mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#938667] mb-2">
            Buscar por
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleSearch(e.target.value, filterField, situacaoFilter);
            }}
            placeholder="Digite para buscar..."
            className={inputClasses}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#938667] mb-2">
            Campo
          </label>
          <select
            value={filterField}
            onChange={(e) => {
              setFilterField(e.target.value);
              handleSearch(searchTerm, e.target.value, situacaoFilter);
            }}
            className={inputClasses}
          >
            {fields.map(field => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#938667] mb-2">
            Situação
          </label>
          <select
            value={situacaoFilter}
            onChange={(e) => {
              setSituacaoFilter(e.target.value);
              handleSearch(searchTerm, filterField, e.target.value);
            }}
            className={inputClasses}
          >
            {situacoes.map(situacao => (
              <option key={situacao} value={situacao}>
                {situacao}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
} 