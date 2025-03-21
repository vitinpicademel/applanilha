'use client';

import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function MinhaContaPage() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    teamId: user?.teamId || '',
  });

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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      if (user?.id) {
        // Validar ID da equipe para gestor
        if (user.role === 'GESTOR' && !user.teamId?.trim()) {
          toast.error('ID da equipe é obrigatório para Gestores');
          return;
        }

        // Se for gestor, mantém o teamId original
        const dataToUpdate = {
          name: formData.name,
          email: formData.email,
          teamId: user.role === 'GESTOR' ? user.teamId : formData.teamId,
        };

        await updateUser(user.id, dataToUpdate);
        setIsEditing(false);
        toast.success('Informações atualizadas com sucesso!');
      }
    } catch (error) {
      toast.error('Erro ao atualizar informações');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      teamId: user?.teamId || '',
    });
    setIsEditing(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#373737] p-8">
      <div className="max-w-2xl mx-auto">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Minha Conta
            </h1>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="text-white hover:text-[#373737] transition-colors"
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
            )}
          </div>
          
          <div className="space-y-6">
            <div className="bg-[#373737] rounded-lg p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#938667] mb-1">Nome</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-[#2A2A2A] border border-[#938667] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#938667]"
                    />
                  ) : (
                    <p className="text-white text-lg">{user.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-[#938667] mb-1">E-mail</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 bg-[#2A2A2A] border border-[#938667] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#938667]"
                    />
                  ) : (
                    <p className="text-white text-lg">{user.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-[#938667] mb-1">Cargo</label>
                  <p className="text-white text-lg">{getRoleName(user.role)}</p>
                </div>
                {user.role === 'GESTOR' && (
                  <div>
                    <label className="block text-sm text-[#938667] mb-1">
                      ID da Equipe
                      {isEditing && (
                        <span className="text-xs text-[#938667]/70 ml-2">(Somente administradores podem alterar)</span>
                      )}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={user.teamId || ''}
                        disabled={true}
                        className="w-full px-4 py-2 bg-[#2A2A2A] border border-[#938667] rounded-lg text-white/50 focus:outline-none cursor-not-allowed"
                      />
                    ) : (
                      <p className="text-white text-lg">{user.teamId || '-'}</p>
                    )}
                  </div>
                )}
                {user.role === 'CORRETOR' && user.managerId && (
                  <div>
                    <label className="block text-sm text-[#938667] mb-1">ID do Gestor</label>
                    <p className="text-white text-lg">{user.managerId}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm text-[#938667] mb-1">Último Login</label>
                  <p className="text-white text-lg">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString('pt-BR') : 'N/A'}
                  </p>
                </div>
              </div>
              {isEditing && (
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-[#938667] text-white rounded-lg hover:bg-[#7a6f55] transition-colors"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-[#373737] text-white rounded-lg hover:bg-[#373737]/80 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 