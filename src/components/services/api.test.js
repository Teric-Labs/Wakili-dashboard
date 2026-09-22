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
  getDashboardStats,
  getFarmInputs,
  createFarmInput,
  getAgriculturalInputOrders,
  updateAgriculturalInputOrderStatus,
  getSellOrders,
  getFinancialServices,
  getMarketInformation,
} from './api';

const mockAxiosInstance = axios.create();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('dashboard endpoints', () => {
  it('getDashboardStats calls GET /dashboard/stats and returns the data', async () => {
    mockAxiosInstance.get.mockResolvedValueOnce({ data: { total_revenue: 1000 } });

    const result = await getDashboardStats();

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/dashboard/stats');
    expect(result).toEqual({ total_revenue: 1000 });
  });
});

describe('farm inputs endpoints', () => {
  it('getFarmInputs calls GET /farm-inputs with params', async () => {
    mockAxiosInstance.get.mockResolvedValueOnce({ data: [{ id: 1 }] });

    const result = await getFarmInputs({ category: 'seeds' });

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/farm-inputs', { params: { category: 'seeds' } });
    expect(result).toEqual([{ id: 1 }]);
  });

  it('createFarmInput calls POST /farm-inputs with the payload', async () => {
    const payload = { name: 'Fertilizer' };
    mockAxiosInstance.post.mockResolvedValueOnce({ data: { id: 1, ...payload } });

    const result = await createFarmInput(payload);

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/farm-inputs', payload);
    expect(result).toEqual({ id: 1, ...payload });
  });
});

describe('agricultural input orders endpoints', () => {
  it('getAgriculturalInputOrders calls GET /agricultural-input-orders', async () => {
    mockAxiosInstance.get.mockResolvedValueOnce({ data: [] });

    const result = await getAgriculturalInputOrders();

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/agricultural-input-orders', { params: {} });
    expect(result).toEqual([]);
  });

  it('updateAgriculturalInputOrderStatus calls PUT with the new status', async () => {
    mockAxiosInstance.put.mockResolvedValueOnce({ data: { status: 'approved' } });

    const result = await updateAgriculturalInputOrderStatus('ORD1', 'approved');

    expect(mockAxiosInstance.put).toHaveBeenCalledWith(
      '/agricultural-input-orders/ORD1/update-status',
      { status: 'approved' }
    );
    expect(result).toEqual({ status: 'approved' });
  });
});

describe('sell orders endpoints', () => {
  it('getSellOrders calls GET /sell-orders', async () => {
    mockAxiosInstance.get.mockResolvedValueOnce({ data: [] });

    await getSellOrders();

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/sell-orders', { params: {} });
  });
});

describe('financial services endpoints', () => {
  it('getFinancialServices calls GET /financial-services', async () => {
    mockAxiosInstance.get.mockResolvedValueOnce({ data: [] });

    await getFinancialServices();

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/financial-services');
  });
});

describe('market information endpoints', () => {
  it('getMarketInformation calls GET with just the product name when no location is given', async () => {
    mockAxiosInstance.get.mockResolvedValueOnce({ data: {} });

    await getMarketInformation('maize');

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/market-information/maize');
  });

  it('getMarketInformation includes the location query param when given', async () => {
    mockAxiosInstance.get.mockResolvedValueOnce({ data: {} });

    await getMarketInformation('maize', 'kampala');

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/market-information/maize?location=kampala');
  });
});
