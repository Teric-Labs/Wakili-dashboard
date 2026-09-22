import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/services/api', () => ({
  getDashboardStats: jest.fn().mockResolvedValue({}),
  getRecentOrders: jest.fn().mockResolvedValue({}),
}));

test('renders the dashboard shell with navigation', async () => {
  render(<App />);

  expect(await screen.findByText(/dashboard overview/i)).toBeInTheDocument();
  expect(screen.getByText(/agritech management system/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /orders/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument();
});
