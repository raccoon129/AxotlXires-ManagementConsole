"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bell, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { estaAutenticado, usuario, cerrarSesion } = useAuth();

  // Efecto para detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Efecto para cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled ? "bg-white shadow-md" : "bg-white/80 backdrop-blur-lg"
      }`}
    >
      <nav className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Logo y nombre */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center">
              <Image
                src="/axotl-logo.svg"
                alt="Axotl Xires Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <div className="ml-2 flex flex-col">
                <span className="text-lg font-bold text-[#612c7d]">
                  Axotl Xires
                </span>
                <span className="text-xs text-gray-500 -mt-1">
                  Management Console
                </span>
              </div>
            </Link>
            <div className="h-6 w-px bg-gray-200 mx-2" />
            <Link 
              href="https://axotl.org" 
              target="_blank"
              className="text-sm text-gray-500 hover:text-[#612c7d] transition-colors"
            >
              axotl.org
            </Link>
          </div>

          {/* Espacio para breadcrumbs */}
          <div className="flex-1 mx-8">
            {/* Breadcrumbs irán aquí */}
          </div>

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
                    {usuario?.nombre || 'Administrador'}
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