import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Update this with your backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dashboard endpoints
export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

export const getRecentOrders = async () => {
  const response = await api.get('/dashboard/recent-orders');
  return response.data;
};

// New dashboard endpoints
export const getDashboardTrends = async (period = 'month') => {
  const response = await api.get(`/dashboard/trends?period=${period}`);
  return response.data;
};

export const getDashboardTopProducts = async (limit = 5) => {
  const response = await api.get(`/dashboard/top-products?limit=${limit}`);
  return response.data;
};

export const getDashboardActiveLocations = async (limit = 5) => {
  const response = await api.get(`/dashboard/active-locations?limit=${limit}`);
  return response.data;
};

export const getDashboardPendingActions = async () => {
  const response = await api.get('/dashboard/pending-actions');
  return response.data;
};

// Farm Inputs
export const getFarmInputs = async (params = {}) => {
  const response = await api.get('/farm-inputs', { params });
  return response.data;
};

export const searchFarmInputs = async (query) => {
  const response = await api.get(`/farm-inputs/search?query=${query}`);
  return response.data;
};

export const getFarmInputById = async (id) => {
  const response = await api.get(`/farm-inputs/${id}`);
  return response.data;
};

export const createFarmInput = async (data) => {
  const response = await api.post('/farm-inputs', data);
  return response.data;
};

export const updateFarmInput = async (id, data) => {
  const response = await api.put(`/farm-inputs/${id}`, data);
  return response.data;
};

export const deleteFarmInput = async (id) => {
  const response = await api.delete(`/farm-inputs/${id}`);
  return response.data;
};

export const getFarmInputsCategories = async () => {
  const response = await api.get('/farm-inputs/categories');
  return response.data;
};

// Agricultural Input Orders
export const getAgriculturalInputOrders = async (params = {}) => {
  const response = await api.get('/agricultural-input-orders', { params });
  return response.data;
};

export const createAgriculturalInputOrder = async (data) => {
  const response = await api.post('/agricultural-input-orders', data);
  return response.data;
};

export const verifyAgriculturalInputOrder = async (id) => {
  const response = await api.put(`/agricultural-input-orders/${id}/verify`);
  return response.data;
};

export const cancelAgriculturalInputOrder = async (id) => {
  const response = await api.put(`/agricultural-input-orders-cancel/${id}/cancel`);
  return response.data;
};

export const deleteAgriculturalInputOrder = async (id) => {
  const response = await api.delete(`/agricultural-input-orders/${id}`);
  return response.data;
};

export const checkAgriculturalInputOrderStatus = async (id) => {
  const response = await api.get(`/agricultural-input-orders/${id}/status`);
  return response.data;
};

export const updateAgriculturalInputOrderStatus = async (id, status) => {
  const response = await api.put(`/agricultural-input-orders/${id}/update-status`, { status });
  return response.data;
};

export const getAgriculturalInputOrdersByDate = async (startDate, endDate) => {
  const response = await api.get(`/agricultural-input-orders/by-date?start_date=${startDate}&end_date=${endDate}`);
  return response.data;
};

// Sell Orders
export const getSellOrders = async (params = {}) => {
  const response = await api.get('/sell-orders', { params });
  return response.data;
};

export const createSellOrder = async (data) => {
  const response = await api.post('/sell-orders', data);
  return response.data;
};

export const approveSellOrder = async (id) => {
  const response = await api.put(`/sell-orders/${id}/approve`);
  return response.data;
};

export const deleteSellOrder = async (id) => {
  const response = await api.delete(`/sell-orders/${id}`);
  return response.data;
};

export const updateSellOrderStatus = async (id, status) => {
  const response = await api.put(`/sell-orders/${id}/update-status`, { status });
  return response.data;
};

export const getSellOrdersByDate = async (startDate, endDate) => {
  const response = await api.get(`/sell-orders/by-date?start_date=${startDate}&end_date=${endDate}`);
  return response.data;
};

// Financial Services
export const getFinancialServices = async () => {
  const response = await api.get('/financial-services');
  return response.data;
};

export const applyForFinancialService = async (data) => {
  const response = await api.post('/financial-services/apply', data);
  return response.data;
};

export const getFinancialServiceApplication = async (id) => {
  const response = await api.get(`/financial-services/applications/${id}`);
  return response.data;
};

export const updateFinancialServiceApplicationStatus = async (id, status) => {
  const response = await api.put(`/financial-services/applications/${id}/update-status`, { status });
  return response.data;
};

export const getFinancialServicesByStatus = async (status) => {
  const response = await api.get(`/financial-services?status=${status}`);
  return response.data;
};

// Market Information
export const getMarketInformation = async (productName, location = null) => {
  const url = location 
    ? `/market-information/${productName}?location=${location}`
    : `/market-information/${productName}`;
  const response = await api.get(url);
  return response.data;
};

export const requestMarketInformation = async (data) => {
  const response = await api.post('/market-information/request', data);
  return response.data;
};

// Error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

export default api;