import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import Homepage from './Homepage';
import { getDashboardStats, getRecentOrders } from '../services/api';

jest.mock('../services/api', () => ({
  getDashboardStats: jest.fn(),
  getRecentOrders: jest.fn(),
}));

describe('Homepage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows a loading indicator before data arrives', () => {
    getDashboardStats.mockReturnValue(new Promise(() => {}));
    getRecentOrders.mockReturnValue(new Promise(() => {}));

    render(<Homepage />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders stats and recent orders once data resolves', async () => {
    getDashboardStats.mockResolvedValue({
      total_revenue: 5000,
      financial_service_count: 3,
      input_orders_count: 7,
      sell_orders_count: 4,
    });
    getRecentOrders.mockResolvedValue({
      recent_input_orders: [{ order_id: 'IN-1', status: 'pending' }],
      recent_sell_orders: [{ order_id: 'SL-1', status: 'approved' }],
    });

    render(<Homepage />);

    expect(await screen.findByText('$5,000')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('Order ID: IN-1')).toBeInTheDocument();
    expect(screen.getByText('Order ID: SL-1')).toBeInTheDocument();
  });

  it('stops loading and shows defaults when the API calls fail', async () => {
    getDashboardStats.mockRejectedValue(new Error('network error'));
    getRecentOrders.mockRejectedValue(new Error('network error'));

    render(<Homepage />);

    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'));
    expect(screen.getByText('Dashboard Overview')).toBeInTheDocument();
  });
});
