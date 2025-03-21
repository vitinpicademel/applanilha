'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User } from '@/types/user';
import { toast } from 'react-hot-toast';

export default function GerenciarUsuariosPage() {
  const { user: currentUser, getUsers, deleteUser, updateUser } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Função para buscar usuários com feedback visual
  const fetchUsers = async (forceRefresh = true) => {
    setIsLoading(true);
    try {
      console.log('📋 Buscando lista de usuários...');
      
      // Usar setTimeout para garantir que a UI seja atualizada antes da operação assíncrona
      setTimeout(async () => {
        try {
          // Forçar refresh para garantir dados atualizados
          const allUsers = await getUsers(true);
          
          // Verificar se temos dados
          if (!allUsers || allUsers.length === 0) {
            console.log('⚠️ Nenhum usuário retornado da API');
            setUsers([]);
            setIsLoading(false);
            return;
          }
          
          console.log(`✅ ${allUsers.length} usuários recebidos da API`);
          
          // Se for gestor, filtra apenas os corretores da sua equipe
          if (currentUser?.role === 'GESTOR') {
            const filteredUsers = allUsers.filter(user => 
              user.role === 'CORRETOR' && user.managerId === currentUser.id
            );
            setUsers(filteredUsers);
            console.log(`✅ ${filteredUsers.length} corretores encontrados para o gestor`);
          } else {
            // Se for master, mostra todos os usuários
            setUsers(allUsers);
            console.log(`✅ ${allUsers.length} usuários no total`);
          }
          
          // Exibir sucesso se houver dados
          if (allUsers.length > 0) {
            toast.success(`${allUsers.length} usuários carregados com sucesso!`);
          }
        } catch (error) {
          console.error('❌ Erro ao processar dados dos usuários:', error);
          toast.error('Erro ao processar dados dos usuários');
        } finally {
          setIsLoading(false);
        }
      }, 300); // 300ms de delay para garantir feedback visual
    } catch (error) {
      console.error('❌ Erro ao buscar usuários:', error);
      toast.error('Não foi possível carregar a lista de usuários');
      setIsLoading(false);
    }
  };
  
  // Testar conexão direta com o banco de dados
  const testDatabaseConnection = async () => {
    try {
      toast.loading('Testando conexão com o banco de dados...');
      const response = await fetch('/api/testerdb', {
        method: 'GET',
        headers: {
          'cache-control': 'no-cache, no-store, must-revalidate',
        }
      });
      
      if (!response.ok) {
        toast.error('Falha ao testar conexão com o banco de dados');
        return;
      }
      
      const data = await response.json();
      toast.dismiss();
      
      if (data.success) {
        toast.success('Conexão com o banco de dados OK!');
        console.log('✅ Teste de conexão bem-sucedido:', data);
      } else {
        toast.error('Problema na conexão com o banco de dados');
        console.error('❌ Teste de conexão falhou:', data);
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Erro ao testar conexão com o banco de dados');
      console.error('❌ Erro no teste de conexão:', error);
    }
  };

  useEffect(() => {
    if (!currentUser || (currentUser.role !== 'MASTER' && currentUser.role !== 'GESTOR')) {
      router.push('/');
      return;
    }

    fetchUsers();
    
    // Adiciona um listener para atualizar a lista quando a página é recarregada
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Página tornou-se visível. Atualizando dados...');
        fetchUsers();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentUser, router]);

  const getRoleName = (role: string) => {
    switch (role) {
      case 'MASTER':
        return 'Administrador';
      case 'GESTOR':
        return 'Gestor';
      case 'CORRETOR':
        return 'Corretor';
      default:
        return role;
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await deleteUser(userId);
        // Recarrega a lista de usuários após a exclusão
        await fetchUsers();
        toast.success('Usuário excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        toast.error('Erro ao excluir usuário');
      }
    }
  };

  const handleRefreshList = () => {
    fetchUsers(true);
    toast.success('Atualizando lista de usuários...');
  };

  return (
    <div className="min-h-screen bg-[#373737] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#938667] rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              {currentUser?.role === 'GESTOR' ? 'Gerenciar Corretores' : 'Gerenciar Usuários'}
            </h1>
            <div className="flex gap-2">
              {/* Botão de atualizar lista */}
              <button
                onClick={handleRefreshList}
                disabled={isLoading}
                className={`px-4 py-2 bg-[#373737] text-white rounded-lg hover:bg-[#373737]/80 transition-colors flex items-center gap-2 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <svg
                  className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {isLoading ? 'Atualizando...' : 'Atualizar Lista'}
              </button>
              
              {/* Botão de teste de banco de dados */}
              <button
                onClick={testDatabaseConnection}
                className="px-4 py-2 bg-[#373737] text-white rounded-lg hover:bg-[#373737]/80 transition-colors flex items-center gap-2"
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
                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                  />
                </svg>
                Testar Conexão
              </button>
              
              {currentUser?.role === 'MASTER' && (
                <button
                  onClick={() => router.push('/register')}
                  className="px-4 py-2 bg-[#373737] text-white rounded-lg hover:bg-[#373737]/80 transition-colors flex items-center gap-2"
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
                  Adicionar Usuário
                </button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="bg-[#373737] rounded-lg p-20 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#938667] mb-4"></div>
              <p className="text-white">Carregando usuários...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="bg-[#373737] rounded-lg p-10 flex flex-col items-center justify-center">
              <svg
                className="w-16 h-16 text-[#938667] mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-white text-xl mb-2">Nenhum usuário encontrado</p>
              <p className="text-[#938667]">
                {currentUser?.role === 'GESTOR' 
                  ? 'Você ainda não tem corretores em sua equipe.' 
                  : 'Não há usuários cadastrados.'}
              </p>
            </div>
          ) : (
            <div className="bg-[#373737] rounded-lg overflow-hidden">
              <table className="w-full text-white">
                <thead className="bg-[#373737]/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium">Nome</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Cargo</th>
                    {currentUser?.role === 'MASTER' && (
                      <>
                        <th className="px-6 py-3 text-left text-sm font-medium">ID da Equipe</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">ID do Gestor</th>
                      </>
                    )}
                    <th className="px-6 py-3 text-left text-sm font-medium">Último Login</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#938667]/20">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-[#938667]/10">
                      <td className="px-6 py-4 text-sm">{user.name}</td>
                      <td className="px-6 py-4 text-sm">{user.email}</td>
                      <td className="px-6 py-4 text-sm">{getRoleName(user.role)}</td>
                      {currentUser?.role === 'MASTER' && (
                        <>
                          <td className="px-6 py-4 text-sm">{user.teamId || '-'}</td>
                          <td className="px-6 py-4 text-sm">{user.managerId || '-'}</td>
                        </>
                      )}
                      <td className="px-6 py-4 text-sm">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString('pt-BR') : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {((currentUser?.role === 'MASTER' && user.role !== 'MASTER') ||
                          (currentUser?.role === 'GESTOR' && user.role === 'CORRETOR' && user.managerId === currentUser.id)) && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-500 hover:text-red-700"
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
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 