import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex bg-[#612c7d]">
      {/* Sección del background - ocupa 2/3 */}
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

      {/* Sección del formulario - ocupa 1/3 */}
      <div className="w-1/3 flex items-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
          <div className="flex flex-col items-center gap-6">
            <br />
            <Image
              src={`${process.env.NEXT_PUBLIC_ASSETS_URL}/logoMorado2.png`}
              alt="Axotl Xires Logo"
              width={300}
              height={300}
              className="object-contain"
            />
            <h1 className="text-2xl font-bold text-gray-800">
              Ingrese sus credenciales
            </h1>

            <form className="w-full space-y-4">
              <div>
                <label
                  htmlFor="correo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Correo Electrónico
                </label>
                <input
                  id="correo"
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#612c7d] focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#612c7d] focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#612c7d] text-white py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Iniciar Sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
