
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api/v1';

interface CustomRequestInit extends RequestInit {
  params?: Record<string, any>;
}

async function request(endpoint: string, options: CustomRequestInit = {}): Promise<any> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  let url = `${BASE_URL}${endpoint}`;
  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const { params, ...fetchOptions } = options;
  const config: RequestInit = {
    ...fetchOptions,
    headers,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw {
      response: {
        data: errorData,
        status: response.status,
      },
      message: errorData.message || 'Something went wrong',
    };
  }

  const data = await response.json();
  return { data };
}

const api = {
  get: (endpoint: string, options?: CustomRequestInit) => 
    request(endpoint, { ...options, method: 'GET' }),
  
  post: (endpoint: string, body?: any, options?: CustomRequestInit) => 
    request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  
  put: (endpoint: string, body?: any, options?: CustomRequestInit) => 
    request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  
  patch: (endpoint: string, body?: any, options?: CustomRequestInit) => 
    request(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  
  delete: (endpoint: string, options?: CustomRequestInit) => 
    request(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
