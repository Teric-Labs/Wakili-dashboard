import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Homepage from './Homepage';
import { getComplaints, getIncidents, getDashboardOverview } from '../services/api';

// Homepage renders a <Link> (react-router-dom), so it needs router context to mount at all.
jest.mock('../services/api', () => ({
  getComplaints: jest.fn(),
  getIncidents: jest.fn(),
  getDashboardOverview: jest.fn(),
}));

const renderHomepage = () => render(<Homepage />, { wrapper: MemoryRouter });

describe('Homepage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows a loading indicator before data arrives', () => {
    getComplaints.mockReturnValue(new Promise(() => {}));
    getIncidents.mockReturnValue(new Promise(() => {}));
    getDashboardOverview.mockReturnValue(new Promise(() => {}));

    // The "Live Case Status Overview" card always renders three determinate
    // LinearProgress bars regardless of loading state, so there are multiple
    // role="progressbar" elements on screen - the top loading bar is the
    // indeterminate one, found by its MUI variant class rather than role alone.
    const { container } = renderHomepage();

    expect(container.querySelector('.MuiLinearProgress-indeterminate')).toBeInTheDocument();
  });

  it('renders live totals and recent disputes once data resolves', async () => {
    getComplaints.mockResolvedValue([
      {
        id: 'c1',
        contact_details: '+256772345678',
        company_name: 'Airtel Money',
        issue_type: 'failed_withdrawal',
        transaction_id: 'AM250912.4471.B78821',
        status: 'received',
        created_at: '2026-09-12T10:00:00Z',
      },
    ]);
    getIncidents.mockResolvedValue([
      { id: 'i1', contact_details: '+256700000000', company_name: 'MTN Mobile Money', status: 'resolved' },
    ]);
    getDashboardOverview.mockResolvedValue({ monthly_trends: [{ month: 'Jan', disputes: 5 }] });

    renderHomepage();

    expect(await screen.findByText('Airtel Money')).toBeInTheDocument();
    expect(screen.getByText('MTN Mobile Money')).toBeInTheDocument();
    expect(screen.getByText('AM250912.4471.B78821')).toBeInTheDocument();
    // 2 total cases (1 complaint + 1 incident), 1 resolved
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('stops loading and shows the empty state when the API calls fail', async () => {
    getComplaints.mockRejectedValue(new Error('network error'));
    getIncidents.mockRejectedValue(new Error('network error'));
    getDashboardOverview.mockRejectedValue(new Error('network error'));

    const { container } = renderHomepage();

    await waitForElementToBeRemoved(() => container.querySelector('.MuiLinearProgress-indeterminate'));
    expect(screen.getByText('Operations overview')).toBeInTheDocument();
    expect(screen.getByText(/no complaints or incidents registered/i)).toBeInTheDocument();
  });
});
