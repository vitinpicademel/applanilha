'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { FiDatabase, FiUser, FiFileText, FiRefreshCw, FiList, FiAlertTriangle, FiCheckCircle, FiSettings } from 'react-icons/fi';

export default function SystemStatusPage() {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [systemInfo, setSystemInfo] = useState<any>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  // Verificar o status do sistema
  const checkSystemStatus = async () => {
    setLoading(true);
    
    try {
      // Coletar informações do sistema
      const info = {
        timestamp: new Date().toISOString(),
        database: null,
        users: null,
        logs: null,
        environment: process.env.NODE_ENV || 'development'
      };
      
      // Verificar conexão com o banco de dados
      try {
        const dbResponse = await fetch(`/api/testerdb?_t=${Date.now()}`);
        info.database = await dbResponse.json();
      } catch (dbError) {
        console.error('Erro ao verificar banco de dados:', dbError);
        info.database = { 
          success: false, 
          error: dbError instanceof Error ? dbError.message : String(dbError) 
        };
      }
      
      // Contar usuários
      try {
        const usersResponse = await fetch(`/api/users?_t=${Date.now()}`);
        const usersData = await usersResponse.json();
        info.users = usersData;
      } catch (usersError) {
        console.error('Erro ao verificar usuários:', usersError);
        info.users = { 
          success: false, 
          error: usersError instanceof Error ? usersError.message : String(usersError) 
        };
      }
      
      // Contar logs
      try {
        const logsResponse = await fetch(`/api/logs?limit=1&_t=${Date.now()}`);
        const logsData = await logsResponse.json();
        info.logs = logsData;
      } catch (logsError) {
        console.error('Erro ao verificar logs:', logsError);
        info.logs = { 
          success: false,
          error: logsError instanceof Error ? logsError.message : String(logsError)
        };
      }
      
      // Atualizar estado
      setSystemInfo(info);
      
      // Notificar usuário
      if (info.database.success) {
        toast.success('Status do sistema verificado com sucesso!');
      } else {
        toast.error('Problemas detectados no sistema!');
      }
    } catch (error) {
      console.error('Erro ao verificar status do sistema:', error);
      toast.error('Erro ao verificar status do sistema');
    } finally {
      setLoading(false);
    }
  };

  // Verificar status ao carregar a página
  useEffect(() => {
    if (isAuthenticated && user?.role === 'ADMIN' || user?.role === 'MASTER') {
      checkSystemStatus();
    }
  }, [isAuthenticated, user, refreshCount]);

  // Verificar permissão
  if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'MASTER')) {
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
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <FiSettings className="mr-2" />
            Status do Sistema
          </h1>
          
          <div>
            <button
              onClick={() => setRefreshCount(prev => prev + 1)}
              disabled={loading}
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-200"
            >
              <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Verificando...' : 'Atualizar Status'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Verificando status do sistema...</p>
          </div>
        ) : systemInfo ? (
          <div className="space-y-6">
            {/* Resumo geral */}
            <div className={`p-4 rounded-md ${
              systemInfo.database?.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center mb-2">
                {systemInfo.database?.success ? (
                  <FiCheckCircle className="text-green-500 text-xl mr-2" />
                ) : (
                  <FiAlertTriangle className="text-red-500 text-xl mr-2" />
                )}
                <h2 className="text-lg font-medium">
                  Status Geral: {systemInfo.database?.success ? 'Operacional' : 'Problemas Detectados'}
                </h2>
              </div>
              <p className="text-gray-600">
                Última verificação: {new Date(systemInfo.timestamp).toLocaleString('pt-BR')}
              </p>
              <p className="text-gray-600">
                Ambiente: <span className="font-medium">{systemInfo.environment}</span>
              </p>
            </div>

            {/* Status do banco de dados */}
            <div className="bg-white border rounded-md overflow-hidden">
              <div className="bg-gray-50 p-4 border-b flex items-center">
                <FiDatabase className="text-blue-500 mr-2" />
                <h3 className="font-medium">Banco de Dados</h3>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                    systemInfo.database?.success ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                  <span className="font-medium">
                    {systemInfo.database?.success ? 'Conectado' : 'Erro de Conexão'}
                  </span>
                </div>
                
                {systemInfo.database?.diagnostics ? (
                  <div className="mt-2 space-y-2 text-sm">
                    <p><span className="text-gray-600">Conexão:</span> {systemInfo.database.diagnostics.connectionTest ? '✅' : '❌'}</p>
                    <p><span className="text-gray-600">Escrita:</span> {systemInfo.database.diagnostics.writeTest ? '✅' : '❌'}</p>
                    <p><span className="text-gray-600">Leitura:</span> {systemInfo.database.diagnostics.readTest ? '✅' : '❌'}</p>
                    <p><span className="text-gray-600">Exclusão:</span> {systemInfo.database.diagnostics.deleteTest ? '✅' : '❌'}</p>
                    <p><span className="text-gray-600">Usuários no sistema:</span> {systemInfo.database.diagnostics.userCount}</p>
                  </div>
                ) : (
                  <p className="text-red-600 mt-2">
                    {systemInfo.database?.error || 'Não foi possível executar diagnóstico'}
                  </p>
                )}
                
                <div className="mt-4">
                  <Link 
                    href="/diagnose" 
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Ver diagnóstico completo →
                  </Link>
                </div>
              </div>
            </div>

            {/* Status dos usuários */}
            <div className="bg-white border rounded-md overflow-hidden">
              <div className="bg-gray-50 p-4 border-b flex items-center">
                <FiUser className="text-blue-500 mr-2" />
                <h3 className="font-medium">Usuários</h3>
              </div>
              <div className="p-4">
                {systemInfo.users?.success ? (
                  <div className="space-y-2">
                    <p><span className="font-medium">Total de usuários:</span> {systemInfo.users.totalCount || 0}</p>
                    <div className="mt-4">
                      <Link 
                        href="/gerenciar-usuarios" 
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Gerenciar usuários →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <p className="text-red-600">
                    {systemInfo.users?.error || 'Não foi possível obter informações dos usuários'}
                  </p>
                )}
              </div>
            </div>

            {/* Status dos logs */}
            <div className="bg-white border rounded-md overflow-hidden">
              <div className="bg-gray-50 p-4 border-b flex items-center">
                <FiList className="text-blue-500 mr-2" />
                <h3 className="font-medium">Logs do Sistema</h3>
              </div>
              <div className="p-4">
                {systemInfo.logs?.totalCount !== undefined ? (
                  <div className="space-y-2">
                    <p><span className="font-medium">Total de logs:</span> {systemInfo.logs.totalCount}</p>
                    <div className="mt-4">
                      <Link 
                        href="/logs" 
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Ver logs do sistema →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <p className="text-red-600">
                    {systemInfo.logs?.error || 'Não foi possível obter informações dos logs'}
                  </p>
                )}
              </div>
            </div>

            {/* Ações */}
            <div className="bg-white border rounded-md overflow-hidden">
              <div className="bg-gray-50 p-4 border-b flex items-center">
                <FiSettings className="text-blue-500 mr-2" />
                <h3 className="font-medium">Ações Administrativas</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    href="/register"
                    className="bg-blue-50 hover:bg-blue-100 p-4 rounded-md border border-blue-200 transition-colors"
                  >
                    <div className="flex items-center text-blue-700 font-medium mb-1">
                      <FiUser className="mr-2" />
                      Criar Novo Usuário
                    </div>
                    <p className="text-sm text-gray-600">
                      Adicionar um novo usuário ao sistema
                    </p>
                  </Link>
                  
                  <Link
                    href="/init"
                    className="bg-green-50 hover:bg-green-100 p-4 rounded-md border border-green-200 transition-colors"
                  >
                    <div className="flex items-center text-green-700 font-medium mb-1">
                      <FiRefreshCw className="mr-2" />
                      Reinicializar Sistema
                    </div>
                    <p className="text-sm text-gray-600">
                      Verificar e reinicializar configurações
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-md bg-yellow-50 border border-yellow-300">
            <div className="flex items-center text-yellow-800">
              <FiAlertTriangle className="mr-2" />
              <p>Não foi possível obter informações do sistema. Tente novamente.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 