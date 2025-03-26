"use client";

import { useEffect, useState } from 'react';
import { 
  Users, 
  FileText, 
  Bell, 
  Activity,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Heart,
  BookOpen,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { analyticsService, DashboardData, TendenciasData, ActividadData } from '../services/analytics';
import Skeleton from '../components/ui/Skeleton';
import ProtectedRoute from "@/app/components/auth/ProtectedRoute";

// Interfaces para los datos locales
interface EstadisticaCard {
  titulo: string;
  valor: number;
  incremento?: number;
  icono: JSX.Element;
  color: string;
}

export default function DashboardAdministrador() {
  // Estados para los diferentes conjuntos de datos
  const [cargando, setCargando] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [tendencias, setTendencias] = useState<TendenciasData | null>(null);
  const [actividad, setActividad] = useState<ActividadData | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [dashboard, tendenciasData, actividadData] = await Promise.all([
          analyticsService.getDashboardData(),
          analyticsService.getTendencias(),
          analyticsService.getActividad('diario')
        ]);

        setDashboardData(dashboard);
        setTendencias(tendenciasData);
        setActividad(actividadData);
      } catch (error) {
        toast.error('Error al cargar los datos del dashboard');
        console.error('Error:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  // Generar tarjetas de estadísticas
  const generarEstadisticas = (): EstadisticaCard[] => {
    if (!dashboardData) return [];

    return [
      {
        titulo: 'Usuarios Totales',
        valor: dashboardData.usuarios.total_usuarios,
        incremento: (dashboardData.usuarios.nuevos_hoy / dashboardData.usuarios.total_usuarios) * 100,
        icono: <Users className="w-6 h-6" />,
        color: '#612c7d'
      },
      {
        titulo: 'Publicaciones',
        valor: dashboardData.publicaciones.total_publicaciones,
        incremento: (dashboardData.publicaciones.creadas_hoy / dashboardData.publicaciones.total_publicaciones) * 100,
        icono: <FileText className="w-6 h-6" />,
        color: '#2d567e'
      },
      {
        titulo: 'Interacciones',
        valor: dashboardData.interacciones.total_comentarios + dashboardData.interacciones.total_favoritos,
        icono: <MessageSquare className="w-6 h-6" />,
        color: '#612c7d'
      },
      {
        titulo: 'Revisiones',
        valor: dashboardData.revisiones.total_revisiones,
        incremento: (dashboardData.revisiones.aprobadas / dashboardData.revisiones.total_revisiones) * 100,
        icono: <Activity className="w-6 h-6" />,
        color: '#2d567e'
      }
    ];
  };

  // Componente para tarjeta de estadística
  const TarjetaEstadistica = ({ estadistica }: { estadistica: EstadisticaCard }) => (
    <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div 
          className="p-3 rounded-full" 
          style={{ backgroundColor: `${estadistica.color}20` }}
        >
          <div style={{ color: estadistica.color }}>{estadistica.icono}</div>
        </div>
        {estadistica.incremento !== undefined && (
          <div className={`flex items-center ${
            estadistica.incremento >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {estadistica.incremento >= 0 ? (
              <ArrowUp className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDown className="w-4 h-4 mr-1" />
            )}
            <span className="text-sm font-medium">
              {Math.abs(estadistica.incremento).toFixed(1)}%
            </span>
          </div>
        )}
      </div>
      <h3 className="text-gray-600 text-sm mb-2">{estadistica.titulo}</h3>
      <p className="text-2xl font-bold" style={{ color: estadistica.color }}>
        {estadistica.valor.toLocaleString()}
      </p>
    </div>
  );

  if (cargando) {
    return <Skeleton />;
  }

  return (
    <ProtectedRoute requiredRole="administrador">
      <div className="space-y-8">
        {/* Encabezado */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Management Console
          </h1>
          <p className="text-gray-600">
            Bienvenido al panel de administración de Axotl Xires
          </p>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {generarEstadisticas().map((estadistica, index) => (
            <TarjetaEstadistica key={index} estadistica={estadistica} />
          ))}
        </div>

        {/* Continuará con más secciones... */}
      </div>
    </ProtectedRoute>
  );
}
