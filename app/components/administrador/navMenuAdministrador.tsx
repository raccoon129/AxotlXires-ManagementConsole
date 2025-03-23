"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  Settings, 
  FileText, 
  BarChart2, 
  Bell, 
  Shield,
  Home,
  ChevronDown
} from 'lucide-react';

// Interfaz para los items del menú
interface MenuItem {
  id: string;
  titulo: string;
  icono: JSX.Element;
  ruta: string;
  subItems?: MenuItem[];
}

const NavMenuAdministrador = () => {
  const pathname = usePathname();
  const [itemActivo, setItemActivo] = useState('inicio');
  const [menuExpandido, setMenuExpandido] = useState<string[]>([]);

  // Configuración de los items del menú
  const menuItems: MenuItem[] = [
    {
      id: 'inicio',
      titulo: 'Inicio',
      icono: <Home className="w-5 h-5" />,
      ruta: '/dashboardAdministrador'
    },
    {
      id: 'usuarios',
      titulo: 'Gestión de Usuarios',
      icono: <Users className="w-5 h-5" />,
      ruta: '/dashboardAdministrador/usuarios',
      subItems: [
        {
          id: 'lista-usuarios',
          titulo: 'Lista de Usuarios',
          icono: <Users className="w-4 h-4" />,
          ruta: '/dashboardAdministrador/usuarios/lista'
        },
        {
          id: 'roles',
          titulo: 'Roles y Permisos',
          icono: <Shield className="w-4 h-4" />,
          ruta: '/dashboardAdministrador/usuarios/roles'
        }
      ]
    },
    {
      id: 'reportes',
      titulo: 'Reportes',
      icono: <FileText className="w-5 h-5" />,
      ruta: '/dashboardAdministrador/reportes'
    },
    {
      id: 'estadisticas',
      titulo: 'Estadísticas',
      icono: <BarChart2 className="w-5 h-5" />,
      ruta: '/dashboardAdministrador/estadisticas'
    },
    {
      id: 'notificaciones',
      titulo: 'Notificaciones',
      icono: <Bell className="w-5 h-5" />,
      ruta: '/dashboardAdministrador/notificaciones'
    },
    {
      id: 'seguridad',
      titulo: 'Seguridad',
      icono: <Shield className="w-5 h-5" />,
      ruta: '/dashboardAdministrador/seguridad'
    },
    {
      id: 'configuracion',
      titulo: 'Configuración',
      icono: <Settings className="w-5 h-5" />,
      ruta: '/dashboardAdministrador/configuracion'
    }
  ];

  // Actualizar item activo basado en la ruta
  useEffect(() => {
    const rutaActual = pathname;
    const itemEncontrado = menuItems.find(item => 
      rutaActual === item.ruta || 
      item.subItems?.some(subItem => rutaActual === subItem.ruta)
    );
    if (itemEncontrado) {
      setItemActivo(itemEncontrado.id);
    }
  }, [pathname]);

  // Manejar expansión de submenús
  const toggleSubmenu = (itemId: string) => {
    setMenuExpandido(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <nav className="bg-white h-full shadow-lg overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-bold text-[#612c7d] mb-6">Administrador</h2>
        <div className="space-y-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              <Link
                href={item.ruta}
                onClick={() => item.subItems && toggleSubmenu(item.id)}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-lg
                  transition-colors duration-200
                  ${itemActivo === item.id 
                    ? 'bg-[#612c7d] text-white' 
                    : 'text-gray-600 hover:bg-gray-100'}
                `}
              >
                <div className="flex items-center space-x-3">
                  {item.icono}
                  <span>{item.titulo}</span>
                </div>
                {item.subItems && (
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform ${
                      menuExpandido.includes(item.id) ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </Link>
              
              {/* Submenú */}
              {item.subItems && menuExpandido.includes(item.id) && (
                <div className="ml-4 mt-2 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.id}
                      href={subItem.ruta}
                      className={`
                        flex items-center space-x-3 px-4 py-2 rounded-lg text-sm
                        ${pathname === subItem.ruta
                          ? 'bg-[#2d567e] text-white'
                          : 'text-gray-600 hover:bg-gray-100'}
                      `}
                    >
                      {subItem.icono}
                      <span>{subItem.titulo}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavMenuAdministrador;
