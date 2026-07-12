const axios = require('axios');

// Create axios instance with config
const createApiClient = () => {
  const apiClient = axios.create({
    baseURL: process.env.ERP_API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ERP_API_KEY,
      'x-api-secret': process.env.ERP_API_SECRET
    }
  });

  // Request interceptor
  apiClient.interceptors.request.use(
    (config) => {
      console.log(`ERP API Request: ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => {
      console.error('ERP API Request Error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  apiClient.interceptors.response.use(
    (response) => {
      console.log(`ERP API Response: ${response.status} ${response.config.url}`);
      return response;
    },
    (error) => {
      console.error('ERP API Response Error:', error.response?.data || error.message);
      return Promise.reject(error);
    }
  );

  return apiClient;
};

// Fetch all parent categories from ERP
const getParentCategories = async (params = {}) => {
  const apiClient = createApiClient();
  try {
    const response = await apiClient.get('/parent-categories/view-all', { params });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch parent categories: ${error.message}`);
  }
};

// Fetch single parent category by ID
const getParentCategoryById = async (id) => {
  const apiClient = createApiClient();
  try {
    const response = await apiClient.get(`/parent-categories/view-one/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch parent category ${id}: ${error.message}`);
  }
};

// Fetch all categories from ERP
const getCategories = async (params = {}) => {
  const apiClient = createApiClient();
  try {
    const response = await apiClient.get('/categories/view-all', { params });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }
};

// Fetch single category by ID
const getCategoryById = async (id) => {
  const apiClient = createApiClient();
  try {
    const response = await apiClient.get(`/categories/view-one/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch category ${id}: ${error.message}`);
  }
};

// Health check
const healthCheck = async () => {
  const apiClient = createApiClient();
  try {
    const response = await apiClient.get('/health');
    return { status: 'healthy', ...response.data };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
};

module.exports = {
  getParentCategories,
  getParentCategoryById,
  getCategories,
  getCategoryById,
  healthCheck
};
