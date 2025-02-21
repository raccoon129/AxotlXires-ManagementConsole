"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import NavMenuAdministrador from '../components/administrador/navMenuAdministrador';
import Skeleton from '../components/ui/Skeleton';

// Mapeo de rutas a títulos
const titulosRutas: { [key: string]: string } = {
  '/dashboardAdministrador': 'Inicio',
  '/dashboardAdministrador/usuarios': 'Gestión de Usuarios',
  '/dashboardAdministrador/reportes': 'Reportes',
  '/dashboardAdministrador/estadisticas': 'Estadísticas',
  '/dashboardAdministrador/notificaciones': 'Notificaciones',
  '/dashboardAdministrador/seguridad': 'Seguridad',
  '/dashboardAdministrador/configuracion': 'Configuración'
};

const SkeletonNavMenu = () => (
  <div className="bg-white h-full shadow-lg p-4">
    <Skeleton className="h-8 w-3/4 mb-6" />
    <div className="space-y-4">
      {[...Array(7)].map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  </div>
);

const SkeletonContent = () => (
  <div className="space-y-8">
    <Skeleton className="h-10 w-1/4" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-32" />
      ))}
    </div>
    <Skeleton className="h-64" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(2)].map((_, i) => (
        <Skeleton key={i} className="h-80" />
      ))}
    </div>
  </div>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { estaAutenticado, rol, estaCargando } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Actualizar título de la página
  useEffect(() => {
    const tituloSeccion = titulosRutas[pathname] || 'Dashboard';
    document.title = `${tituloSeccion} - Axotl Xires Management Console`;
  }, [pathname]);

  // Verificar autenticación y rol
  useEffect(() => {
    if (!estaCargando && (!estaAutenticado || rol !== 'administrador')) {
      router.push('/');
    }
  }, [estaAutenticado, rol, estaCargando, router]);

  if (estaCargando) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#612c7d]"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Menú lateral */}
      <aside className="fixed left-0 h-[calc(100vh-4rem)] top-16 w-64">
        {estaCargando ? <SkeletonNavMenu /> : <NavMenuAdministrador />}
      </aside>

      {/* Contenido principal */}
      <main className="ml-64 flex-1 p-8 mt-16">
        {estaCargando ? <SkeletonContent /> : children}
      </main>
    </div>
  );
}
