import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/services/api', () => ({
  getComplaints: jest.fn().mockResolvedValue([]),
  getIncidents: jest.fn().mockResolvedValue([]),
  getDashboardOverview: jest.fn().mockResolvedValue(null),
}));

test('renders the dashboard shell with navigation', async () => {
  render(<App />);

  expect(await screen.findByText(/dashboard overview/i)).toBeInTheDocument();
  expect(screen.getAllByText(/ctdru portal/i).length).toBeGreaterThan(0);
  expect(screen.getAllByRole('link', { name: 'Disputes & Claims' }).length).toBeGreaterThan(0);
  expect(screen.getAllByRole('link', { name: 'Audit & Security Logs' }).length).toBeGreaterThan(0);
});
