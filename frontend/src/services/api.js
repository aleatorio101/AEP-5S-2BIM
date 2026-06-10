const BASE_URL = 'http://localhost:8080/api';

function getToken() {
  return localStorage.getItem('edualerta_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    let errorMessage = `Erro ${res.status}`;
    try {
      const data = await res.json();
      errorMessage = data.message || data.erro || errorMessage;
    } catch { }
    throw new Error(errorMessage);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export const authService = {
  login: (email, senha) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, senha }) }),
  register: (dados) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(dados) }),
};

export const usuarioService = {
  me: () => request('/usuarios/me'),
  atualizarMe: (dados) =>
    request('/usuarios/me', { method: 'PUT', body: JSON.stringify(dados) }),
};

export default request;

export const chamadoService = {
  abrir: (dados) => 
    request('/chamados', { method: 'POST', body: JSON.stringify(dados) }),
  meus: (filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.page !== undefined) params.append('page', filtros.page);
    if (filtros.size !== undefined) params.append('size', filtros.size);
    if (filtros.status) params.append('status', filtros.status);
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request(`/chamados/meus${queryString}`);
  }
};

export const adminService = {
  getEstatisticas: () => request('/admin/estatisticas'),
  listarTodos: (filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.page !== undefined) params.append('page', filtros.page);
    if (filtros.size !== undefined) params.append('size', filtros.size);
    if (filtros.status) params.append('status', filtros.status);
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request(`/admin/chamados${queryString}`);
  }
};