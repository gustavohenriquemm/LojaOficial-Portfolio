// ================================================
// CONFIGURAÇÃO DO FRONTEND
// ================================================

// Configure aqui as URLs da sua aplicação

// Configuração global de endpoints para o frontend
// Sempre usa URLs absolutas em produção

const CONFIG = {
  API: {
    production: 'https://lojaoficial-2.onrender.com/api/products',
    development: 'http://localhost:3000/api/products'
  },
  MERCADOPAGO: {
    publicKey: ''
  },
  SETTINGS: {
    productsPerPage: 12,
    searchMinChars: 2,
    searchDebounce: 300,
    cartUpdateInterval: 5000
  }
};

const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';

window.BACKEND_URL = isDevelopment ? 'http://localhost:3000' : 'https://lojaoficial-3.onrender.com';
window.API_URL = isDevelopment ? CONFIG.API.development : CONFIG.API.production;
window.APP_CONFIG = {
  ...CONFIG,
  currentEnv: isDevelopment ? 'development' : 'production',
  apiUrl: window.API_URL
};

console.log('Configuração de endpoints:', {
  BACKEND_URL: window.BACKEND_URL,
  API_URL: window.API_URL,
  ambiente: window.APP_CONFIG.currentEnv
});
