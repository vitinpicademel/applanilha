'use client';

import { usePathname } from 'next/navigation';
import ClientLayout from './ClientLayout';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return <ClientLayout>{children}</ClientLayout>;
} 