'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types/user';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CORRETOR' as UserRole,
    teamId: '',
    managerId: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register, currentUser } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    try {
      // Cria o objeto de dados do usuário
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        teamId: formData.teamId || undefined,
        managerId: formData.managerId || undefined,
      };
      
      console.log('📝 Enviando dados de registro:', { ...userData, password: '***' });
      
      // Mostrar toast de carregamento
      toast.loading('Criando conta...');
      
      // Chama a função de registro
      const success = await register(userData);

      // Remover toast de carregamento
      toast.dismiss();

      if (success) {
        toast.success('Conta criada com sucesso!');
        
        // Espera um momento para garantir que os dados sejam salvos
        setTimeout(() => {
          console.log('⏱️ Aguardando para redirecionar...');
          
          // Redireciona para a página apropriada
          if (currentUser?.role === 'MASTER') {
            console.log('🔄 Redirecionando para gerenciamento de usuários...');
            router.push('/gerenciar-usuarios');
          } else {
            console.log('🔄 Redirecionando para login...');
            router.push('/login');
          }
        }, 1500); // 1.5 segundos para garantir que o banco complete a transação
      } else {
        // O toast de erro já é exibido pela função de registro
        setIsLoading(false);
      }
    } catch (error) {
      console.error('❌ Erro ao registrar usuário:', error);
      toast.error('Ocorreu um erro ao criar a conta. Tente novamente.');
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2A2A2A] py-8">
      <div className="bg-[#373737] p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 relative mb-4 rounded-full overflow-hidden border-2 border-[#938667]">
            <Image
              src="/images/logo.png"
              alt="Logo da empresa"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-semibold text-white">Criar conta</h1>
          <p className="text-[#938667] mt-2">Preencha os dados para se registrar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#938667] mb-2">
              Nome completo
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#2A2A2A] border border-[#938667] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#938667]"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#938667] mb-2">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#2A2A2A] border border-[#938667] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#938667]"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#938667] mb-2">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#2A2A2A] border border-[#938667] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#938667]"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#938667] mb-2">
              Confirme a senha
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#2A2A2A] border border-[#938667] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#938667]"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-[#938667] mb-2">
              Tipo de usuário
            </label>
            <select
              id="role"
              name="role"
              required
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#2A2A2A] border border-[#938667] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#938667]"
            >
              <option value="CORRETOR">Corretor</option>
              <option value="GESTOR">Gestor</option>
            </select>
          </div>

          {formData.role === 'GESTOR' && (
            <div>
              <label htmlFor="teamId" className="block text-sm font-medium text-[#938667] mb-2">
                ID da Equipe
              </label>
              <input
                id="teamId"
                name="teamId"
                type="text"
                required
                value={formData.teamId}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#2A2A2A] border border-[#938667] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#938667]"
              />
            </div>
          )}

          {formData.role === 'CORRETOR' && (
            <div>
              <label htmlFor="managerId" className="block text-sm font-medium text-[#938667] mb-2">
                ID do Gestor (opcional)
              </label>
              <input
                id="managerId"
                name="managerId"
                type="text"
                value={formData.managerId}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#2A2A2A] border border-[#938667] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#938667]"
              />
              <p className="text-xs text-[#938667] mt-1">
                Este campo pode ser deixado em branco. O gestor poderá ser associado posteriormente.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 bg-[#938667] text-white rounded-lg font-medium mt-6
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#7a6f55] transition-colors'}
            `}
          >
            {isLoading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#938667]/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#373737] text-[#938667]">
                Já tem uma conta?
              </span>
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="mt-4 w-full py-3 px-4 bg-transparent text-[#938667] border border-[#938667] rounded-lg font-medium 
              hover:bg-[#938667] hover:text-white transition-colors"
          >
            Fazer login
          </button>
        </div>
      </div>
    </div>
  );
} 