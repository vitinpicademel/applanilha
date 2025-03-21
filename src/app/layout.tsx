import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from 'react-hot-toast'
import AuthWrapper from "./AuthWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Controle de Vendas",
  description: "Sistema de gerenciamento de dados Excel com importação e exportação",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <Providers>
          <AuthWrapper>{children}</AuthWrapper>
        </Providers>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#373737',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#938667',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
