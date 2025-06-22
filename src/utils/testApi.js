import api from './axios';

export const testApiConnection = async () => {
  try {
    console.log('Testing API connection...');
    console.log('Base URL:', api.defaults.baseURL);
    
    const response = await api.get('/health');
    console.log('API Health Check Response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('API Connection Error:', error);
    console.error('Error Details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      }
    });
    return { success: false, error: error.message };
  }
};

export const testProductsEndpoint = async () => {
  try {
    console.log('Testing products endpoint...');
    const response = await api.get('/products');
    console.log('Products Response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Products Endpoint Error:', error);
    return { success: false, error: error.message };
  }
}; 