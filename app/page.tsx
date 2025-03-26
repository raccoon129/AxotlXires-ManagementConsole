"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/app/hooks/useAuth";
import { toast } from "react-hot-toast";

export default function Home() {
  const [credenciales, setCredenciales] = useState({
    correo: "",
    contrasena: ""
  });
  const [cargando, setCargando] = useState(false);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const { iniciarSesion } = useAuth();

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Al cambiar los campos, limpiar mensaje de error
    setMensajeError(null);
    setCredenciales(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensajeError(null);
    setCargando(true);

    try {
      // Validaciones básicas en cliente
      if (!credenciales.correo || !credenciales.contrasena) {
        setMensajeError("Todos los campos son obligatorios");
        return;
      };
      
      // Intentar inicio de sesión
      const resultado = await iniciarSesion(credenciales.correo, credenciales.contrasena);
      
      
      if (resultado.status === 'success') {
        toast.success('¡Bienvenido al sistema!');
      } else {
        // Manejar diferentes tipos de errores
        switch (resultado.mensaje) {
          case 'CREDENCIALES_INVALIDAS':
            setMensajeError('Correo o contraseña incorrectos');
            toast.error('Correo o contraseña incorrectos');
            break;
          case 'SIN_PERMISOS':
            setMensajeError('No tienes permisos para acceder al panel administrativo');
            toast.error('No tienes permisos para acceder al panel administrativo');
            break;
          default:
            setMensajeError(`Error: ${resultado.mensaje}`);
            toast.error(`Error al iniciar sesión: ${resultado.mensaje}`);
        }
      }
    } catch (error) {
      // Manejar errores de red o del servidor
      console.error('Error completo:', error);
      
      if (error instanceof Error) {
        const mensajeError = error.message;
        setMensajeError(mensajeError);
        
        if (mensajeError.includes('Failed to fetch')) {
          toast.error('Error de conexión. Por favor, verifica tu conexión a internet');
        } else {
          toast.error(mensajeError);
        }
      } else {
        setMensajeError('Error inesperado al iniciar sesión');
        toast.error('Error inesperado al iniciar sesión');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#612c7d]">
      {/* Sección del background */}
      <div className="w-2/3 relative flex justify-start">
        <div className="h-full w-[800px] relative">
          <Image
            src={`${process.env.NEXT_PUBLIC_ASSETS_URL}/MitadAjoloteBlanco.png`}
            alt="Fondo Ajolote"
            fill
            className="object-contain object-left"
            priority
            sizes="1000px"
          />
        </div>
      </div>

      {/* Sección del formulario */}
      <div className="w-1/3 flex items-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
          <div className="flex flex-col items-center gap-6">
            <Image
              src={`${process.env.NEXT_PUBLIC_ASSETS_URL}/management/IconAxotlXiresAzul.png`}
              alt="Axotl Xires Logo"
              width={200}
              height={200}
              className="object-contain"
            />
            <h1 className="text-2xl font-bold text-gray-800">
              Ingrese sus credenciales
            </h1>

            {/* Mostrar mensaje de error si existe */}
            {mensajeError && (
              <div className="w-full bg-red-50 text-red-600 p-3 rounded-lg border border-red-200 text-sm">
                {mensajeError}
              </div>
            )}

            <form onSubmit={manejarEnvio} className="w-full space-y-4">
              <div>
                <label
                  htmlFor="correo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Correo Electrónico o Xires ID
                </label>
                <input
                  id="correo"
                  type="email"
                  value={credenciales.correo}
                  onChange={manejarCambio}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#612c7d] focus:border-transparent"
                  disabled={cargando}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="contrasena"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Contraseña
                </label>
                <input
                  id="contrasena"
                  type="password"
                  value={credenciales.contrasena}
                  onChange={manejarCambio}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#612c7d] focus:border-transparent"
                  disabled={cargando}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-[#2d567e] text-white py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {cargando ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Iniciando sesión...
                  </span>
                ) : "Iniciar Sesión"}
              </button>
            </form>
          </div>
          <br />
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AutomataSoft Xires 2025 - Todos los derechos reservados
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Versión 0.1
          </label>
        </div>
      </div>
    </div>
  );
}
