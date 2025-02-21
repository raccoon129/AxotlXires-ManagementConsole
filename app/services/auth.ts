// Función para obtener el token del localStorage
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Función para guardar el token
export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

// Función para eliminar el token
export const removeToken = (): void => {
  localStorage.removeItem('token');
}; 