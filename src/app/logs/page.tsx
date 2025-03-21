'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiRefreshCw, FiList, FiFilter, FiInfo, FiAlertTriangle, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';
import Link from 'next/link';
import type { UserRole } from '@/app/api/auth/auth.config';

interface LogEntry {
  id: string;
  userId: string | null;
  action: string;
  entity: string;
  details: string;
  success: boolean;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
}

const ADMIN: UserRole = 'ADMIN';
const MASTER: UserRole = 'MASTER';

export default function LogsPage() {
  const { user, isAuthenticated } = useAuth();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    action: '',
    entity: '',
    success: ''
  });
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  // Opções para filtros
  const actionOptions = ['LOGIN', 'LOGIN_FAILED', 'LOGOUT', 'CREATE', 'READ', 'UPDATE', 'DELETE', 'IMPORT', 'EXPORT', 'ERROR', 'TEST', 'INIT', ''];
  const entityOptions = ['USER', 'EXCEL_DATA', 'SYSTEM', 'DATABASE', 'AUTH', ''];

  // Buscar logs do sistema
  const fetchLogs = async () => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      toast.error('Acesso não autorizado');
      return;
    }

    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filter.action) queryParams.append('action', filter.action);
      if (filter.entity) queryParams.append('entity', filter.entity);
      if (filter.success) queryParams.append('success', filter.success);
      
      // Adicionamos um timestamp para evitar cache
      queryParams.append('_t', Date.now().toString());
      
      const url = `/api/logs?${queryParams.toString()}`;
      
      console.log('🔍 Buscando logs:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar logs: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`📋 ${data.logs.length} logs encontrados`);
      setLogs(data.logs);
    } catch (error) {
      console.error('❌ Erro ao buscar logs:', error);
      toast.error('Erro ao carregar logs do sistema');
    } finally {
      setLoading(false);
    }
  };

  // Carregar logs ao iniciar a página ou quando os filtros mudarem
  useEffect(() => {
    if (isAuthenticated && (user?.role === ADMIN || user?.role === MASTER)) {
      fetchLogs();
    }
  }, [isAuthenticated, user, filter]);

  // Renderizar detalhes de log formatados
  const renderDetails = (details: string) => {
    try {
      const parsedDetails = JSON.parse(details);
      return (
        <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-[400px]">
          {JSON.stringify(parsedDetails, null, 2)}
        </pre>
      );
    } catch (e) {
      return <p className="text-gray-600">{details}</p>;
    }
  };

  // Formatar timestamp relativo
  const formatTimeAgo = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: pt });
    } catch (e) {
      return timestamp;
    }
  };

  // Verificar autorização
  if (!isAuthenticated || (user?.role !== ADMIN && user?.role !== MASTER)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-6 rounded-md border border-red-300">
          <h1 className="text-xl font-bold text-red-700 flex items-center mb-2">
            <FiAlertTriangle className="mr-2" />
            Acesso Restrito
          </h1>
          <p className="text-red-600 mb-4">Você não tem permissão para acessar esta página.</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <FiList className="mr-2" />
            Logs do Sistema
          </h1>
          
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-200"
          >
            <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Carregando...' : 'Atualizar'}
          </button>
        </div>

        {/* Filtros */}
        <div className="mb-6 bg-gray-50 p-4 rounded-md border border-gray-200">
          <div className="flex items-center mb-2">
            <FiFilter className="mr-2 text-gray-600" />
            <h2 className="font-medium">Filtros</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ação</label>
              <select
                value={filter.action}
                onChange={(e) => setFilter({...filter, action: e.target.value})}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Todas as ações</option>
                {actionOptions.filter(opt => opt).map(action => (
                  <option key={action} value={action}>{action}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Entidade</label>
              <select
                value={filter.entity}
                onChange={(e) => setFilter({...filter, entity: e.target.value})}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Todas as entidades</option>
                {entityOptions.filter(opt => opt).map(entity => (
                  <option key={entity} value={entity}>{entity}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filter.success}
                onChange={(e) => setFilter({...filter, success: e.target.value})}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="true">Sucesso</option>
                <option value="false">Erro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de logs */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data/Hora
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ação
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entidade
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Detalhes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedLog(log)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col">
                        <span>{new Date(log.createdAt).toLocaleDateString('pt-BR')}</span>
                        <span>{new Date(log.createdAt).toLocaleTimeString('pt-BR')}</span>
                        <span className="text-xs text-gray-400">{formatTimeAgo(log.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        log.action === 'ERROR' || log.action === 'LOGIN_FAILED' 
                          ? 'bg-red-100 text-red-800' 
                          : log.action === 'CREATE' || log.action === 'UPDATE' 
                            ? 'bg-green-100 text-green-800'
                            : log.action === 'LOGIN' || log.action === 'LOGOUT'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.entity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {log.success ? (
                        <span className="text-green-600 flex items-center">
                          <FiCheckCircle className="mr-1" />
                          Sucesso
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center">
                          <FiXCircle className="mr-1" />
                          Erro
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button 
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLog(log);
                        }}
                      >
                        <FiInfo className="mr-1" />
                        Ver detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex justify-center py-12">
            <p className="text-gray-600">Nenhum log encontrado com os filtros selecionados.</p>
          </div>
        )}

        {/* Modal de detalhes */}
        {selectedLog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold flex items-center">
                    {selectedLog.success ? (
                      <FiCheckCircle className="mr-2 text-green-500" />
                    ) : (
                      <FiAlertTriangle className="mr-2 text-red-500" />
                    )}
                    Detalhes do Log
                  </h2>
                  <button 
                    onClick={() => setSelectedLog(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">ID: <span className="font-mono">{selectedLog.id}</span></p>
                    <p className="text-sm text-gray-600">Data: {new Date(selectedLog.createdAt).toLocaleString('pt-BR')}</p>
                    <p className="text-sm text-gray-600">Ação: <span className="font-medium">{selectedLog.action}</span></p>
                    <p className="text-sm text-gray-600">Entidade: <span className="font-medium">{selectedLog.entity}</span></p>
                    <p className="text-sm text-gray-600">
                      Status: {" "}
                      <span className={selectedLog.success ? "text-green-600" : "text-red-600"}>
                        {selectedLog.success ? "Sucesso" : "Erro"}
                      </span>
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Usuário ID: <span className="font-mono">{selectedLog.userId || 'N/A'}</span></p>
                    <p className="text-sm text-gray-600">IP: {selectedLog.ip || 'N/A'}</p>
                    <p className="text-sm text-gray-600 overflow-hidden text-ellipsis">
                      User Agent: <span className="font-mono text-xs">{selectedLog.userAgent || 'N/A'}</span>
                    </p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Detalhes:</h3>
                  {renderDetails(selectedLog.details)}
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 