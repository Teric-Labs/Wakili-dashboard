import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Stack,
  Drawer,
  Divider,
  IconButton,
  Paper,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import Sidebar from '../Layout/Sidebar';
import { createIncident, updateIncident, getIncidents } from '../services/api';

const IncidentsPage = () => {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    product_service: 'MTN Mobile Money',
    incident_description: '',
    transaction_id: ''
  });

  const [incidents, setIncidents] = useState([]);

  React.useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const res = await getIncidents();
      if (Array.isArray(res)) {
        setIncidents(res);
      }
    } catch (err) {
      console.error("Error fetching incidents:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async () => {
    try {
      const res = await createIncident(formData);
      setIncidents([res, ...incidents]);
      setOpenCreate(false);
      setFormData({ product_service: 'MTN Mobile Money', incident_description: '', transaction_id: '' });
    } catch (err) {
      alert("Error reporting incident: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedIncident) return;
    try {
      await updateIncident(selectedIncident.incident_id, { status: newStatus });
      setIncidents(incidents.map(i => 
        i.incident_id === selectedIncident.incident_id ? { ...i, status: newStatus } : i
      ));
      setSelectedIncident({ ...selectedIncident, status: newStatus });
    } catch (err) {
      alert("Error updating incident status: " + (err.response?.data?.detail || err.message));
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'reported': return 'warning';
      case 'investigating': return 'error';
      case 'resolved': return 'success';
      case 'canceled': return 'default';
      default: return 'default';
    }
  };

  const filteredIncidents = incidents.filter(i => {
    const matchesSearch = i.product_service?.toLowerCase().includes(search.toLowerCase()) ||
      i.transaction_id?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || i.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight="900" sx={{ letterSpacing: '-0.03em' }}>
              Fraud & Security Desk
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              Monitor high-priority security breaches, SIM swap fraud, and payment anomalies.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="error"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreate(true)}
            sx={{ borderRadius: 3, px: 3, fontWeight: 'bold', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)' }}
          >
            Report Security Incident
          </Button>
        </Box>

        <Card sx={{ p: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }} justifyContent="space-between">
            <TextField
              size="small"
              placeholder="Search by product or transaction ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} /> }}
              sx={{ width: { xs: '100%', sm: 360 } }}
            />
            <Stack direction="row" spacing={1}>
              {['all', 'reported', 'investigating', 'resolved', 'canceled'].map((st) => (
                <Chip
                  key={st}
                  label={st.toUpperCase()}
                  clickable
                  onClick={() => setFilterStatus(st)}
                  color={filterStatus === st ? 'error' : 'default'}
                  sx={{ fontWeight: 700, borderRadius: 2 }}
                />
              ))}
            </Stack>
          </Stack>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Incident Reference</TableCell>
                  <TableCell>Product / Service</TableCell>
                  <TableCell>Description Summary</TableCell>
                  <TableCell>Transaction ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredIncidents.map((i) => (
                  <TableRow 
                    key={i.incident_id} 
                    hover 
                    onClick={() => setSelectedIncident(i)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 700 }}>{i.incident_id}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{i.product_service}</TableCell>
                    <TableCell>{i.incident_description}</TableCell>
                    <TableCell>{i.transaction_id || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip label={i.status} size="small" color={getStatusColor(i.status)} sx={{ fontWeight: 700, textTransform: 'uppercase' }} />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="outlined" color="error" sx={{ borderRadius: 2 }}>Inspect</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Incident Inspection Drawer */}
        <Drawer
          anchor="right"
          open={Boolean(selectedIncident)}
          onClose={() => setSelectedIncident(null)}
          PaperProps={{ sx: { width: { xs: '100%', sm: 450 }, p: 3, bgcolor: theme.palette.background.paper } }}
        >
          {selectedIncident && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="800" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WarningIcon color="error" /> Fraud Incident Details
                </Typography>
                <IconButton onClick={() => setSelectedIncident(null)}><CloseIcon /></IconButton>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">INCIDENT ID</Typography>
                  <Typography variant="body2" fontFamily="monospace" fontWeight="700">{selectedIncident.incident_id}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">STATUS</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip label={selectedIncident.status} color={getStatusColor(selectedIncident.status)} sx={{ fontWeight: 800, textTransform: 'uppercase' }} />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">UPDATE INCIDENT STATUS</Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    {['reported', 'investigating', 'resolved', 'canceled'].map((st) => (
                      <Button
                        key={st}
                        size="small"
                        variant={selectedIncident.status === st ? 'contained' : 'outlined'}
                        color={getStatusColor(st)}
                        onClick={() => handleStatusUpdate(st)}
                        sx={{ borderRadius: 2, textTransform: 'capitalize', fontSize: '0.75rem' }}
                      >
                        {st}
                      </Button>
                    ))}
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">AFFECTED PRODUCT / SERVICE</Typography>
                  <Typography variant="subtitle1" fontWeight="800">{selectedIncident.product_service}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">TRANSACTION REFERENCE</Typography>
                  <Typography variant="body1" fontWeight="700">{selectedIncident.transaction_id || 'N/A'}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">INCIDENT DESCRIPTION</Typography>
                  <Paper sx={{ p: 2, mt: 1, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                    <Typography variant="body2">{selectedIncident.incident_description}</Typography>
                  </Paper>
                </Box>
              </Stack>
            </Box>
          )}
        </Drawer>

        {/* Create Incident Dialog */}
        <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
          <DialogTitle fontWeight="bold">Report Security Incident</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12}>
                <TextField
                  label="Product / Service Involved"
                  fullWidth
                  value={formData.product_service}
                  onChange={(e) => setFormData({ ...formData, product_service: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Transaction ID (Optional)"
                  fullWidth
                  value={formData.transaction_id}
                  onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Incident Description"
                  multiline
                  rows={3}
                  fullWidth
                  value={formData.incident_description}
                  onChange={(e) => setFormData({ ...formData, incident_description: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleCreateSubmit}>Submit Incident Report</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default IncidentsPage;
