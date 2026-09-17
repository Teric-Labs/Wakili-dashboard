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
  Search as SearchIcon,
  FilterList as FilterListIcon 
} from '@mui/icons-material';
import { format } from 'date-fns';
import { getSellOrders, updateSellOrderStatus } from '../services/api';

const PurchasesComponent = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [sellOrders, setSellOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSellOrders();
  }, []);

  const fetchSellOrders = async () => {
    setLoading(true);
    try {
      const data = await getSellOrders();
      setSellOrders(data);
      setError(null);
    } catch (err) {
      setError("Failed to load sell orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'done': return 'success';
      case 'review': return 'info';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      if (dateString.seconds) {
        return format(new Date(dateString.seconds * 1000), 'MMM dd, yyyy');
      }
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateSellOrderStatus(orderId, newStatus);
      setSellOrders(sellOrders.map(order =>
        order.order_id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ boxShadow: 3 }}>
        <CardHeader title="Sell Orders" />
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
          ) : sellOrders.length > 0 ? (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Commodity</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Unit</TableCell>
                      <TableCell>Sender</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Created At</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sellOrders.slice((page-1)*rowsPerPage, page*rowsPerPage).map(order => (
                      <TableRow key={order.order_id}>
                        <TableCell>{order.order_id}</TableCell>
                        <TableCell>{order.commodity_name}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>{order.unit}</TableCell>
                        <TableCell>{order.sender}</TableCell>
                        <TableCell>{order.location}</TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                            size="small"
                          >
                            {['pending', 'done', 'review', 'rejected'].map((status) => (
                              <MenuItem key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell>{formatDate(order.created_at)}</TableCell>
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
                count={Math.ceil(sellOrders.length / rowsPerPage)}
                page={page}
                onChange={handleChangePage}
                color="primary"
                sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
              />
            </>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
              No sell orders found.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default PurchasesComponent;
