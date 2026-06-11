const BASE_URL = 'http://localhost:8080/api';

function getToken() {
  return localStorage.getItem('edualerta_token');
}

async function request(path, options = {}) {
  const token = getToken();

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
  } else {
    delete headers['Content-Type'];
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    let errorMessage = `Erro ${res.status}`;
    try {
      const data = await res.json();
      errorMessage = data.message || data.erro || data.detail || errorMessage;
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

export const chamadoService = {
  abrirAutenticado: (dados) =>
    request('/chamados', { method: 'POST', body: JSON.stringify(dados) }),

  abrirAnonimo: (dados) =>
    request('/chamados/anonimo', { method: 'POST', body: JSON.stringify(dados) }),

  enviarEvidencia: (protocolo, arquivo) => {
    const formData = new FormData();
    formData.append('arquivo', arquivo);

    return request(`/chamados/${protocolo}/evidencias`, {
      method: 'POST',
      body: formData
    });
  },

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
    if (filtros.categoria) params.append('categoria', filtros.categoria);
    if (filtros.inicio) params.append('inicio', filtros.inicio);
    if (filtros.fim) params.append('fim', filtros.fim);
    if (filtros.busca) params.append('busca', filtros.busca);

    return request(`/admin/chamados?${params.toString()}`);
  },
  
  buscarPorProtocolo: (protocolo) =>
    request(`/admin/chamados/${protocolo}`),

  atualizarStatus: (protocolo, dados) =>
    request(`/admin/chamados/${protocolo}/status`, { method: 'PATCH', body: JSON.stringify(dados) }),

  listarUsuarios: (page = 0, size = 10) => 
    request(`/admin/usuarios?page=${page}&size=${size}`),

  alterarRole: (id, novaRole) => 
    request(`/admin/usuarios/${id}/role`, { 
      method: 'PATCH', 
      body: JSON.stringify({ role: novaRole }) 
    }),

  desativarUsuario: (id) => 
    request(`/admin/usuarios/${id}/desativar`, { 
      method: 'PATCH' 
    }),

  reativarUsuario: (id) => 
    request(`/admin/usuarios/${id}/reativar`, { 
      method: 'PATCH' 
    })
};

export const publicService = {
  listarCategorias: () => request('/categorias'),
  listarStatusEnums: () => request('/enums/status'),
  listarUrgenciasEnums: () => request('/enums/urgencias'),
  listarTiposUsuarioEnums: () => request('/enums/tipos-usuario'),
};


export default request;