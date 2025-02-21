import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

interface EstadoAutenticacion {
  estaAutenticado: boolean;
  nombreUsuario: string | null;
  idUsuario: string | null;
  perfilUsuario: any | null;
  rol: 'administrador' | 'moderador' | null;
  estaCargando: boolean;
}

interface TokenDecodificado {
  nombre: string;
  id: string;
  rol: 'administrador' | 'moderador';
  exp: number;
}

interface RespuestaLogin {
  status: 'success' | 'error';
  mensaje: string;
  datos?: {
    usuario: {
      id: number;
      nombre: string;
      correo: string;
      rol: 'administrador' | 'moderador';
    };
    token: string;
  };
}

export const useAuth = () => {
  const router = useRouter();
  const [estadoAuth, setEstadoAuth] = useState<EstadoAutenticacion>({
    estaAutenticado: false,
    nombreUsuario: null,
    idUsuario: null,
    perfilUsuario: null,
    rol: null,
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
      rol: null,
      estaCargando: false
    });
    router.push('/login');
  }, [router]);

  // Verificar acceso al dashboard
  const verificarAcceso = useCallback(async (token: string) => {
    try {
      const respuesta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-access`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return respuesta.ok;
    } catch (error) {
      console.error('Error al verificar acceso:', error);
      return false;
    }
  }, []);

  // Iniciar sesión
  const iniciarSesion = useCallback(async (correo: string, contrasena: string): Promise<RespuestaLogin> => {
    try {
      const respuesta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ correo, contrasena })
      });

      const datos: RespuestaLogin = await respuesta.json();

      if (datos.status === 'success' && datos.datos) {
        // Guardar token
        localStorage.setItem('token', datos.datos.token);
        
        // Actualizar estado
        setEstadoAuth({
          estaAutenticado: true,
          nombreUsuario: datos.datos.usuario.nombre,
          idUsuario: datos.datos.usuario.id.toString(),
          rol: datos.datos.usuario.rol,
          perfilUsuario: datos.datos.usuario,
          estaCargando: false
        });

        // Redirigir según el rol
        const ruta = datos.datos.usuario.rol === 'administrador' 
          ? '/dashboardAdministrador' 
          : '/dashboardModerador';
        
        // Usar window.location para forzar recarga completa
        window.location.href = ruta;
      }

      return datos;
    } catch (error) {
      // Manejar errores de red
      if (error instanceof Error) {
        return {
          status: 'error',
          mensaje: error.message
        };
      }
      return {
        status: 'error',
        mensaje: 'Error inesperado durante el inicio de sesión'
      };
    }
  }, []);

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

      // Verificar acceso al dashboard
      const tieneAcceso = await verificarAcceso(token);
      if (!tieneAcceso) {
        cerrarSesion();
        return;
      }

      setEstadoAuth({
        estaAutenticado: true,
        nombreUsuario: tokenDecodificado.nombre,
        idUsuario: tokenDecodificado.id,
        rol: tokenDecodificado.rol,
        perfilUsuario: null,
        estaCargando: false
      });
      
      if (tokenDecodificado.id) {
        obtenerPerfilUsuario(tokenDecodificado.id);
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      cerrarSesion();
    }
  }, [verificarAcceso, cerrarSesion]);

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
    iniciarSesion,
    cerrarSesion,
    actualizarPerfil: () => estadoAuth.idUsuario && obtenerPerfilUsuario(estadoAuth.idUsuario),
    actualizarAuthDespuesDeLogin
  };
}; 