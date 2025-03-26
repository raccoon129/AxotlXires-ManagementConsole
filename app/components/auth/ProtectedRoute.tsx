"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/app/services/auth';
import { jwtDecode } from 'jwt-decode';

interface TokenDecodificado {
  rol: 'administrador' | 'moderador';
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'administrador' | 'moderador';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Verificar autenticación
    const token = getToken();

    if (!token) {
      // No hay token, redirigir a login
      router.replace('/');
      return;
    }

    try {
      // Verificar rol si es necesario
      if (requiredRole) {
        const decodificado = jwtDecode(token) as TokenDecodificado;
        
        if (decodificado.rol !== requiredRole) {
          // Rol incorrecto, redirigir según el rol
          if (decodificado.rol === 'administrador') {
            router.replace('/dashboardAdministrador');
          } else if (decodificado.rol === 'moderador') {
            router.replace('/dashboardModerador');
          } else {
            router.replace('/');
          }
          return;
        }
      }
      
      // Autorizado
      setAuthorized(true);
    } catch (error) {
      // Token inválido
      console.error('Error decodificando token:', error);
      router.replace('/');
    }
  }, [router, requiredRole]);

  // Renderizar contenido solo cuando está autorizado
  return authorized ? <>{children}</> : <div>Verificando acceso...</div>;
}