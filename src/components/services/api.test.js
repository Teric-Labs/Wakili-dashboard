jest.mock('axios', () => {
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: { response: { use: jest.fn() } },
  };
  return {
    __esModule: true,
    default: { create: jest.fn(() => mockAxiosInstance) },
  };
});

import axios from 'axios';
import {
  getDashboardOverview,
  getComplaints,
  createComplaint,
  getIncidents,
  getDocuments,
  uploadDocument,
  getAiAgentOverview,
  getAuditLogs,
  loginUser,
} from './api';

const mockAxiosInstance = axios.create();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('dashboard telemetry endpoints', () => {
  it('getDashboardOverview calls GET /dashboard/overview and returns the data', async () => {
    mockAxiosInstance.get.mockResolvedValueOnce({ data: { monthly_trends: [] } });

    const result = await getDashboardOverview();

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/dashboard/overview');
    expect(result).toEqual({ monthly_trends: [] });
  });
});

describe('complaints endpoints', () => {
  it('getComplaints defaults to page 1 / page_size 50 with no filters', async () => {
    mockAxiosInstance.get.mockResolvedValueOnce({ data: [] });

    await getComplaints();

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/complaints?page=1&page_size=50');
  });

  it('getComplaints appends status and company_name when provided', async () => {
    mockAxiosInstance.get.mockResolvedValueOnce({ data: [] });

    await getComplaints({ status: 'pending', company_name: 'Airtel Money' });

    const [url] = mockAxiosInstance.get.mock.calls[0];
    expect(url).toContain('&status=pending');
    expect(url).toContain('&company_name=Airtel%20Money');
  });

  it('createComplaint posts the payload to /complaints', async () => {
    const payload = { company: 'MTN Mobile Money', description: 'Unauthorized deduction' };
    mockAxiosInstance.post.mockResolvedValueOnce({ data: { complaint_id: 'c1', ...payload } });

    const result = await createComplaint(payload);

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/complaints', payload);
    expect(result).toEqual({ complaint_id: 'c1', ...payload });
  });
});

describe('incidents endpoints', () => {
  it('getIncidents calls GET /incidents with default pagination', async () => {
    mockAxiosInstance.get.mockResolvedValueOnce({ data: [] });

    await getIncidents();

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/incidents?page=1&page_size=50');
  });
});

describe('documents endpoints', () => {
  it('getDocuments builds the query string with default sort params', async () => {
    mockAxiosInstance.get.mockResolvedValueOnce({ data: { documents: [] } });

    await getDocuments();

    expect(mockAxiosInstance.get).toHaveBeenCalledWith(
      '/documents?page=1&page_size=20&sort_by=upload_date&sort_order=desc'
    );
  });

  it('getDocuments appends category and search when provided', async () => {
    mockAxiosInstance.get.mockResolvedValueOnce({ data: { documents: [] } });

    await getDocuments({ category: 'legislation', search: 'consumer protection' });

    const [url] = mockAxiosInstance.get.mock.calls[0];
    expect(url).toContain('&category=legislation');
    expect(url).toContain('&search=consumer%20protection');
  });

  it('uploadDocument posts multipart form data to /documents/upload', async () => {
    const formData = new FormData();
    mockAxiosInstance.post.mockResolvedValueOnce({ data: { document_id: 'd1' } });

    await uploadDocument(formData);

    expect(mockAxiosInstance.post).toHaveBeenCalledWith(
      '/documents/upload',
      formData,
      expect.objectContaining({ headers: { 'Content-Type': 'multipart/form-data' } })
    );
  });
});

describe('AI insights endpoints', () => {
  it('getAiAgentOverview calls GET /ai-agent/overview', async () => {
    mockAxiosInstance.get.mockResolvedValueOnce({ data: {} });

    await getAiAgentOverview();

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/ai-agent/overview');
  });
});

describe('audit endpoints', () => {
  it('getAuditLogs calls GET /audit/logs', async () => {
    mockAxiosInstance.get.mockResolvedValueOnce({ data: [] });

    await getAuditLogs();

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/audit/logs');
  });
});

describe('auth endpoints', () => {
  it('loginUser posts credentials to /auth/login', async () => {
    const credentials = { email: 'officer@ctdru.ug', password: 'secret' };
    mockAxiosInstance.post.mockResolvedValueOnce({ data: { token: 'abc' } });

    const result = await loginUser(credentials);

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/login', credentials);
    expect(result).toEqual({ token: 'abc' });
  });
});
