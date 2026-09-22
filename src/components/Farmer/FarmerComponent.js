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

const mockFarmers = [
  {
    id: 'FARM-001',
    name: 'John Doe',
    location: 'Kampala',
    contact: '0789 123 456',
    farmSize: '10 acres',
    cropType: 'Maize',
    status: 'Active'
  },
  {
    id: 'FARM-002',
    name: 'Jane Smith',
    location: 'Mbarara',
    contact: '0756 987 654',
    farmSize: '5 acres',
    cropType: 'Coffee',
    status: 'Inactive'
  },
  {
    id: 'FARM-003',
    name: 'Michael Johnson',
    location: 'Gulu',
    contact: '0772 555 333',
    farmSize: '20 acres',
    cropType: 'Beans',
    status: 'Active'
  }
];

const FarmersComponent = () => {
  const [loading, setLoading] = useState(true);
  const [farmers, setFarmers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchFarmers = () => {
      setLoading(true);
      setTimeout(() => {
        setFarmers(mockFarmers);
        setLoading(false);
      }, 800);
    };
    fetchFarmers();
  }, []);

  const filteredFarmers = farmers.filter(farmer =>
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    return status === 'Active' ? 'success' : 'warning';
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
        <CardHeader title="Farmers List" action={<MoreVertIcon />} />
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <TextField
              placeholder="Search farmers"
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
          ) : filteredFarmers.length > 0 ? (
            <>
              <TableContainer component={Paper} sx={{ boxShadow: 'none', mb: 2 }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Farmer ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Farm Size</TableCell>
                      <TableCell>Crop Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredFarmers.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((farmer) => (
                      <TableRow key={farmer.id} hover>
                        <TableCell>{farmer.id}</TableCell>
                        <TableCell>{farmer.name}</TableCell>
                        <TableCell>{farmer.location}</TableCell>
                        <TableCell>{farmer.contact}</TableCell>
                        <TableCell>{farmer.farmSize}</TableCell>
                        <TableCell>{farmer.cropType}</TableCell>
                        <TableCell>
                          <Chip label={farmer.status} color={getStatusColor(farmer.status)} size="small" />
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
                  count={Math.ceil(filteredFarmers.length / rowsPerPage)}
                  page={page}
                  onChange={handleChangePage}
                  color="primary"
                />
              </Box>
            </>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No farmers found. Try adjusting your search criteria.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default FarmersComponent;
