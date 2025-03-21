'use client'

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiDatabase, FiCheckCircle, FiXCircle, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';

export default function DiagnosticPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  // Função para executar o teste de diagnóstico
  const runDiagnostics = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      // Adicionar um timestamp para evitar cache
      const timestamp = Date.now();
      console.log('🔍 Iniciando diagnóstico de banco de dados...');
      
      const response = await fetch(`/api/testerdb?timestamp=${timestamp}`);
      const data = await response.json();
      
      console.log('📊 Resultado do diagnóstico:', data);
      setResult(data);
      
      if (data.success) {
        toast.success('Diagnóstico concluído com sucesso!');
      } else {
        toast.error('O diagnóstico encontrou problemas na conexão.');
      }
    } catch (error) {
      console.error('❌ Erro ao executar diagnóstico:', error);
      toast.error('Erro ao executar diagnóstico. Verifique o console para detalhes.');
    } finally {
      setLoading(false);
    }
  };

  // Executar diagnóstico ao carregar a página
  useEffect(() => {
    runDiagnostics();
  }, [refreshCount]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <FiDatabase className="mr-2" />
            Diagnóstico do MongoDB
          </h1>
          
          <button
            onClick={() => setRefreshCount(prev => prev + 1)}
            disabled={loading}
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-200"
          >
            <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Executando...' : 'Atualizar'}
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Executando diagnóstico completo...</p>
          </div>
        ) : result ? (
          <div className="space-y-6">
            {/* Status geral */}
            <div className={`p-4 rounded-md ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center">
                {result.success ? (
                  <FiCheckCircle className="text-green-500 text-xl mr-2" />
                ) : (
                  <FiXCircle className="text-red-500 text-xl mr-2" />
                )}
                <h2 className="text-lg font-medium">
                  {result.success 
                    ? 'Conexão com MongoDB está funcionando corretamente!' 
                    : 'Problemas detectados na conexão com MongoDB'}
                </h2>
              </div>
              <p className="mt-2 text-gray-600">{result.diagnostics?.message || 'Executando diagnóstico...'}</p>
            </div>

            {/* Detalhes do diagnóstico */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h3 className="font-medium mb-2">Detalhes da Conexão</h3>
                <p className="text-sm text-gray-600">URL: {result.mongoUrl || 'Não disponível'}</p>
                <p className="text-sm text-gray-600">Timestamp: {result.diagnostics?.timestamp || 'N/A'}</p>
                <p className="text-sm text-gray-600">Usuários no sistema: {result.diagnostics?.userCount || 0}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h3 className="font-medium mb-2">Resultados dos testes</h3>
                <div className="space-y-2">
                  <TestResult 
                    label="Conexão" 
                    success={result.diagnostics?.connectionTest} 
                  />
                  <TestResult 
                    label="Escrita (Create)" 
                    success={result.diagnostics?.writeTest} 
                  />
                  <TestResult 
                    label="Leitura (Read)" 
                    success={result.diagnostics?.readTest} 
                  />
                  <TestResult 
                    label="Exclusão (Delete)" 
                    success={result.diagnostics?.deleteTest} 
                  />
                </div>
              </div>
            </div>

            {/* Erros (se existirem) */}
            {result.diagnostics?.error && (
              <div className="bg-red-50 p-4 rounded-md border border-red-200">
                <div className="flex items-center">
                  <FiAlertTriangle className="text-red-500 text-xl mr-2" />
                  <h3 className="font-medium">Detalhes do Erro</h3>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-800">Mensagem: {result.diagnostics.error.message}</p>
                  <p className="text-sm text-gray-800">Código: {result.diagnostics.error.code}</p>
                </div>
              </div>
            )}

            {/* Recomendações */}
            <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
              <h3 className="font-medium mb-2">Recomendações</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {!result.success && (
                  <>
                    <li>Verifique se a string de conexão em .env está correta</li>
                    <li>Confirme se o serviço MongoDB está em execução</li>
                    <li>Verifique permissões de acesso para o banco de dados</li>
                    <li>Certifique-se de que não há firewalls bloqueando a conexão</li>
                  </>
                )}
                <li>Atualize regularmente sua versão do MongoDB</li>
                <li>Implemente backups regulares do seu banco de dados</li>
                <li>Configure índices para melhorar o desempenho das consultas</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-12">
            <p className="text-gray-600">Nenhum resultado disponível. Clique em Atualizar para executar o diagnóstico.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente para mostrar resultado de teste individual
function TestResult({ label, success }: { label: string; success: boolean }) {
  return (
    <div className="flex items-center">
      {success ? (
        <FiCheckCircle className="text-green-500 mr-2" />
      ) : (
        <FiXCircle className="text-red-500 mr-2" />
      )}
      <span className="text-sm">{label}: {success ? 'Sucesso' : 'Falha'}</span>
    </div>
  );
} 