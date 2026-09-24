import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'https://wakilibot-main-tum2.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Dashboard Telemetry & Analytics ---
export const getDashboardOverview = async () => {
  const response = await api.get('/dashboard/overview');
  return response.data;
};

export const getCaseTypeAnalytics = async () => {
  const response = await api.get('/complaints/analytics/case-types');
  return response.data;
};

export const getFintechBreakdown = async () => {
  const response = await api.get('/complaints/analytics/fintech-breakdown');
  return response.data;
};

// --- Intake Channels Endpoints ---
export const getChannelsOverview = async () => {
  const response = await api.get('/channels/overview');
  return response.data;
};

export const getUssdLogs = async () => {
  const response = await api.get('/channels/ussd/logs');
  return response.data;
};

export const getSmsLogs = async () => {
  const response = await api.get('/channels/sms/logs');
  return response.data;
};

export const getIvrLogs = async () => {
  const response = await api.get('/channels/ivr/logs');
  return response.data;
};

// --- Wakilibot AI Insights Endpoints ---
export const getAiAgentOverview = async () => {
  const response = await api.get('/ai-agent/overview');
  return response.data;
};

export const getAiAgentIntentPrecision = async () => {
  const response = await api.get('/ai-agent/intent-precision');
  return response.data;
};

export const getAiAgentLanguages = async () => {
  const response = await api.get('/ai-agent/languages');
  return response.data;
};

export const getAiAgentSessions = async () => {
  const response = await api.get('/ai-agent/sessions');
  return response.data;
};

// --- Audit & Security Logs Endpoints ---
export const getAuditLogs = async () => {
  const response = await api.get('/audit/logs');
  return response.data;
};

export const getAuditOfficers = async () => {
  const response = await api.get('/audit/officers');
  return response.data;
};

export const getAuditStats = async () => {
  const response = await api.get('/audit/stats');
  return response.data;
};

// --- Complaints Endpoints ---
export const getComplaints = async (params = {}) => {
  const { status, company_name, page = 1, page_size = 50 } = params;
  let url = `/complaints?page=${page}&page_size=${page_size}`;
  if (status) url += `&status=${status}`;
  if (company_name) url += `&company_name=${encodeURIComponent(company_name)}`;
  const response = await api.get(url);
  return response.data;
};

export const createComplaint = async (data) => {
  const response = await api.post('/complaints', data);
  return response.data;
};

export const getComplaintStatus = async (complaintId) => {
  const response = await api.get(`/complaints/${complaintId}/status`);
  return response.data;
};

export const updateComplaint = async (complaintId, data) => {
  const response = await api.put(`/complaints/${complaintId}`, data);
  return response.data;
};

// --- Incidents Endpoints ---
export const getIncidents = async (params = {}) => {
  const { status, product_service, page = 1, page_size = 50 } = params;
  let url = `/incidents?page=${page}&page_size=${page_size}`;
  if (status) url += `&status=${status}`;
  if (product_service) url += `&product_service=${encodeURIComponent(product_service)}`;
  const response = await api.get(url);
  return response.data;
};

export const createIncident = async (data) => {
  const response = await api.post('/incidents', data);
  return response.data;
};

export const getIncidentStatus = async (incidentId) => {
  const response = await api.get(`/incidents/${incidentId}/status`);
  return response.data;
};

export const updateIncident = async (incidentId, data) => {
  const response = await api.put(`/incidents/${incidentId}`, data);
  return response.data;
};

// --- Documents Management Endpoints ---
export const getDocuments = async (params = {}) => {
  const { page = 1, page_size = 20, category, search, sort_by = 'upload_date', sort_order = 'desc' } = params;
  let url = `/documents?page=${page}&page_size=${page_size}&sort_by=${sort_by}&sort_order=${sort_order}`;
  if (category && category !== 'all') url += `&category=${category}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  const response = await api.get(url);
  return response.data;
};

export const getDocumentById = async (documentId) => {
  const response = await api.get(`/documents/${documentId}`);
  return response.data;
};

export const uploadDocument = async (formData) => {
  const response = await api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateDocument = async (documentId, data) => {
  const response = await api.put(`/documents/${documentId}`, data);
  return response.data;
};

export const deleteDocument = async (documentId) => {
  const response = await api.delete(`/documents/${documentId}`);
  return response.data;
};

export const getDocumentStats = async () => {
  const response = await api.get('/documents/stats/overview');
  return response.data;
};

export const downloadDocument = (documentId) => {
  return `${API_URL}/documents/download/${documentId}`;
};

// --- Authentication & User Endpoints ---
export const registerUser = async (data) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const getUserProfile = async (userId) => {
  const response = await api.get(`/auth/user/${userId}`);
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await api.post('/auth/reset-password', data);
  return response.data;
};

// Error Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

export default api;