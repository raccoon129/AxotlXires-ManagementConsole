import { getToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface DashboardData {
  usuarios: {
    total_usuarios: number;
    usuarios_regulares: number;
    moderadores: number;
    administradores: number;
    nuevos_hoy: number;
  };
  publicaciones: {
    total_publicaciones: number;
    publicadas: number;
    en_revision: number;
    rechazadas: number;
    creadas_hoy: number;
  };
  interacciones: {
    total_comentarios: number;
    total_favoritos: number;
    total_notas_estudio: number;
  };
  revisiones: {
    total_revisiones: number;
    aprobadas: number;
    rechazadas: number;
  };
}

export interface TendenciasData {
  publicaciones_populares: Array<{
    id_publicacion: number;
    titulo: string;
    autor: string;
    total_favoritos: number;
    total_comentarios: number;
    fecha_publicacion: string;
  }>;
  usuarios_activos: Array<{
    id_usuario: number;
    nombre: string;
    total_publicaciones: number;
    total_comentarios: number;
    total_favoritos: number;
  }>;
  tipos_populares: Array<{
    nombre: string;
    total_publicaciones: number;
    total_favoritos: number;
  }>;
}

export interface ActividadData {
  actividad_publicaciones: Array<{
    fecha: string;
    total_publicaciones: number;
    publicadas: number;
    en_revision: number;
  }>;
  actividad_usuarios: Array<{
    fecha: string;
    nuevos_usuarios: number;
    usuarios_activos: number;
  }>;
}

export const analyticsService = {
  async getDashboardData(): Promise<DashboardData> {
    const token = getToken();
    const response = await fetch(`${API_URL}/analytics/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener datos del dashboard');
    }
    
    const data = await response.json();
    return data.datos;
  },

  async getTendencias(): Promise<TendenciasData> {
    const token = getToken();
    const response = await fetch(`${API_URL}/analytics/tendencias`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener tendencias');
    }
    
    const data = await response.json();
    return data.datos;
  },

  async getActividad(periodo: 'diario' | 'semanal' | 'mensual'): Promise<ActividadData> {
    const token = getToken();
    const response = await fetch(`${API_URL}/analytics/actividad/${periodo}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener datos de actividad');
    }
    
    const data = await response.json();
    return data.datos;
  }
}; 