import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  Avatar,
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
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
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
import { getDashboardOverview } from '../services/api';

const monthlyTrendData = [
  { month: 'Jan', disputes: 160 },
  { month: 'Feb', disputes: 480 },
  { month: 'Mar', disputes: 490 },
  { month: 'Apr', disputes: 820 },
  { month: 'May', disputes: 610 },
  { month: 'Jun', disputes: 990 },
  { month: 'Jul', disputes: 1180 },
  { month: 'Aug', disputes: 1040 },
  { month: 'Sep', disputes: 950 },
  { month: 'Oct', disputes: 1420 },
];

const mockRecentDisputes = [
  { id: '#Ug001245', consumer: 'Jane Nalule', provider: 'MTN Mobile Money', type: 'Fraud', date: '12 Oct 2026', status: 'Pending', assignee: 'S. Kato' },
  { id: '#Ug001244', consumer: 'David Okello', provider: 'Airtel Money', type: 'Transaction Issue', date: '11 Oct 2026', status: 'Resolved', assignee: 'K. Sempa' },
  { id: '#Ug001243', consumer: 'Sarah Atim', provider: 'Centenary Bank', type: 'Unauth. Debit', date: '11 Oct 2026', status: 'Mediation', assignee: 'L. Musoke' },
  { id: '#Ug001242', consumer: 'Peter Mukasa', provider: 'Stanbic Bank', type: 'Loan Dispute', date: '10 Oct 2026', status: 'Pending', assignee: 'S. Kato' }
];

const Homepage = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await getDashboardOverview();
      if (res) setOverview(res);
    } catch (err) {
      console.error("Error loading dashboard backend overview:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMenu = (event) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'Resolved': return <Chip label="Resolved" size="small" sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', fontWeight: 700 }} />;
      case 'Pending': return <Chip label="Pending" size="small" sx={{ bgcolor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', fontWeight: 700 }} />;
      case 'Mediation': return <Chip label="Mediation" size="small" sx={{ bgcolor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', fontWeight: 700 }} />;
      default: return <Chip label={status} size="small" />;
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Top Section Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" fontWeight="800">
            Dashboard Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            CTDRU Consumer Protection Dispute & Incident Monitoring System
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchOverview}
          size="small"
          sx={{ border: `1px solid ${theme.palette.divider}` }}
        >
          Refresh Telemetry
        </Button>
      </Box>

      {loading && <LinearProgress sx={{ mb: 3, borderRadius: 2, height: 4 }} />}

      {/* 4 Clean Institutional Metric Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, bgcolor: theme.palette.background.paper }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="700">
                  TOTAL DISPUTES
                </Typography>
                <Typography variant="h4" fontWeight="800" sx={{ my: 0.5 }}>
                  {overview?.total_disputes?.toLocaleString() || '12,456'}
                </Typography>
                <Typography variant="caption" color="success.main" fontWeight="700">
                  {overview?.dispute_growth_pct || '+4.8%'} vs last month
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'rgba(56, 189, 248, 0.12)', color: 'primary.main', width: 44, height: 44 }}>
                <ComplaintsIcon fontSize="small" />
              </Avatar>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, bgcolor: theme.palette.background.paper }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="700">
                  RESOLVED CASES
                </Typography>
                <Typography variant="h4" fontWeight="800" sx={{ my: 0.5 }}>
                  {overview?.resolved_cases?.toLocaleString() || '9,812'}
                </Typography>
                <Typography variant="caption" color="success.main" fontWeight="700">
                  {overview?.resolution_rate_pct || '78.7%'} Resolution Rate
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'rgba(16, 185, 129, 0.12)', color: 'success.main', width: 44, height: 44 }}>
                <CheckIcon fontSize="small" />
              </Avatar>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, bgcolor: theme.palette.background.paper }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="700">
                  PENDING REVIEW
                </Typography>
                <Typography variant="h4" fontWeight="800" sx={{ my: 0.5 }}>
                  {overview?.pending_review?.toLocaleString() || '1,930'}
                </Typography>
                <Typography variant="caption" color="warning.main" fontWeight="700">
                  15.5% Pending Queue
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'rgba(245, 158, 11, 0.12)', color: 'warning.main', width: 44, height: 44 }}>
                <ScheduleIcon fontSize="small" />
              </Avatar>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, bgcolor: theme.palette.background.paper }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="700">
                  HIGH PRIORITY / FRAUD
                </Typography>
                <Typography variant="h4" fontWeight="800" sx={{ my: 0.5, color: 'error.main' }}>
                  714
                </Typography>
                <Typography variant="caption" color="error.main" fontWeight="700">
                  Requires Immediate Action
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'rgba(239, 68, 68, 0.12)', color: 'error.main', width: 44, height: 44 }}>
                <WarningIcon fontSize="small" />
              </Avatar>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Main Charts & Overview Row */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* Line Chart Section */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2.5, bgcolor: theme.palette.background.paper, height: '100%' }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle1" fontWeight="800">
                  MONTHLY COMPLAINT TRENDS (YTD)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Average resolution time: 18 days
                </Typography>
              </Box>
            </Box>

            <Box sx={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={overview?.monthly_trends || monthlyTrendData}>
                  <XAxis dataKey="month" stroke={theme.palette.text.secondary} fontSize={12} />
                  <YAxis stroke={theme.palette.text.secondary} fontSize={12} />
                  <ChartTooltip 
                    contentStyle={{ 
                      backgroundColor: theme.palette.background.paper, 
                      borderColor: theme.palette.divider,
                      borderRadius: 8
                    }} 
                  />
                  <Line type="monotone" dataKey="disputes" stroke="#0284C7" strokeWidth={3} dot={{ r: 5, fill: '#0284C7' }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Status Breakdown Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2.5, bgcolor: theme.palette.background.paper, height: '100%' }}>
            <Typography variant="subtitle1" fontWeight="800" sx={{ mb: 2 }}>
              CASE STATUS OVERVIEW
            </Typography>

            <Stack spacing={2.5}>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography variant="body2" fontWeight="700">Resolved</Typography>
                  <Typography variant="body2" fontWeight="800" color="success.main">78%</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={78} color="success" sx={{ height: 8, borderRadius: 4 }} />
              </Box>

              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography variant="body2" fontWeight="700">Pending</Typography>
                  <Typography variant="body2" fontWeight="800" color="info.main">16%</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={16} color="primary" sx={{ height: 8, borderRadius: 4 }} />
              </Box>

              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography variant="body2" fontWeight="700">In Progress</Typography>
                  <Typography variant="body2" fontWeight="800" color="warning.main">4%</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={4} color="warning" sx={{ height: 8, borderRadius: 4 }} />
              </Box>

              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography variant="body2" fontWeight="700">Dismissed</Typography>
                  <Typography variant="body2" fontWeight="800" color="error.main">2%</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={2} color="error" sx={{ height: 8, borderRadius: 4 }} />
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Consumer Disputes Table */}
      <Card sx={{ p: 2.5, bgcolor: theme.palette.background.paper }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight="800">
            RECENT CONSUMER DISPUTES
          </Typography>
          <Button component={Link} to="/complaints" size="small" endIcon={<ArrowForwardIcon />}>
            View All Cases
          </Button>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>CONSUMER NAME</TableCell>
                <TableCell>FINTECH ENTITY</TableCell>
                <TableCell>CASE TYPE</TableCell>
                <TableCell>LODGED DATE</TableCell>
                <TableCell>STATUS</TableCell>
                <TableCell>ASSIGNEE</TableCell>
                <TableCell align="right">ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(overview?.recent_disputes || mockRecentDisputes).map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{row.consumer}</TableCell>
                  <TableCell>{row.provider}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{getStatusChip(row.status)}</TableCell>
                  <TableCell>{row.assignee}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={(e) => handleOpenMenu(e, row)}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleCloseMenu}
          PaperProps={{ sx: { borderRadius: 2, minWidth: 150 } }}
        >
          <MenuItem onClick={handleCloseMenu} sx={{ fontSize: '0.82rem' }}>
            <ViewIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} /> View Details
          </MenuItem>
          <MenuItem onClick={handleCloseMenu} sx={{ fontSize: '0.82rem' }}>
            <EditIcon fontSize="small" sx={{ mr: 1, color: 'info.main' }} /> Update Status
          </MenuItem>
          <MenuItem onClick={handleCloseMenu} sx={{ fontSize: '0.82rem', color: 'error.main' }}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete Record
          </MenuItem>
        </Menu>
      </Card>
    </Box>
  );
};

export default Homepage;
