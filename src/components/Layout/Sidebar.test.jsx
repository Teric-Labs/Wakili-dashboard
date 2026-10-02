import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './Sidebar';

// The mobile drawer is rendered with ModalProps={{ keepMounted: true }}, so its
// content stays in the DOM alongside the permanent desktop drawer - every nav
// link legitimately appears twice. Tests use getAllByRole/getAllByText
// throughout rather than assume a single match.
const renderSidebar = (initialRoute = '/') =>
  render(<Sidebar />, { wrapper: ({ children }) => <MemoryRouter initialEntries={[initialRoute]}>{children}</MemoryRouter> });

describe('Sidebar', () => {
  it('renders the CTDRU Portal brand and all six main-menu links', () => {
    renderSidebar();

    expect(screen.getAllByText('CTDRU PORTAL').length).toBeGreaterThan(0);

    const expectedLinks = [
      ['Dashboard', '/'],
      ['Disputes & Claims', '/complaints'],
      ['Intake Channels', '/channels'],
      ['Wakilibot Insights', '/ai-agent'],
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
