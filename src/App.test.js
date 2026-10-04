import { render, screen } from '@testing-library/react';
import App from './App';

// getStoredAuth is a plain function, not jest.fn(): a jest.fn() mock here
// mysteriously returns undefined when called via App.js's named-import
// destructuring (the same ESM/CJS interop quirk hit earlier with
// Wakilibot-web's App.test.js) even though it works fine via require().
// Empirically verified fix, not a style choice.
// eslint-disable-next-line no-var
var mockStoredAuth = { access_token: 'test-token', user: { email: 'staff@test.local' } };
jest.mock('./components/services/api', () => ({
  getComplaints: jest.fn().mockResolvedValue([]),
  getIncidents: jest.fn().mockResolvedValue([]),
  getDashboardOverview: jest.fn().mockResolvedValue(null),
  getStoredAuth: () => mockStoredAuth,
  storeAuth: jest.fn(),
  clearStoredAuth: jest.fn(),
}));

test('renders the dashboard shell with navigation for an authenticated session', async () => {
  render(<App />);

  expect(await screen.findByText(/dashboard overview/i)).toBeInTheDocument();
  expect(screen.getAllByText(/ctdru portal/i).length).toBeGreaterThan(0);
  expect(screen.getAllByRole('link', { name: 'Disputes & Claims' }).length).toBeGreaterThan(0);
  expect(screen.getAllByRole('link', { name: 'Audit & Security Logs' }).length).toBeGreaterThan(0);
});

test('shows the staff login gate when there is no stored session', async () => {
  mockStoredAuth = null;

  render(<App />);

  expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  expect(screen.queryByText(/dashboard overview/i)).not.toBeInTheDocument();
});
