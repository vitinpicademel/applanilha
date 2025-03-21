'use client';

import { useState } from 'react';
import { useData } from './context/DataContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { handleExport, addDataFromXLSX } = useData();
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleImportClick = () => {
    addDataFromXLSX();
  };

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

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-[#373737] relative">
        {/* Sidebar */}
        <div
          className={`bg-[#938667] shadow-lg transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'w-64' : 'w-0'
          } overflow-hidden relative`}
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold text-white mb-6">Opções</h2>
            <nav className="space-y-3">
              <button
                onClick={() => router.push('/')}
                className="w-full px-4 py-3 text-left text-sm font-medium text-white hover:bg-[#373737] hover:text-white rounded-lg transition-all duration-200 flex items-center gap-3 border border-[#373737] hover:border-white"
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
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Menu Inicial
              </button>

              <button
                onClick={() => router.push('/minha-conta')}
                className="w-full px-4 py-3 text-left text-sm font-medium text-white hover:bg-[#373737] hover:text-white rounded-lg transition-all duration-200 flex items-center gap-3 border border-[#373737] hover:border-white"
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Minha Conta
              </button>

              {(user?.role === 'MASTER' || user?.role === 'GESTOR') && (
                <button
                  onClick={() => router.push('/gerenciar-usuarios')}
                  className="w-full px-4 py-3 text-left text-sm font-medium text-white hover:bg-[#373737] hover:text-white rounded-lg transition-all duration-200 flex items-center gap-3 border border-[#373737] hover:border-white"
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  Gerenciar Usuários
                </button>
              )}

              <div className="h-[1px] bg-[#373737]/20 my-3"></div>

              {(user?.role === 'MASTER' || user?.role === 'GESTOR') && (
                <>
                  <button
                    onClick={handleImportClick}
                    className="w-full px-4 py-3 text-left text-sm font-medium text-white hover:bg-[#373737] hover:text-white rounded-lg transition-all duration-200 flex items-center gap-3 border border-[#373737] hover:border-white"
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
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    Importar Excel
                  </button>
                  <button
                    onClick={handleExport}
                    className="w-full px-4 py-3 text-left text-sm font-medium text-white hover:bg-[#373737] hover:text-white rounded-lg transition-all duration-200 flex items-center gap-3 border border-[#373737] hover:border-white"
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
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Exportar Excel
                  </button>
                </>
              )}

              <div className="h-[1px] bg-[#373737]/20 my-3"></div>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left text-sm font-medium text-white hover:bg-[#373737] hover:text-white rounded-lg transition-all duration-200 flex items-center gap-3 border border-[#373737] hover:border-white"
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sair da conta
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`fixed top-4 z-50 p-2 rounded-lg bg-[#938667] shadow-md hover:bg-[#7a6f55] transition-all duration-300 border border-[#373737] ${
              isSidebarOpen ? 'left-64' : 'left-4'
            }`}
          >
            <svg
              className={`w-6 h-6 text-white transition-transform ${
                isSidebarOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Page Content */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>

          {/* Marca d'água */}
          <div className="absolute bottom-2 left-0 right-0 text-center">
            <span className="text-[#938667]/30 text-sm font-medium select-none">
              Desenvolvido por Kaká®
            </span>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 