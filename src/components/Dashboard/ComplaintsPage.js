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
  MenuItem,
  Stack,
  Drawer,
  Divider,
  IconButton,
  Paper,
  Tabs,
  Tab,
  Menu,
  Avatar,
  TablePagination,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Gavel as ComplaintsIcon,
  ReportProblem as IncidentsIcon,
  Warning as WarningIcon,
  FormatListBulleted as ListIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  Assessment as AnalyticsIcon
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  Legend
} from 'recharts';
import Sidebar from '../Layout/Sidebar';
import StatCard from './StatCard';
import { tokens } from '../../theme/tokens';
import { createComplaint, updateComplaint, createIncident, updateIncident, getComplaints, getIncidents, getCaseTypeAnalytics, getFintechBreakdown } from '../services/api';

const EMPTY_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => ({
  month,
  WrongNumber: 0,
  UnauthDebit: 0,
  AirtimeDeduction: 0,
  AgentDispute: 0,
  Fraud: 0,
  Other: 0,
}));

const OPEN_STATUSES = new Set(['received', 'pending', 'reported', 'processing', 'investigating', 'mediation', 'in_progress']);
const RESOLVED_STATUSES = new Set(['resolved', 'closed', 'completed']);

const ComplaintsPage = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [monthlyCaseTypeTrends, setMonthlyCaseTypeTrends] = useState(EMPTY_MONTHS);
  const [fintechEntityBreakdown, setFintechEntityBreakdown] = useState([]);

  React.useEffect(() => {
    fetchBackendAnalytics();
  }, []);

  const fetchBackendAnalytics = async () => {
    try {
      const [caseTypesRes, fintechRes, complaintsRes, incidentsRes] = await Promise.all([
        getCaseTypeAnalytics().catch(() => null),
        getFintechBreakdown().catch(() => null),
        getComplaints().catch(() => []),
        getIncidents().catch(() => [])
      ]);

      const complaintsList = Array.isArray(complaintsRes) ? complaintsRes : [];
      const incidentsList = Array.isArray(incidentsRes) ? incidentsRes : [];

      setComplaints(complaintsList);
      setIncidents(incidentsList);

      // Compute dynamic Fintech entity breakdown from real records
      const allList = [...complaintsList, ...incidentsList];
      const entityMap = {};
      const colors = ['#0B1F3A', '#B8860B', '#14345C', '#2F6B4F', '#5C6B7A', '#D4A84B', '#9B2C2C'];
      
      allList.forEach((c) => {
        const name = (c.company_name || c.product_service || 'Unspecified').trim();
        entityMap[name] = (entityMap[name] || 0) + 1;
      });

      const dynamicBreakdown = Object.keys(entityMap).map((entity, i) => ({
        entity,
        disputes: entityMap[entity],
        color: colors[i % colors.length]
      })).sort((a, b) => b.disputes - a.disputes);

      if (fintechRes && Array.isArray(fintechRes) && fintechRes.length > 0) {
        setFintechEntityBreakdown(fintechRes);
      } else {
        setFintechEntityBreakdown(dynamicBreakdown);
      }

      // Prefer backend case-type monthly series; otherwise zeros (never invent volumes).
      if (Array.isArray(caseTypesRes) && caseTypesRes.length > 0) {
        setMonthlyCaseTypeTrends(
          caseTypesRes.map((row) => ({
            month: row.month,
            WrongNumber: row.WrongNumber || 0,
            UnauthDebit: row.UnauthDebit || 0,
            AirtimeDeduction: row.AirtimeDeduction || 0,
            AgentDispute: row.AgentDispute || 0,
            Fraud: row.Fraud || 0,
            Other: row.Other || 0,
          }))
        );
      } else {
        setMonthlyCaseTypeTrends(EMPTY_MONTHS);
      }
    } catch (e) {
      console.error("Backend analytics loading error:", e);
    }
  };

  // Modals, Drawers & Action Menus
  const [openCreateComplaint, setOpenCreateComplaint] = useState(false);
  const [openCreateIncident, setOpenCreateIncident] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [actionAnchor, setActionAnchor] = useState(null);
  const [actionTargetCase, setActionTargetCase] = useState(null);

  // Complaints State
  const [complaints, setComplaints] = useState([]);

  // Incidents State
  const [incidents, setIncidents] = useState([]);

  // Forms
  const [complaintForm, setComplaintForm] = useState({
    issue_type: 'sent_money_to_wrong_number',
    company_name: 'MTN Mobile Money',
    description: '',
    contact_details: '',
    transaction_id: ''
  });

  const [incidentForm, setIncidentForm] = useState({
    product_service: 'MTN Mobile Money',
    incident_description: '',
    transaction_id: ''
  });

  const handleOpenActionMenu = (event, caseItem) => {
    event.stopPropagation();
    setActionAnchor(event.currentTarget);
    setActionTargetCase(caseItem);
  };

  const handleCloseActionMenu = () => {
    setActionAnchor(null);
    setActionTargetCase(null);
  };

  const handleActionView = () => {
    if (actionTargetCase) {
      setSelectedCase(actionTargetCase);
    }
    handleCloseActionMenu();
  };

  const handleActionDelete = () => {
    if (actionTargetCase) {
      if (actionTargetCase.case_type === 'Consumer Claim') {
        setComplaints(complaints.filter(c => c.id !== actionTargetCase.id));
      } else {
        setIncidents(incidents.filter(i => i.id !== actionTargetCase.id));
      }
    }
    handleCloseActionMenu();
  };

  const handleCreateComplaint = async () => {
    try {
      const result = await createComplaint(complaintForm);
      const newClaim = {
        id: result.complaint_id ? result.complaint_id.slice(0, 12) : 'c-' + Date.now(),
        case_type: 'Consumer Claim',
        company_name: complaintForm.company_name,
        issue_type: complaintForm.issue_type,
        description: complaintForm.description,
        transaction_id: complaintForm.transaction_id,
        contact_details: complaintForm.contact_details,
        status: 'received',
        priority: 'Normal',
        created_at: new Date().toISOString()
      };
      setComplaints([newClaim, ...complaints]);
      setOpenCreateComplaint(false);
      setComplaintForm({ issue_type: 'sent_money_to_wrong_number', company_name: 'MTN Mobile Money', description: '', contact_details: '', transaction_id: '' });
    } catch (err) {
      alert("Error submitting claim: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleCreateIncident = async () => {
    try {
      const res = await createIncident(incidentForm);
      const newInc = {
        id: res.incident_id || 'inc-' + Date.now(),
        case_type: 'Fraud Incident',
        company_name: incidentForm.product_service,
        issue_type: 'Security Breach',
        description: incidentForm.incident_description,
        transaction_id: incidentForm.transaction_id,
        contact_details: 'Security Desk',
        status: 'investigating',
        priority: 'High',
        created_at: new Date().toISOString()
      };
      setIncidents([newInc, ...incidents]);
      setOpenCreateIncident(false);
      setIncidentForm({ product_service: 'MTN Mobile Money', incident_description: '', transaction_id: '' });
    } catch (err) {
      alert("Error reporting incident: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedCase) return;
    try {
      if (selectedCase.case_type === 'Consumer Claim') {
        await updateComplaint(selectedCase.id, { status: newStatus });
        setComplaints(complaints.map(c => c.id === selectedCase.id ? { ...c, status: newStatus } : c));
      } else {
        await updateIncident(selectedCase.id, { status: newStatus });
        setIncidents(incidents.map(i => i.id === selectedCase.id ? { ...i, status: newStatus } : i));
      }
      setSelectedCase({ ...selectedCase, status: newStatus });
    } catch (err) {
      alert("Error updating status: " + (err.response?.data?.detail || err.message));
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'received': return 'info';
      case 'reported': return 'warning';
      case 'processing':
      case 'investigating': return 'warning';
      case 'resolved': return 'success';
      case 'canceled': return 'error';
      default: return 'default';
    }
  };

  // Combined dataset
  const allCases = [...complaints, ...incidents];
  const resolvedCount = allCases.filter((c) => RESOLVED_STATUSES.has((c.status || '').toLowerCase())).length;
  const openCount = allCases.filter((c) => {
    const st = (c.status || '').toLowerCase();
    return OPEN_STATUSES.has(st) || !st;
  }).length;
  const fraudCount = allCases.filter((c) => {
    const blob = `${c.priority || ''} ${c.case_type || ''} ${c.issue_type || ''}`.toLowerCase();
    return blob.includes('fraud') || (c.priority || '').toLowerCase() === 'high' || Boolean(c.incident_id);
  }).length;
  const settlementRate = allCases.length > 0 ? `${((resolvedCount / allCases.length) * 100).toFixed(1)}%` : '0%';

  // Filtering
  const getFilteredData = () => {
    let dataset = allCases;
    if (activeTab === 1) dataset = complaints;
    if (activeTab === 2) dataset = incidents;

    return dataset.filter(c => {
      if (!c) return false;
      const searchLower = (search || '').toLowerCase();
      const matchesSearch = !search ||
        (c.company_name && c.company_name.toLowerCase().includes(searchLower)) ||
        (c.transaction_id && c.transaction_id.toLowerCase().includes(searchLower)) ||
        (c.id && c.id.toLowerCase().includes(searchLower)) ||
        (c.description && c.description.toLowerCase().includes(searchLower));
      const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = getFilteredData();
  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
        
        {/* Header Bar */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight="900" sx={{ letterSpacing: '-0.03em' }}>
              Disputes & Claims Console
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              Unified operational queue & visual analytics for consumer claims, transaction disputes, and fraud incidents.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<WarningIcon />}
              onClick={() => setOpenCreateIncident(true)}
              sx={{ borderRadius: 2, fontWeight: 'bold' }}
            >
              Report Fraud
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenCreateComplaint(true)}
              sx={{ borderRadius: 2, fontWeight: 'bold', background: 'linear-gradient(135deg, #14345C 0%, #0B1F3A 100%)' }}
            >
              File Claim
            </Button>
          </Stack>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Total claims"
              value={allCases.length.toLocaleString()}
              hint={`${complaints.length} complaints · ${incidents.length} incidents`}
              icon={<ComplaintsIcon fontSize="small" />}
              accent={tokens.navy}
              accentSoft="rgba(11, 31, 58, 0.08)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Settlement rate"
              value={settlementRate}
              hint={`${resolvedCount} resolved cases`}
              icon={<CheckIcon fontSize="small" />}
              accent={tokens.success}
              accentSoft="rgba(47, 107, 79, 0.12)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Open queue"
              value={openCount.toLocaleString()}
              hint="Awaiting officer action"
              icon={<ScheduleIcon fontSize="small" />}
              accent={tokens.gold}
              accentSoft="rgba(184, 134, 11, 0.12)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Fraud alerts"
              value={fraudCount.toLocaleString()}
              hint={fraudCount > 0 ? 'Priority review recommended' : 'No fraud pressure'}
              icon={<WarningIcon fontSize="small" />}
              accent={tokens.danger}
              accentSoft="rgba(155, 44, 44, 0.1)"
            />
          </Grid>
        </Grid>

        {/* VISUAL ANALYTICS CHARTS SECTION */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          {/* Multi-Color Line Graph by Case Type */}
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 2.5, bgcolor: theme.palette.background.paper, height: '100%' }}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight="700" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AnalyticsIcon fontSize="small" sx={{ color: tokens.navy }} /> Case volume by type (YTD)
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Live monthly counts from complaints and incidents
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ width: '100%', height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyCaseTypeTrends}>
                    <XAxis dataKey="month" stroke={theme.palette.text.secondary} fontSize={12} />
                    <YAxis stroke={theme.palette.text.secondary} fontSize={12} />
                    <ChartTooltip 
                      contentStyle={{ 
                        backgroundColor: theme.palette.background.paper, 
                        borderColor: theme.palette.divider,
                        borderRadius: 8
                      }} 
                    />
                    <Legend wrapperStyle={{ fontSize: '0.78rem', paddingTop: '10px' }} />
                    <Line type="monotone" name="Wrong number" dataKey="WrongNumber" stroke={tokens.navy} strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" name="Unauth. debit" dataKey="UnauthDebit" stroke={tokens.gold} strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" name="Airtime" dataKey="AirtimeDeduction" stroke={tokens.success} strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" name="Agent dispute" dataKey="AgentDispute" stroke={tokens.muted} strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" name="Fraud" dataKey="Fraud" stroke={tokens.danger} strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>

          {/* Color-Coded Bar Graph by Fintech Entity */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2.5, bgcolor: theme.palette.background.paper, height: '100%' }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="700">
                  Disputes by provider
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Counts from the live case register
                </Typography>
              </Box>

              <Box sx={{ width: '100%', height: 280 }}>
                {fintechEntityBreakdown.length === 0 ? (
                  <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="body2" color="text.secondary">No provider data yet</Typography>
                  </Box>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={fintechEntityBreakdown} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                      <XAxis type="number" stroke={theme.palette.text.secondary} fontSize={11} allowDecimals={false} />
                      <YAxis dataKey="entity" type="category" stroke={theme.palette.text.secondary} fontSize={11} width={90} />
                      <ChartTooltip
                        contentStyle={{
                          backgroundColor: theme.palette.background.paper,
                          borderColor: theme.palette.divider,
                          borderRadius: 8,
                        }}
                      />
                      <Bar dataKey="disputes" radius={[0, 4, 4, 0]}>
                        {fintechEntityBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || tokens.navy} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Tab Selection */}
        <Card sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(e, val) => setActiveTab(val)}
            sx={{ px: 2, '& .MuiTab-root': { py: 1.5, fontWeight: 700, fontSize: '0.85rem' } }}
          >
            <Tab icon={<ListIcon fontSize="small" />} iconPosition="start" label={`All Operations (${allCases.length})`} />
            <Tab icon={<ComplaintsIcon fontSize="small" />} iconPosition="start" label={`Consumer Claims (${complaints.length})`} />
            <Tab icon={<IncidentsIcon fontSize="small" />} iconPosition="start" label={`Fraud Incidents (${incidents.length})`} />
          </Tabs>
        </Card>

        {/* Main Content Table Card */}
        <Card sx={{ p: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }} justifyContent="space-between">
            <TextField
              size="small"
              placeholder="Search by company or transaction..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} /> }}
              sx={{ width: { xs: '100%', sm: 360 } }}
            />
            <Stack direction="row" spacing={1} sx={{ overflowX: 'auto' }}>
              {['all', 'received', 'processing', 'investigating', 'resolved'].map((st) => (
                <Chip
                  key={st}
                  label={st.toUpperCase()}
                  clickable
                  onClick={() => setFilterStatus(st)}
                  color={filterStatus === st ? 'primary' : 'default'}
                  sx={{ fontWeight: 700, borderRadius: 2 }}
                />
              ))}
            </Stack>
          </Stack>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>WORKSTREAM</TableCell>
                  <TableCell>ENTITY / PROVIDER</TableCell>
                  <TableCell>CATEGORY</TableCell>
                  <TableCell>TRANSACTION ID</TableCell>
                  <TableCell>PRIORITY</TableCell>
                  <TableCell>STATUS</TableCell>
                  <TableCell align="right">ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No cases found matching criteria.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((c) => (
                    <TableRow 
                      key={c.id} 
                      hover 
                      onClick={() => setSelectedCase(c)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                        <Chip 
                          label={c.case_type || 'Claim'} 
                          size="small" 
                          variant="outlined" 
                          color={c.case_type === 'Fraud Incident' ? 'error' : 'primary'} 
                          sx={{ fontWeight: 800, fontSize: '0.65rem' }} 
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{c.company_name || 'N/A'}</TableCell>
                      <TableCell>{((c && c.issue_type) || 'General Issue').toString().replace(/_/g, ' ')}</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace' }}>{c.transaction_id || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={c.priority || 'Normal'} 
                          size="small" 
                          color={c.priority === 'High' ? 'error' : 'default'} 
                          sx={{ fontWeight: 800, height: 18, fontSize: '0.65rem' }} 
                        />
                      </TableCell>
                      <TableCell>
                        <Chip label={c.status || 'received'} size="small" color={getStatusColor(c.status)} sx={{ fontWeight: 700, textTransform: 'uppercase' }} />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={(e) => handleOpenActionMenu(e, c)}>
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          <Menu
            anchorEl={actionAnchor}
            open={Boolean(actionAnchor)}
            onClose={handleCloseActionMenu}
            PaperProps={{ sx: { borderRadius: 2, minWidth: 160 } }}
          >
            <MenuItem onClick={handleActionView} sx={{ fontSize: '0.82rem' }}>
              <ViewIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} /> Inspect Details
            </MenuItem>
            <MenuItem onClick={handleActionView} sx={{ fontSize: '0.82rem' }}>
              <EditIcon fontSize="small" sx={{ mr: 1, color: 'info.main' }} /> Update Status
            </MenuItem>
            <MenuItem onClick={handleActionDelete} sx={{ fontSize: '0.82rem', color: 'error.main' }}>
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete Record
            </MenuItem>
          </Menu>
        </Card>

        {/* Case Inspection Drawer */}
        <Drawer
          anchor="right"
          open={Boolean(selectedCase)}
          onClose={() => setSelectedCase(null)}
          PaperProps={{ sx: { width: { xs: '100%', sm: 460 }, p: 3, bgcolor: theme.palette.background.paper } }}
        >
          {selectedCase && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="800">
                  {selectedCase.case_type} Details
                </Typography>
                <IconButton onClick={() => setSelectedCase(null)}><CloseIcon /></IconButton>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">CASE REFERENCE</Typography>
                  <Typography variant="body1" fontFamily="monospace" fontWeight="800">{selectedCase.id || 'N/A'}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">WORKSTREAM & STATUS</Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                    <Chip label={selectedCase.case_type || 'Claim'} color={selectedCase.case_type === 'Fraud Incident' ? 'error' : 'primary'} size="small" sx={{ fontWeight: 800 }} />
                    <Chip label={selectedCase.status || 'received'} color={getStatusColor(selectedCase.status)} size="small" sx={{ fontWeight: 800, textTransform: 'uppercase' }} />
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">UPDATE STATUS TO</Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 0.5 }}>
                    {['received', 'processing', 'investigating', 'resolved', 'canceled'].map((st) => (
                      <Button
                        key={st}
                        size="small"
                        variant={selectedCase.status === st ? 'contained' : 'outlined'}
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
                  <Typography variant="caption" color="text.secondary" fontWeight="700">FINTECH ENTITY / PROVIDER</Typography>
                  <Typography variant="subtitle1" fontWeight="800">{selectedCase.company_name || 'N/A'}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">TRANSACTION REFERENCE</Typography>
                  <Typography variant="body1" fontWeight="700">{selectedCase.transaction_id || 'N/A'}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">CONTACT / CLAIMANT</Typography>
                  <Typography variant="body1" fontWeight="700">{selectedCase.contact_details || selectedCase.reporter_contact || 'N/A'}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">STATEMENT & AUDIT SUMMARY</Typography>
                  <Paper sx={{ p: 2, mt: 1, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                    <Typography variant="body2">{selectedCase.description || 'No detailed statement provided.'}</Typography>
                  </Paper>
                </Box>
              </Stack>
            </Box>
          )}
        </Drawer>

        {/* Create Complaint Modal */}
        <Dialog open={openCreateComplaint} onClose={() => setOpenCreateComplaint(false)} maxWidth="sm" fullWidth>
          <DialogTitle fontWeight="bold">Record Consumer Dispute Claim</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12}>
                <TextField
                  label="Provider / Company Name"
                  fullWidth
                  value={complaintForm.company_name}
                  onChange={(e) => setComplaintForm({ ...complaintForm, company_name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Issue Category"
                  select
                  fullWidth
                  value={complaintForm.issue_type}
                  onChange={(e) => setComplaintForm({ ...complaintForm, issue_type: e.target.value })}
                >
                  <MenuItem value="sent_money_to_wrong_number">Sent Money to Wrong Number</MenuItem>
                  <MenuItem value="fraud">Unauthorized Withdrawal</MenuItem>
                  <MenuItem value="airtime_deductions">Airtime / Wallet Deduction</MenuItem>
                  <MenuItem value="agent_issue">Agent Dispute</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Transaction ID"
                  fullWidth
                  value={complaintForm.transaction_id}
                  onChange={(e) => setComplaintForm({ ...complaintForm, transaction_id: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Contact Phone / Email"
                  fullWidth
                  value={complaintForm.contact_details}
                  onChange={(e) => setComplaintForm({ ...complaintForm, contact_details: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Detailed Description"
                  multiline
                  rows={3}
                  fullWidth
                  value={complaintForm.description}
                  onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenCreateComplaint(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleCreateComplaint} sx={{ background: 'linear-gradient(135deg, #14345C 0%, #0B1F3A 100%)' }}>
              Submit Claim
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create Incident Modal */}
        <Dialog open={openCreateIncident} onClose={() => setOpenCreateIncident(false)} maxWidth="sm" fullWidth>
          <DialogTitle fontWeight="bold">Report High-Priority Security Incident</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12}>
                <TextField
                  label="Product / Service Involved"
                  fullWidth
                  value={incidentForm.product_service}
                  onChange={(e) => setIncidentForm({ ...incidentForm, product_service: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Transaction Reference (Optional)"
                  fullWidth
                  value={incidentForm.transaction_id}
                  onChange={(e) => setIncidentForm({ ...incidentForm, transaction_id: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Incident & Security Breach Details"
                  multiline
                  rows={3}
                  fullWidth
                  value={incidentForm.incident_description}
                  onChange={(e) => setIncidentForm({ ...incidentForm, incident_description: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenCreateIncident(false)}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleCreateIncident}>
              Report Incident
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </Box>
  );
};

export default ComplaintsPage;
