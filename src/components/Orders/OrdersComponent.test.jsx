import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrdersComponent from './OrdersComponent';
import { getAgriculturalInputOrders, updateAgriculturalInputOrderStatus } from '../services/api';

jest.mock('../services/api', () => ({
  getAgriculturalInputOrders: jest.fn(),
  updateAgriculturalInputOrderStatus: jest.fn(),
}));

const sampleOrders = [
  {
    order_id: 'ORD-1',
    commodity_name: 'Maize',
    sender: 'Alice',
    quantity: 10,
    price_per_unit: 2.5,
    total_price: 25,
    status: 'pending',
  },
  {
    order_id: 'ORD-2',
    commodity_name: 'Beans',
    sender: 'Bob',
    quantity: 5,
    price_per_unit: 3,
    total_price: 15,
    status: 'approved',
  },
];

describe('OrdersComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows a loading indicator, then renders fetched orders', async () => {
    getAgriculturalInputOrders.mockResolvedValue(sampleOrders);

    render(<OrdersComponent />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(await screen.findByText('ORD-1')).toBeInTheDocument();
    expect(screen.getByText('ORD-2')).toBeInTheDocument();
  });

  it('shows an error message when the fetch fails', async () => {
    getAgriculturalInputOrders.mockRejectedValue(new Error('boom'));

    render(<OrdersComponent />);

    expect(await screen.findByText(/failed to load orders/i)).toBeInTheDocument();
  });

  it('filters orders by the search term', async () => {
    getAgriculturalInputOrders.mockResolvedValue(sampleOrders);
    render(<OrdersComponent />);
    await screen.findByText('ORD-1');

    userEvent.type(screen.getByPlaceholderText(/search orders/i), 'Beans');

    await waitFor(() => expect(screen.queryByText('ORD-1')).not.toBeInTheDocument());
    expect(screen.getByText('ORD-2')).toBeInTheDocument();
  });

  it('updates an order status via the select and calls the API', async () => {
    getAgriculturalInputOrders.mockResolvedValue(sampleOrders);
    updateAgriculturalInputOrderStatus.mockResolvedValue({ status: 'approved' });
    render(<OrdersComponent />);
    await screen.findByText('ORD-1');

    const row = screen.getByText('ORD-1').closest('tr');
    const statusSelect = within(row).getByRole('combobox');
    userEvent.click(statusSelect);
    const option = await screen.findByRole('option', { name: 'Approved' });
    userEvent.click(option);

    await waitFor(() =>
      expect(updateAgriculturalInputOrderStatus).toHaveBeenCalledWith('ORD-1', 'approved')
    );
  });
});
