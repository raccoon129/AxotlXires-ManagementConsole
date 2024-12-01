import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

interface EstadoAutenticacion {
  estaAutenticado: boolean;
  nombreUsuario: string | null;
  idUsuario: string | null;
  perfilUsuario: any | null;
  estaCargando: boolean;
}

interface TokenDecodificado {
  nombre: string;
  id: string;
  exp: number;
}

export const useAuth = () => {
  const router = useRouter();
  const [estadoAuth, setEstadoAuth] = useState<EstadoAutenticacion>({
    estaAutenticado: false,
    nombreUsuario: null,
    idUsuario: null,
    perfilUsuario: null,
    estaCargando: true
  });

  // Verificar si el token ha expirado
  const tokenHaExpirado = (tokenDecodificado: TokenDecodificado): boolean => {
    if (!tokenDecodificado.exp) return true;
    const tiempoActual = Math.floor(Date.now() / 1000);
    return tokenDecodificado.exp < tiempoActual;
  };

  // Obtener el perfil del usuario
  const obtenerPerfilUsuario = useCallback(async (idUsuario: string) => {
    try {
      const token = localStorage.getItem('token');
      const respuesta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${idUsuario}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (respuesta.ok) {
        const datos = await respuesta.json();
        setEstadoAuth(previo => ({
          ...previo,
          perfilUsuario: datos.datos
        }));
      }
    } catch (error) {
      console.error('Error al obtener el perfil:', error);
    }
  }, []);

  // Cerrar sesión
  const cerrarSesion = useCallback(() => {
    localStorage.removeItem('token');
    setEstadoAuth({
      estaAutenticado: false,
      nombreUsuario: null,
      idUsuario: null,
      perfilUsuario: null,
      estaCargando: false
    });
    router.push('/login');
  }, [router]);

  // Verificar autenticación
  const verificarAutenticacion = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setEstadoAuth(previo => ({ ...previo, estaCargando: false, estaAutenticado: false }));
      return;
    }

    try {
      const tokenDecodificado = jwtDecode(token) as TokenDecodificado;

      if (tokenHaExpirado(tokenDecodificado)) {
        cerrarSesion();
        return;
      }

      setEstadoAuth({
        estaAutenticado: true,
        nombreUsuario: tokenDecodificado.nombre || null,
        idUsuario: tokenDecodificado.id || null,
        perfilUsuario: null,
        estaCargando: false
      });
      
      if (tokenDecodificado.id) {
        obtenerPerfilUsuario(tokenDecodificado.id);
      }
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      cerrarSesion();
    }
  }, [obtenerPerfilUsuario, cerrarSesion]);

  // Efecto inicial
  useEffect(() => {
    verificarAutenticacion();
  }, [verificarAutenticacion]);

  // Actualizar estado después del login
  const actualizarAuthDespuesDeLogin = useCallback(async (token: string) => {
    localStorage.setItem('token', token);
    await verificarAutenticacion();
  }, [verificarAutenticacion]);

  return { 
    ...estadoAuth,
    cerrarSesion,
    actualizarPerfil: () => estadoAuth.idUsuario && obtenerPerfilUsuario(estadoAuth.idUsuario),
    actualizarAuthDespuesDeLogin
  };
}; 