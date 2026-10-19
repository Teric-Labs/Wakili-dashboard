import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './Sidebar';
import { getEscalations } from '../services/api';

// Sidebar fetches the open-escalations count for its notification badge -
// mock the api module so this test never touches real axios/network (see
// App.test.js for the same pattern).
//
// The resolved value is set in beforeEach, not in the factory below:
// react-scripts' jest config sets resetMocks: true, which clears a mock's
// configured implementation before every test. A .mockResolvedValue() called
// only once here in the factory would be wiped out before the test body
// runs, leaving getEscalations() returning undefined instead of a promise.
jest.mock('../services/api', () => ({
  getEscalations: jest.fn(),
}));

beforeEach(() => {
  getEscalations.mockResolvedValue([]);
});

// The mobile drawer is rendered with ModalProps={{ keepMounted: true }}, so its
// content stays in the DOM alongside the permanent desktop drawer - every nav
// link legitimately appears twice. Tests use getAllByRole/getAllByText
// throughout rather than assume a single match.
const renderSidebar = (initialRoute = '/') =>
  render(<Sidebar />, { wrapper: ({ children }) => <MemoryRouter initialEntries={[initialRoute]}>{children}</MemoryRouter> });

describe('Sidebar', () => {
  it('renders the CTDRU Portal brand and all seven main-menu links', () => {
    renderSidebar();

    expect(screen.getAllByText('CTDRU PORTAL').length).toBeGreaterThan(0);

    const expectedLinks = [
      ['Dashboard', '/'],
      ['Disputes & Claims', '/complaints'],
      ['Intake Channels', '/channels'],
      ['Wakilibot Insights', '/ai-agent'],
      ['Escalations & Compliance', '/escalations'],
      ['Legal & Policy Archive', '/documents'],
      ['Audit & Security Logs', '/audit-logs'],
    ];
    for (const [name, path] of expectedLinks) {
      const links = screen.getAllByRole('link', { name });
      expect(links.length).toBeGreaterThan(0);
      for (const link of links) {
        expect(link).toHaveAttribute('href', path);
      }
    }
  });

  it('marks the nav item matching the current route as selected', () => {
    renderSidebar('/complaints');

    const selectedLinks = screen.getAllByRole('link', { name: 'Disputes & Claims' });
    for (const link of selectedLinks) {
      expect(link.className).toMatch(/Mui-selected/);
    }

    const dashboardLinks = screen.getAllByRole('link', { name: 'Dashboard' });
    for (const link of dashboardLinks) {
      expect(link.className).not.toMatch(/Mui-selected/);
    }
  });
});
