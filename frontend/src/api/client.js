const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Manejo de errores visible: siempre lanzamos un mensaje legible para el usuario
    throw new Error(data.error || 'Ocurrió un error inesperado.');
  }

  return data;
}

export const api = {
  registrarFundacion: (body) => request('/auth/registro/fundacion', { method: 'POST', body }),
  registrarAdoptante: (body) => request('/auth/registro/adoptante', { method: 'POST', body }),
  login: (body) => request('/auth/login', { method: 'POST', body }),

  buscarAnimales: (params = {}) => {
    const query = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
    return request(`/animales${query ? `?${query}` : ''}`);
  },
  detalleAnimal: (id) => request(`/animales/${id}`),
  registrarAnimal: (body, token) => request('/animales', { method: 'POST', body, token }),

  crearSolicitud: (body, token) => request('/solicitudes', { method: 'POST', body, token }),
  misSolicitudes: (token) => request('/solicitudes', { token }),
  cambiarEstadoSolicitud: (id, estado, token) =>
    request(`/solicitudes/${id}/estado`, { method: 'PUT', body: { estado }, token }),
};
