import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface TokenDecodificado {
  rol: 'administrador' | 'moderador';
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;

  // Si no hay token y no estamos en la página de inicio, redirigir al login
  if (!token && path !== '/') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Si hay token y estamos en la página de inicio
  if (token && path === '/') {
    try {
      const decodificado = jwtDecode(token) as TokenDecodificado;
      
      // Redirigir según el rol
      if (decodificado.rol === 'administrador') {
        return NextResponse.redirect(new URL('/dashboardAdministrador', request.url));
      } else if (decodificado.rol === 'moderador') {
        return NextResponse.redirect(new URL('/dashboardModerador', request.url));
      }
    } catch {
      // Si hay error al decodificar el token, eliminarlo y redirigir al login
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Verificar acceso a rutas protegidas
  if (token && (path.startsWith('/dashboardAdministrador') || path.startsWith('/admin'))) {
    try {
      const decodificado = jwtDecode(token) as TokenDecodificado;
      if (decodificado.rol !== 'administrador') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboardAdministrador/:path*', '/dashboardModerador/:path*', '/admin/:path*', '/moderador/:path*']
};