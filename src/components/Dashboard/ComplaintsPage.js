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
import { createComplaint, updateComplaint, createIncident, updateIncident, getComplaints, getIncidents, getCaseTypeAnalytics, getFintechBreakdown, getDashboardOverview } from '../services/api';

// Mock trend data fallback
const FALLBACK_CASE_TYPES = [
  { month: 'Jan', WrongNumber: 320, UnauthDebit: 120, AirtimeDeduction: 180, AgentDispute: 90 },
  { month: 'Feb', WrongNumber: 410, UnauthDebit: 210, AirtimeDeduction: 230, AgentDispute: 140 },
  { month: 'Mar', WrongNumber: 380, UnauthDebit: 190, AirtimeDeduction: 210, AgentDispute: 110 },
  { month: 'Apr', WrongNumber: 520, UnauthDebit: 340, AirtimeDeduction: 290, AgentDispute: 180 },
  { month: 'May', WrongNumber: 490, UnauthDebit: 280, AirtimeDeduction: 260, AgentDispute: 160 },
  { month: 'Jun', WrongNumber: 680, UnauthDebit: 410, AirtimeDeduction: 310, AgentDispute: 220 },
  { month: 'Jul', WrongNumber: 740, UnauthDebit: 460, AirtimeDeduction: 350, AgentDispute: 250 },
  { month: 'Aug', WrongNumber: 710, UnauthDebit: 390, AirtimeDeduction: 320, AgentDispute: 210 },
  { month: 'Sep', WrongNumber: 650, UnauthDebit: 370, AirtimeDeduction: 290, AgentDispute: 190 },
  { month: 'Oct', WrongNumber: 820, UnauthDebit: 510, AirtimeDeduction: 390, AgentDispute: 280 },
];

const FALLBACK_FINTECH_BREAKDOWN = [
  { entity: 'MTN MoMo', disputes: 4890, color: '#0284C7' },
  { entity: 'Airtel Money', disputes: 3420, color: '#10B981' },
  { entity: 'Centenary Bank', disputes: 1950, color: '#0F172A' },
  { entity: 'Stanbic Bank', disputes: 1410, color: '#059669' },
  { entity: 'DFCU Bank', disputes: 780, color: '#64748B' }
];

const ComplaintsPage = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [monthlyCaseTypeTrends, setMonthlyCaseTypeTrends] = useState(FALLBACK_CASE_TYPES);
  const [fintechEntityBreakdown, setFintechEntityBreakdown] = useState(FALLBACK_FINTECH_BREAKDOWN);
  const [overview, setOverview] = useState(null);

  React.useEffect(() => {
    fetchBackendAnalytics();
  }, []);

  const fetchBackendAnalytics = async () => {
    try {
      const [caseTypesRes, fintechRes, overviewRes, complaintsRes, incidentsRes] = await Promise.all([
        getCaseTypeAnalytics().catch(() => null),
        getFintechBreakdown().catch(() => null),
        getDashboardOverview().catch(() => null),
        getComplaints().catch(() => null),
        getIncidents().catch(() => null)
      ]);
      if (caseTypesRes) setMonthlyCaseTypeTrends(caseTypesRes);
      if (fintechRes) setFintechEntityBreakdown(fintechRes);
      if (overviewRes) setOverview(overviewRes);
      // Populate complaint/incident tables from Firestore if backend has records
      if (Array.isArray(complaintsRes) && complaintsRes.length > 0) {
        setComplaints(complaintsRes);
      }
      if (Array.isArray(incidentsRes) && incidentsRes.length > 0) {
        setIncidents(incidentsRes);
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
  const [complaints, setComplaints] = useState([
    {
      id: 'c7b4a2e1-8890',
      case_type: 'Consumer Claim',
      company_name: 'MTN Mobile Money',
      issue_type: 'sent_money_to_wrong_number',
      description: 'Customer transferred UGX 500,000 to wrong recipient number 0771234567 instead of 0777654321.',
      transaction_id: 'TXN-9081234',
      contact_details: '+256771234567',
      status: 'received',
      priority: 'Normal',
      created_at: new Date().toISOString()
    },
    {
      id: 'd8a3b1f2-9901',
      case_type: 'Consumer Claim',
      company_name: 'Airtel Money',
      issue_type: 'airtime_deductions',
      description: 'Unauthorized airtime and wallet deduction without OTP prompt.',
      transaction_id: 'TXN-5541290',
      contact_details: '+256701987654',
      status: 'processing',
      priority: 'Normal',
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ]);

  // Incidents State
  const [incidents, setIncidents] = useState([
    {
      id: 'inc-9912-3810',
      case_type: 'Fraud Incident',
      company_name: 'MTN Mobile Money',
      issue_type: 'SIM Swap Fraud',
      description: 'Unauthorized cash out from SIM swap attack.',
      transaction_id: 'TXN-901238',
      contact_details: '+256778990011',
      status: 'investigating',
      priority: 'High',
      created_at: new Date().toISOString()
    },
    {
      id: 'inc-4451-1102',
      case_type: 'Fraud Incident',
      company_name: 'Bank Mobile App',
      issue_type: 'Double Debit Security Breach',
      description: 'Double debit during online payment processing.',
      transaction_id: 'TXN-778129',
      contact_details: '+256702112233',
      status: 'reported',
      priority: 'High',
      created_at: new Date(Date.now() - 43200000).toISOString()
    }
  ]);

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

  // Filtering
  const getFilteredData = () => {
    let dataset = allCases;
    if (activeTab === 1) dataset = complaints;
    if (activeTab === 2) dataset = incidents;

    return dataset.filter(c => {
      const matchesSearch = c.company_name?.toLowerCase().includes(search.toLowerCase()) ||
        c.transaction_id?.toLowerCase().includes(search.toLowerCase()) ||
        c.id?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  };

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
              sx={{ borderRadius: 2, fontWeight: 'bold', background: 'linear-gradient(135deg, #00F2FE 0%, #0284C7 100%)' }}
            >
              File Claim
            </Button>
          </Stack>
        </Box>

        {/* 4 Telemetry Summary Cards */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2.5, bgcolor: theme.palette.background.paper }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">
                    TOTAL CLAIMS LODGED
                  </Typography>
                  <Typography variant="h4" fontWeight="800" sx={{ my: 0.5 }}>
                    {overview?.total_disputes?.toLocaleString() || complaints.length}
                  </Typography>
                  <Typography variant="caption" color="success.main" fontWeight="700">
                    {overview?.dispute_growth_pct || '+5.2%'} vs last month
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(56, 189, 248, 0.12)', color: 'primary.main', width: 44, height: 44 }}>
                  <ComplaintsIcon fontSize="small" />
                </Avatar>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2.5, bgcolor: theme.palette.background.paper }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">
                    SETTLEMENT RATE
                  </Typography>
                  <Typography variant="h4" fontWeight="800" sx={{ my: 0.5 }}>
                    {overview?.resolution_rate_pct || '78.7%'}
                  </Typography>
                  <Typography variant="caption" color="success.main" fontWeight="700">
                    Avg 4.2 Days Resolution
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(16, 185, 129, 0.12)', color: 'success.main', width: 44, height: 44 }}>
                  <CheckIcon fontSize="small" />
                </Avatar>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2.5, bgcolor: theme.palette.background.paper }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">
                    PENDING ARBITRATION
                  </Typography>
                  <Typography variant="h4" fontWeight="800" sx={{ my: 0.5 }}>
                    {overview?.pending_review?.toLocaleString() || '1,930'}
                  </Typography>
                  <Typography variant="caption" color="warning.main" fontWeight="700">
                    Active Mediation Queue
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(245, 158, 11, 0.12)', color: 'warning.main', width: 44, height: 44 }}>
                  <ScheduleIcon fontSize="small" />
                </Avatar>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2.5, bgcolor: theme.palette.background.paper }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">
                    HIGH PRIORITY / FRAUD
                  </Typography>
                  <Typography variant="h4" fontWeight="800" sx={{ my: 0.5, color: 'error.main' }}>
                    {overview?.high_priority_fraud?.toLocaleString() || '714'}
                  </Typography>
                  <Typography variant="caption" color="error.main" fontWeight="700">
                    SIM Swap / Security Alerts
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(239, 68, 68, 0.12)', color: 'error.main', width: 44, height: 44 }}>
                  <WarningIcon fontSize="small" />
                </Avatar>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* VISUAL ANALYTICS CHARTS SECTION */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          {/* Multi-Color Line Graph by Case Type */}
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 2.5, bgcolor: theme.palette.background.paper, height: '100%' }}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight="800" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AnalyticsIcon color="primary" fontSize="small" /> DISPUTE VOLUME TRENDS BY CASE TYPE (YTD)
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Color-differentiated monthly claim volume across distinct consumer dispute categories
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
                    <Line type="monotone" name="Wrong Number Transfers" dataKey="WrongNumber" stroke="#0284C7" strokeWidth={2.5} dot={{ r: 4 }} />
                    <Line type="monotone" name="Unauthorized Debits & Fraud" dataKey="UnauthDebit" stroke="#0F172A" strokeWidth={2.5} dot={{ r: 4 }} />
                    <Line type="monotone" name="Airtime / Wallet Deductions" dataKey="AirtimeDeduction" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4 }} />
                    <Line type="monotone" name="Agent Fee Disputes" dataKey="AgentDispute" stroke="#64748B" strokeWidth={2.5} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>

          {/* Color-Coded Bar Graph by Fintech Entity */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2.5, bgcolor: theme.palette.background.paper, height: '100%' }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="800">
                  DISPUTES BY FINTECH ENTITY
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total claims distribution across mobile money & banking entities
                </Typography>
              </Box>

              <Box sx={{ width: '100%', height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fintechEntityBreakdown} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <XAxis type="number" stroke={theme.palette.text.secondary} fontSize={11} />
                    <YAxis dataKey="entity" type="category" stroke={theme.palette.text.secondary} fontSize={11} width={80} />
                    <ChartTooltip 
                      contentStyle={{ 
                        backgroundColor: theme.palette.background.paper, 
                        borderColor: theme.palette.divider,
                        borderRadius: 8
                      }} 
                    />
                    <Bar dataKey="disputes" radius={[0, 6, 6, 0]}>
                      {fintechEntityBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
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
                {getFilteredData().length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No cases found matching criteria.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  getFilteredData().map((c) => (
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
                      <TableCell>{(c.issue_type || 'General Issue').toString().replace(/_/g, ' ')}</TableCell>
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
            <Button variant="contained" onClick={handleCreateComplaint} sx={{ background: 'linear-gradient(135deg, #00F2FE 0%, #0284C7 100%)' }}>
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
