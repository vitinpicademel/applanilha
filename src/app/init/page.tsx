'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function InitPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [masterUser, setMasterUser] = useState<any>(null);
  const [credentials, setCredentials] = useState<any>(null);
  const router = useRouter();
  
  useEffect(() => {
    const initializeSystem = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/init');
        const data = await response.json();
        
        if (!data.success) {
          setError(data.error || 'Erro desconhecido ao inicializar o sistema');
          toast.error(data.error || 'Erro desconhecido ao inicializar o sistema');
          return;
        }
        
        setMasterUser(data.user);
        setCredentials(data.credentials);
        toast.success(data.message);
      } catch (error) {
        console.error('Erro ao inicializar o sistema:', error);
        setError('Erro ao inicializar o sistema. Verifique o console para mais detalhes.');
        toast.error('Erro ao inicializar o sistema');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeSystem();
  }, []);
  
  const handleGoToLogin = () => {
    router.push('/login');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#2A2A2A] p-4">
        <div className="bg-[#373737] p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Inicializando o Sistema</h1>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#938667]"></div>
          </div>
          <p className="text-[#938667] mt-4">Aguarde enquanto preparamos tudo para você...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#2A2A2A] p-4">
        <div className="bg-[#373737] p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Erro na Inicialização</h1>
          <p className="text-white mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#938667] text-white rounded-lg hover:bg-[#7a6f55] transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#2A2A2A] p-4">
      <div className="bg-[#373737] p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-4 text-center">Sistema Inicializado!</h1>
        
        {masterUser && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#938667] mb-2">Usuário Master</h2>
            <div className="bg-[#2A2A2A] p-4 rounded-lg mb-4">
              <p className="text-white"><span className="text-[#938667]">Nome:</span> {masterUser.name}</p>
              <p className="text-white"><span className="text-[#938667]">Email:</span> {masterUser.email}</p>
              <p className="text-white"><span className="text-[#938667]">Papel:</span> {masterUser.role}</p>
            </div>
          </div>
        )}
        
        {credentials && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#938667] mb-2">Credenciais de Acesso</h2>
            <div className="bg-[#2A2A2A] p-4 rounded-lg border border-yellow-500">
              <p className="text-white"><span className="text-[#938667]">Email:</span> {credentials.email}</p>
              <p className="text-white"><span className="text-[#938667]">Senha:</span> {credentials.password}</p>
              <p className="text-yellow-500 text-sm mt-2">⚠️ Guarde estas informações em um local seguro!</p>
            </div>
          </div>
        )}
        
        <button
          onClick={handleGoToLogin}
          className="w-full py-3 px-4 bg-[#938667] text-white rounded-lg font-medium hover:bg-[#7a6f55] transition-colors"
        >
          Ir para a Página de Login
        </button>
      </div>
    </div>
  );
} 