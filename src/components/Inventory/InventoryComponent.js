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
  Pagination
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

const mockInventory = [
  {
    id: 'INV-001',
    name: 'Fertilizer',
    quantity: 150,
    unit: 'kg',
    supplier: 'Agro Supplies Ltd.',
    dateAdded: new Date(2025, 2, 10),
    status: 'Available'
  },
  {
    id: 'INV-002',
    name: 'Pesticide',
    quantity: 50,
    unit: 'L',
    supplier: 'GreenChem',
    dateAdded: new Date(2025, 2, 12),
    status: 'Low Stock'
  },
  {
    id: 'INV-003',
    name: 'Seeds (Maize)',
    quantity: 200,
    unit: 'kg',
    supplier: 'SeedCo',
    dateAdded: new Date(2025, 2, 15),
    status: 'Available'
  }
];

const InventoryComponent = () => {
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchInventory = () => {
      setLoading(true);
      setTimeout(() => {
        setInventory(mockInventory);
        setLoading(false);
      }, 800);
    };
    fetchInventory();
  }, []);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'success';
      case 'Low Stock': return 'warning';
      default: return 'default';
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardHeader
          title="Farm Inputs Inventory"
          action={<MoreVertIcon />}
        />
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <TextField
              placeholder="Search inventory"
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
              sx={{ width: 300 }}
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
          ) : filteredInventory.length > 0 ? (
            <>
              <TableContainer component={Paper} sx={{ boxShadow: 'none', mb: 2 }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Supplier</TableCell>
                      <TableCell>Date Added</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredInventory.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{`${item.quantity} ${item.unit}`}</TableCell>
                        <TableCell>{item.supplier}</TableCell>
                        <TableCell>{format(item.dateAdded, 'MMM dd, yyyy')}</TableCell>
                        <TableCell>
                          <Chip label={item.status} color={getStatusColor(item.status)} size="small" />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="View details">
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
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  count={Math.ceil(filteredInventory.length / rowsPerPage)}
                  page={page}
                  onChange={handleChangePage}
                  color="primary"
                />
              </Box>
            </>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No inventory items found. Try adjusting your search criteria.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default InventoryComponent;
