'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole, AuthState } from '@/types/user';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '@/config/api';
import { useRouter } from 'next/navigation';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    teamId?: string;
    managerId?: string;
  }) => Promise<boolean>;
  getUsers: (forceRefresh?: boolean) => Promise<User[]>;
  deleteUser: (userId: string) => Promise<void>;
  updateUser: (userId: string, userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });
  const router = useRouter();

  // Carregar dados do localStorage e cookie na inicialização
  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    const authCookie = Cookies.get('auth');
    
    if (storedAuth && authCookie) {
      setAuthState(JSON.parse(storedAuth));
    }
  }, []);

  // Salvar alterações no localStorage e cookie
  useEffect(() => {
    if (authState.isAuthenticated) {
      localStorage.setItem('auth', JSON.stringify(authState));
      Cookies.set('auth', 'true', { expires: 7 }); // Cookie expira em 7 dias
    } else {
      localStorage.removeItem('auth');
      Cookies.remove('auth');
    }
  }, [authState]);

  const login = async (email: string, password: string) => {
    try {
      console.log('Tentando fazer login com:', email);
      
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Status da resposta:', response.status);
      const data = await response.json();
      console.log('Dados da resposta:', data);

      if (!data.success) {
        toast.error(data.error || 'Email ou senha inválidos');
        return false;
      }

      const newAuthState = {
        user: data.user,
        isAuthenticated: true,
      };

      setAuthState(newAuthState);
      localStorage.setItem('auth', JSON.stringify(newAuthState));
      Cookies.set('auth', 'true', { expires: 7 });
      
      toast.success('Login realizado com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error('Erro ao realizar login');
      return false;
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Iniciando logout do usuário', authState.user?.email);
      
      // Registrar o logout no sistema se o usuário estiver autenticado
      if (authState.user) {
        try {
          const response = await fetch('/api/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              userId: authState.user.id,
              email: authState.user.email 
            }),
          });
          
          if (!response.ok) {
            console.warn('⚠️ Falha ao registrar logout no servidor, mas continuando com logout local');
          }
        } catch (error) {
          console.error('❌ Erro ao chamar API de logout:', error);
          // Continuamos com o logout mesmo se a API falhar
        }
      }
      
      // Limpar o cookie e o estado local
      Cookies.remove('userData');
      setAuthState({
        user: null,
        isAuthenticated: false,
      });
      
      console.log('✅ Usuário deslogado com sucesso');
      
      // Redirecionar para a página de login
      router.push('/login');
    } catch (error) {
      console.error('❌ Erro ao realizar logout:', error);
      // Tentar fazer logout mesmo com erro
      Cookies.remove('userData');
      setAuthState({
        user: null,
        isAuthenticated: false,
      });
      router.push('/login');
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    teamId?: string;
    managerId?: string;
  }) => {
    try {
      console.log('Iniciando registro de usuário:', { ...userData, password: '***' });
      
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('Status da resposta:', response.status);
      const data = await response.json();
      console.log('Dados da resposta:', data);

      if (!response.ok) {
        const errorMessage = data.error || 'Erro ao registrar usuário';
        console.error('Erro no registro:', errorMessage);
        toast.error(errorMessage);
        return false;
      }

      console.log('Usuário registrado com sucesso:', data.user);
      toast.success('Usuário registrado com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao registrar:', error);
      toast.error('Erro ao conectar com o servidor. Tente novamente.');
      return false;
    }
  };

  const getUsers = async (forceRefresh = false) => {
    try {
      console.log('📋 Buscando usuários...');
      
      // Construir os parâmetros da consulta
      const queryParams = new URLSearchParams();
      if (authState.user?.role === 'GESTOR') {
        queryParams.append('role', 'CORRETOR');
        queryParams.append('managerId', authState.user.id);
      }
      
      // Adicionar timestamp para evitar cache em atualizações
      // Sempre forçar refresh para garantir dados atualizados
      queryParams.append('_t', Date.now().toString());

      console.log(`📡 Fazendo requisição para /api/users?${queryParams}`);
      const response = await fetch(`/api/users?${queryParams}`, {
        // Desabilitar cache para garantir dados frescos
        cache: 'no-store',
        headers: {
          'pragma': 'no-cache',
          'cache-control': 'no-cache, no-store, must-revalidate',
          'expires': '0',
        },
        // Usar o método POST para evitar cache de GET
        method: forceRefresh ? 'POST' : 'GET',
      });
      
      if (!response.ok) {
        console.error(`❌ Erro na resposta: ${response.status} ${response.statusText}`);
        toast.error('Erro ao buscar usuários do servidor');
        return [];
      }
      
      const data = await response.json();
      console.log(`✅ Resposta recebida: ${data.success ? 'Sucesso' : 'Falha'}, ${data.users?.length || 0} usuários`);

      if (!data.success) {
        toast.error(data.error || 'Erro ao buscar usuários');
        return [];
      }

      return data.users;
    } catch (error) {
      console.error('❌ Erro ao buscar usuários:', error);
      toast.error('Erro ao buscar usuários');
      return [];
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch('/api/users/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId }),
      });

      const data = await response.json();

      if (!data.success) {
        toast.error(data.error || 'Erro ao excluir usuário');
        return;
      }

      toast.success('Usuário excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast.error('Erro ao excluir usuário');
    }
  };

  const updateUser = async (userId: string, userData: Partial<User>) => {
    try {
      const response = await fetch('/api/users/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId, ...userData }),
      });

      const data = await response.json();

      if (!data.success) {
        toast.error(data.error || 'Erro ao atualizar usuário');
        return;
      }

      // Se o usuário atualizado for o usuário logado, atualiza o estado de autenticação
      if (userId === authState.user?.id) {
        const updatedUser = { ...authState.user, ...userData };
        setAuthState(prev => ({
          ...prev,
          user: updatedUser
        }));
      }

      toast.success('Informações atualizadas com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast.error('Erro ao atualizar usuário');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        register,
        getUsers,
        deleteUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 