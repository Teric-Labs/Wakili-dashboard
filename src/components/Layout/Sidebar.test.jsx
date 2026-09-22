import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './Sidebar';

const setWindowWidth = (width) => {
  window.innerWidth = width;
  window.dispatchEvent(new Event('resize'));
};

const renderSidebar = () => render(<Sidebar />, { wrapper: MemoryRouter });

describe('Sidebar', () => {
  const originalInnerWidth = window.innerWidth;

  afterEach(() => {
    setWindowWidth(originalInnerWidth);
  });

  it('renders the app title and nav links', () => {
    setWindowWidth(1024);
    renderSidebar();

    expect(screen.getByText(/agritech management system/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /orders/i })).toHaveAttribute('href', '/orders');
    expect(screen.getByRole('link', { name: /settings/i })).toHaveAttribute('href', '/settings');
  });

  it('starts open (desktop) and switches to closed/mobile mode on a narrow viewport', () => {
    setWindowWidth(1024);
    renderSidebar();

    const openDrawerButton = screen.getByLabelText(/open drawer/i);
    expect(openDrawerButton).not.toBeVisible();

    act(() => {
      setWindowWidth(500);
    });

    expect(openDrawerButton).toBeVisible();
  });

  it('marks the clicked nav item as selected', () => {
    setWindowWidth(1024);
    renderSidebar();

    const ordersLink = screen.getByRole('link', { name: /orders/i });
    userEvent.click(ordersLink);

    expect(ordersLink.className).toMatch(/Mui-selected/);
  });
});
