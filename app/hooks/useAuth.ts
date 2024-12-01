import { create } from 'zustand';

interface AuthState {
  estaAutenticado: boolean;
  usuario: {
    nombre: string;
    rol: string;
  } | null;
  establecerAutenticacion: (estado: boolean) => void;
  establecerUsuario: (usuario: AuthState['usuario']) => void;
  cerrarSesion: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  estaAutenticado: false,
  usuario: null,
  establecerAutenticacion: (estado) => set({ estaAutenticado: estado }),
  establecerUsuario: (usuario) => set({ usuario }),
  cerrarSesion: () => set({ estaAutenticado: false, usuario: null }),
})); 