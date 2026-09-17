import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip, 
  IconButton, 
  Tooltip, 
  TextField, 
  InputAdornment,
  CircularProgress,
  Pagination,
  Select,
  MenuItem
} from '@mui/material';
import { 
  Visibility as VisibilityIcon, 
  MoreVert as MoreVertIcon, 
  Search as SearchIcon,
  FilterList as FilterListIcon 
} from '@mui/icons-material';
import { getAgriculturalInputOrders, updateAgriculturalInputOrderStatus } from '../services/api';

const OrdersComponent = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAgriculturalInputOrders();
      setOrders(data);
    } catch (error) {
      setError('Failed to load orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => 
    order.order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.sender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.commodity_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'completed': return 'primary';
      default: return 'default';
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleSearchChange = (event) => setSearchTerm(event.target.value);
  
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateAgriculturalInputOrderStatus(orderId, newStatus);
      setOrders(orders.map(order =>
        order.order_id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ boxShadow: 3 }}>
        <CardHeader title="Agricultural Input Orders" />
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <TextField
              placeholder="Search orders"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Tooltip title="Filter options">
              <IconButton>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography variant="body1" color="error" sx={{ textAlign: 'center' }}>
              {error}
            </Typography>
          ) : filteredOrders.length > 0 ? (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Commodity</TableCell>
                      <TableCell>Sender</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Price/Unit</TableCell>
                      <TableCell>Total Price</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredOrders.slice((page-1)*rowsPerPage, page*rowsPerPage).map(order => (
                      <TableRow key={order.order_id}>
                        <TableCell>{order.order_id}</TableCell>
                        <TableCell>{order.commodity_name}</TableCell>
                        <TableCell>{order.sender}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>${order.price_per_unit?.toFixed(2)}</TableCell>
                        <TableCell>${order.total_price?.toFixed(2)}</TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                            size="small"
                          >
                            {['pending', 'approved', 'rejected', 'completed'].map((status) => (
                              <MenuItem key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="View Details">
                            <IconButton size="small">
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Pagination
                count={Math.ceil(filteredOrders.length / rowsPerPage)}
                page={page}
                onChange={handleChangePage}
                color="primary"
                sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
              />
            </>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
              No orders found.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrdersComponent;
