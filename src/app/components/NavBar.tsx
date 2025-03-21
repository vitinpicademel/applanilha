'use client'

import { useState } from 'react';
import Link from 'next/link';
import { FiLogOut, FiUsers, FiUserPlus, FiHome, FiDatabase, FiMenu, FiList, FiSettings } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md mb-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              App Donna
            </Link>
          </div>

          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-blue-500 focus:outline-none"
            >
              <FiMenu size={24} />
            </button>
          </div>

          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <>
                <Link 
                  href="/" 
                  className="text-gray-600 hover:text-blue-500 flex items-center mr-4"
                >
                  <FiHome className="mr-1" />
                  Home
                </Link>
                {user?.role === 'ADMIN' && (
                  <>
                    <Link 
                      href="/gerenciar-usuarios" 
                      className="text-gray-600 hover:text-blue-500 flex items-center mr-4"
                    >
                      <FiUsers className="mr-1" />
                      Gerenciar Usuários
                    </Link>
                    <Link 
                      href="/register" 
                      className="text-gray-600 hover:text-blue-500 flex items-center mr-4"
                    >
                      <FiUserPlus className="mr-1" />
                      Novo Usuário
                    </Link>
                    <Link 
                      href="/diagnose" 
                      className="text-gray-600 hover:text-blue-500 flex items-center mr-4"
                    >
                      <FiDatabase className="mr-1" />
                      Diagnóstico DB
                    </Link>
                    <Link 
                      href="/logs" 
                      className="text-gray-600 hover:text-blue-500 flex items-center mr-4"
                    >
                      <FiList className="mr-1" />
                      Logs
                    </Link>
                    <Link 
                      href="/admin/status" 
                      className="text-gray-600 hover:text-blue-500 flex items-center mr-4"
                    >
                      <FiSettings className="mr-1" />
                      Status
                    </Link>
                  </>
                )}
                <button 
                  onClick={logout}
                  className="text-red-600 hover:text-red-700 flex items-center"
                >
                  <FiLogOut className="mr-1" />
                  Sair
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden absolute top-16 right-0 left-0 bg-white shadow-lg z-10">
            <div className="flex flex-col">
              <Link 
                href="/" 
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 flex items-center"
                onClick={() => setIsOpen(false)}
              >
                <FiHome className="mr-2" />
                Home
              </Link>
              {user?.role === 'ADMIN' && (
                <>
                  <Link 
                    href="/gerenciar-usuarios" 
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <FiUsers className="mr-2" />
                    Gerenciar Usuários
                  </Link>
                  <Link 
                    href="/register" 
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <FiUserPlus className="mr-2" />
                    Novo Usuário
                  </Link>
                  <Link 
                    href="/diagnose" 
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <FiDatabase className="mr-2" />
                    Diagnóstico DB
                  </Link>
                  <Link 
                    href="/logs" 
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <FiList className="mr-2" />
                    Logs
                  </Link>
                  <Link 
                    href="/admin/status" 
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <FiSettings className="mr-2" />
                    Status
                  </Link>
                </>
              )}
              {isAuthenticated ? (
                <button 
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center"
                >
                  <FiLogOut className="mr-2" />
                  Sair
                </button>
              ) : (
                <Link 
                  href="/login" 
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 