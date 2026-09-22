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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { getFinancialServices, updateFinancialServiceApplicationStatus } from '../services/api';

const FinancialServicesComponent = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [financialServices, setFinancialServices] = useState([]);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    fetchFinancialServices();
  }, []);

  const fetchFinancialServices = async () => {
    setLoading(true);
    try {
      const data = await getFinancialServices();
      setFinancialServices(data);
      setError(null);
    } catch (err) {
      setError("Failed to load financial services. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = financialServices.filter(service =>
    service.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'review': return 'info';
      case 'disbursed': return 'primary';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  const handleOpenDialog = (service) => {
    setSelectedService(service);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedService(null);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateFinancialServiceApplicationStatus(id, newStatus);
      setFinancialServices(financialServices.map(service =>
        service.application_id === id ? { ...service, status: newStatus } : service
      ));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ boxShadow: 3 }}>
        <CardHeader 
          title="Financial Services Applications"
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" startIcon={<AddIcon />} size="small">
                New Application
              </Button>
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            </Box>
          }
        />
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <TextField
              placeholder="Search applications"
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
          ) : filteredServices.length > 0 ? (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Application ID</TableCell>
                      <TableCell>Applicant Name</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Amount Requested</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredServices.slice((page-1)*rowsPerPage, page*rowsPerPage).map(service => (
                      <TableRow key={service.application_id}>
                        <TableCell>{service.application_id}</TableCell>
                        <TableCell>{service.applicant_name}</TableCell>
                        <TableCell>{service.reason}</TableCell>
                        <TableCell>{service.location}</TableCell>
                        <TableCell>{service.amount_requested}</TableCell>
                        <TableCell>
                          <Select
                            value={service.status}
                            onChange={(e) => handleStatusChange(service.application_id, e.target.value)}
                            size="small"
                          >
                            {['pending', 'approved', 'review', 'disbursed', 'cancelled'].map((status) => (
                              <MenuItem key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="View Details">
                            <IconButton size="small" onClick={() => handleOpenDialog(service)}>
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
                count={Math.ceil(filteredServices.length / rowsPerPage)}
                page={page}
                onChange={handleChangePage}
                color="primary"
                sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
              />
            </>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
              No financial service applications found.
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Application Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        {selectedService && (
          <>
            <DialogTitle>Application Details</DialogTitle>
            <DialogContent dividers>
              <Typography variant="body1"><strong>Applicant Name:</strong> {selectedService.applicant_name}</Typography>
              <Typography variant="body1"><strong>Contact Details:</strong> {selectedService.contact_details}</Typography>
              <Typography variant="body1"><strong>Reason:</strong> {selectedService.reason}</Typography>
              <Typography variant="body1"><strong>Amount Requested:</strong> {selectedService.amount_requested}</Typography>
              <Chip label={selectedService.status} color={getStatusColor(selectedService.status)} size="small" />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default FinancialServicesComponent;
