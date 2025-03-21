'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2A2A2A]">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#938667] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">Página não encontrada</h2>
        <p className="text-[#938667] mb-8">A página que você está procurando não existe.</p>
        <Link 
          href="/login" 
          className="px-6 py-3 bg-[#938667] text-white rounded-lg font-medium hover:bg-[#7a6f55] transition-colors"
        >
          Ir para o Login
        </Link>
      </div>
    </div>
  );
} 