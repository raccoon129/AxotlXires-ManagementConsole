"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bell, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { estaAutenticado, nombreUsuario, perfilUsuario, cerrarSesion } =
    useAuth();

  // Efecto para cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <nav className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Logo y nombre */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Image
                src={`${process.env.NEXT_PUBLIC_ASSETS_URL}/logoMorado2.png`}
                alt="Axotl Xires Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="ml-2 text-2xl font-bold text-gray-800">
                Axotl.org &nbsp;
              </span>
              <div className="h-6 w-px bg-gray-200" />
              <div className="ml-3 flex flex-col">
                
                <span className="text-lg font-bold text-[#612c7d]">
                  Axotl Xires
                </span>
                <span className="text-xs text-gray-500 -mt-1">
                  Management Console
                </span>
              </div>
            </div>
            
          </div>

          {/* Espacio para breadcrumbs */}
          <div className="flex-1 mx-8">{/* Breadcrumbs irán aquí */}</div>

          {/* Menú derecho - solo visible si está autenticado */}
          {estaAutenticado && (
            <div className="flex items-center space-x-4">
              {/* Notificaciones */}
              <button className="p-2 hover:bg-gray-100 rounded-full relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
              </button>

              {/* Menú de usuario */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-[#612c7d] flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {nombreUsuario || "Administrador"}
                  </span>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border"
                    >
                      <Link
                        href="/perfil"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Mi Perfil
                      </Link>
                      <button
                        onClick={cerrarSesion}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Cerrar Sesión
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
