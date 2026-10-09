import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  Chip,
  LinearProgress,
  Stack,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  useTheme
} from '@mui/material';
import {
  Gavel as ComplaintsIcon,
  Refresh as RefreshIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip
} from 'recharts';
import { Link } from 'react-router-dom';
import { getComplaints, getIncidents, getDashboardOverview } from '../services/api';
import StatCard from './StatCard';
import { tokens } from '../../theme/tokens';

const OPEN_STATUSES = new Set([
  'received',
  'pending',
  'reported',
  'processing',
  'investigating',
  'mediation',
  'in_progress',
]);
const RESOLVED_STATUSES = new Set(['resolved', 'closed', 'completed']);

const Homepage = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const [realComplaints, setRealComplaints] = useState([]);
  const [realIncidents, setRealIncidents] = useState([]);
  const [monthlyTrendData, setMonthlyTrendData] = useState([]);
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [complaintsRes, incidentsRes, overviewRes] = await Promise.all([
        getComplaints().catch(() => []),
        getIncidents().catch(() => []),
        getDashboardOverview().catch(() => null)
      ]);
      const cList = Array.isArray(complaintsRes) ? complaintsRes : [];
      const iList = Array.isArray(incidentsRes) ? incidentsRes : [];
      setRealComplaints(cList);
      setRealIncidents(iList);
      setOverview(overviewRes);

      if (overviewRes && Array.isArray(overviewRes.monthly_trends)) {
        setMonthlyTrendData(overviewRes.monthly_trends);
      } else {
        // Honest empty chart when overview is unavailable — never invent volumes.
        const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        setMonthlyTrendData(monthsOrder.map((m) => ({ month: m, disputes: 0 })));
      }
    } catch (err) {
      console.error("Error loading live dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const allCases = [...realComplaints, ...realIncidents];
  const localTotal = allCases.length;
  const localResolved = allCases.filter((c) => RESOLVED_STATUSES.has((c.status || '').toLowerCase())).length;
  const localOpen = allCases.filter((c) => {
    const st = (c.status || '').toLowerCase();
    return OPEN_STATUSES.has(st) || !st;
  }).length;
  const localFraud = realIncidents.length + realComplaints.filter((c) => {
    const blob = `${c.issue_type || ''} ${c.description || ''} ${c.case_type || ''} ${c.priority || ''}`.toLowerCase();
    return blob.includes('fraud') || (c.priority || '').toLowerCase() === 'high';
  }).length;

  // Prefer backend overview when present; fall back to list-derived counts.
  const totalDisputes = overview?.total_disputes ?? localTotal;
  const resolvedCount = overview?.resolved_cases ?? localResolved;
  const pendingCount = overview?.pending_review ?? localOpen;
  const highPriorityCount = overview?.high_priority_fraud ?? localFraud;
  const complaintCount = realComplaints.length;
  const incidentCount = realIncidents.length;

  const resolutionRatePct =
    overview?.resolution_rate_pct ||
    (totalDisputes > 0 ? `${((resolvedCount / totalDisputes) * 100).toFixed(1)}%` : '0%');
  const growthPct = overview?.dispute_growth_pct || '—';
  const pendingPct = totalDisputes > 0 ? ((pendingCount / totalDisputes) * 100).toFixed(1) : '0';
  const resolvedPct = totalDisputes > 0 ? ((resolvedCount / totalDisputes) * 100).toFixed(1) : '0';

  const handleOpenMenu = (event) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const getStatusChip = (status) => {
    const st = (status || 'received').toLowerCase();
    switch (st) {
      case 'resolved': return <Chip label="Resolved" size="small" sx={{ bgcolor: 'rgba(47, 107, 79, 0.15)', color: '#2F6B4F', fontWeight: 700 }} />;
      case 'investigating':
      case 'processing': return <Chip label="In Progress" size="small" sx={{ bgcolor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', fontWeight: 700 }} />;
      case 'received':
      case 'pending': return <Chip label="Pending" size="small" sx={{ bgcolor: 'rgba(184, 134, 11, 0.15)', color: '#B8860B', fontWeight: 700 }} />;
      default: return <Chip label={status || 'Received'} size="small" />;
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Top Section Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h5" fontWeight="700" sx={{ letterSpacing: '-0.02em' }}>
            Operations overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Live complaints and fraud incidents from the CTDRU case register
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchDashboardData}
          size="small"
          sx={{ border: `1px solid ${tokens.line}`, color: tokens.navy }}
        >
          Refresh
        </Button>
      </Box>

      {loading && <LinearProgress sx={{ mb: 3, borderRadius: 1, height: 3, bgcolor: tokens.sand }} />}

      {/* KPI stat cards — real Firestore-backed totals */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Total cases"
            value={Number(totalDisputes).toLocaleString()}
            hint={`${complaintCount} complaints · ${incidentCount} incidents · MoM ${growthPct}`}
            icon={<ComplaintsIcon fontSize="small" />}
            accent={tokens.navy}
            accentSoft="rgba(11, 31, 58, 0.08)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Open queue"
            value={Number(pendingCount).toLocaleString()}
            hint={`${pendingPct}% of caseload awaiting action`}
            icon={<ScheduleIcon fontSize="small" />}
            accent={tokens.gold}
            accentSoft="rgba(184, 134, 11, 0.12)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Resolved"
            value={Number(resolvedCount).toLocaleString()}
            hint={`${resolutionRatePct} resolution rate`}
            icon={<CheckIcon fontSize="small" />}
            accent={tokens.success}
            accentSoft="rgba(47, 107, 79, 0.12)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Fraud alerts"
            value={Number(highPriorityCount).toLocaleString()}
            hint={highPriorityCount > 0 ? 'Priority review recommended' : 'No open fraud pressure'}
            icon={<WarningIcon fontSize="small" />}
            accent={tokens.danger}
            accentSoft="rgba(155, 44, 44, 0.1)"
          />
        </Grid>
      </Grid>

      {/* Main Charts & Overview Row */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* Line Chart Section */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2.5, bgcolor: theme.palette.background.paper, height: '100%' }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle1" fontWeight="700">
                  Case intake trend (YTD)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  New complaints and incidents by month
                </Typography>
              </Box>
            </Box>

            <Box sx={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrendData}>
                  <XAxis dataKey="month" stroke={theme.palette.text.secondary} fontSize={12} />
                  <YAxis stroke={theme.palette.text.secondary} fontSize={12} />
                  <ChartTooltip 
                    contentStyle={{ 
                      backgroundColor: theme.palette.background.paper, 
                      borderColor: theme.palette.divider,
                      borderRadius: 8
                    }} 
                  />
                  <Line type="monotone" dataKey="disputes" stroke="#0B1F3A" strokeWidth={3} dot={{ r: 5, fill: '#B8860B' }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Status Breakdown Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2.5, bgcolor: theme.palette.background.paper, height: '100%' }}>
            <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 2 }}>
              Caseload mix
            </Typography>

            <Stack spacing={2.5}>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography variant="body2" fontWeight="600">Resolved</Typography>
                  <Typography variant="body2" fontWeight="700" sx={{ color: tokens.success }}>{resolvedPct}%</Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, parseFloat(resolvedPct) || 0)}
                  sx={{ height: 7, borderRadius: 1, bgcolor: tokens.sand, '& .MuiLinearProgress-bar': { bgcolor: tokens.success } }}
                />
              </Box>

              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography variant="body2" fontWeight="600">Open queue</Typography>
                  <Typography variant="body2" fontWeight="700" sx={{ color: tokens.gold }}>{pendingPct}%</Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, parseFloat(pendingPct) || 0)}
                  sx={{ height: 7, borderRadius: 1, bgcolor: tokens.sand, '& .MuiLinearProgress-bar': { bgcolor: tokens.gold } }}
                />
              </Box>

              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography variant="body2" fontWeight="600">Complaints / incidents</Typography>
                  <Typography variant="body2" fontWeight="700" sx={{ color: tokens.navy }}>
                    {complaintCount} / {incidentCount}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={totalDisputes > 0 ? (complaintCount / totalDisputes) * 100 : 0}
                  sx={{ height: 7, borderRadius: 1, bgcolor: tokens.sand, '& .MuiLinearProgress-bar': { bgcolor: tokens.navy } }}
                />
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Consumer Disputes Table */}
      <Card sx={{ p: 2.5, bgcolor: theme.palette.background.paper }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight="800">
            RECENT CONSUMER DISPUTES & CLAIMS
          </Typography>
          <Button component={Link} to="/complaints" size="small" endIcon={<ArrowForwardIcon />}>
            View All Cases
          </Button>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>CLAIMANT / CONTACT</TableCell>
                <TableCell>FINTECH ENTITY</TableCell>
                <TableCell>ISSUE CATEGORY</TableCell>
                <TableCell>TRANSACTION ID</TableCell>
                <TableCell>LODGED DATE</TableCell>
                <TableCell>STATUS</TableCell>
                <TableCell align="right">ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allCases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No complaints or incidents registered in backend database.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                allCases.slice(0, 10).map((row) => (
                  <TableRow key={row.id || row.complaint_id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {row.contact_details || row.reporter_contact || 'Anonymous / Web Intake'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{row.company_name || row.product_service || 'N/A'}</TableCell>
                    <TableCell>{(row.issue_type || row.case_type || 'General Issue').toString().replace(/_/g, ' ')}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace' }}>{row.transaction_id || 'N/A'}</TableCell>
                    <TableCell>{row.created_at ? new Date(row.created_at).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>{getStatusChip(row.status)}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={(e) => handleOpenMenu(e, row)}>
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
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleCloseMenu}
          PaperProps={{ sx: { borderRadius: 2, minWidth: 150 } }}
        >
          <MenuItem component={Link} to="/complaints" onClick={handleCloseMenu} sx={{ fontSize: '0.82rem' }}>
            <ViewIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} /> View Console
          </MenuItem>
        </Menu>
      </Card>
    </Box>
  );
};

export default Homepage;
