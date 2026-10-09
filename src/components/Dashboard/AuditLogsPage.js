import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  LinearProgress,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  useTheme
} from '@mui/material';
import {
  HistoryEdu as AuditIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Shield as ShieldIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  LockReset as LockIcon
} from '@mui/icons-material';
import Sidebar from '../Layout/Sidebar';
import StatCard from './StatCard';
import { tokens } from '../../theme/tokens';
import { getAuditLogs, getAuditOfficers, getAuditStats } from '../services/api';

const AuditLogsPage = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);

  const [officerRoster, setOfficerRoster] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditStats, setAuditStats] = useState(null);

  React.useEffect(() => {
    fetchBackendAuditData();
  }, []);

  const fetchBackendAuditData = async () => {
    setLoading(true);
    try {
      const [logsRes, officersRes, statsRes] = await Promise.all([
        getAuditLogs().catch(() => null),
        getAuditOfficers().catch(() => null),
        getAuditStats().catch(() => null)
      ]);
      if (Array.isArray(logsRes)) {
        setAuditLogs(logsRes);
      } else if (logsRes?.logs && Array.isArray(logsRes.logs)) {
        setAuditLogs(logsRes.logs);
      } else if (logsRes?.data && Array.isArray(logsRes.data)) {
        setAuditLogs(logsRes.data);
      }

      if (Array.isArray(officersRes)) {
        setOfficerRoster(officersRes);
      } else if (officersRes?.officers && Array.isArray(officersRes.officers)) {
        setOfficerRoster(officersRes.officers);
      } else if (officersRes?.data && Array.isArray(officersRes.data)) {
        setOfficerRoster(officersRes.data);
      }

      if (statsRes && typeof statsRes === 'object') {
        setAuditStats(statsRes.data || statsRes);
      }
    } catch (e) {
      console.error("Backend audit fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchBackendAuditData();
  };

  const handleOpenMenu = (event) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const safeLogs = Array.isArray(auditLogs) ? auditLogs : [];
  const safeRoster = Array.isArray(officerRoster) ? officerRoster : [];

  const filteredLogs = safeLogs.filter(log => {
    if (!log) return false;
    const officer = (log.officer || log.officer_name || log.user || log.actor || '').toString().toLowerCase();
    const action = (log.action || log.event || log.action_type || '').toString().toLowerCase();
    const target = (log.target || log.target_record || log.resource || log.details || '').toString().toLowerCase();
    const id = (log.id || log.log_id || '').toString().toLowerCase();
    const s = (search || '').toLowerCase();

    return (
      officer.includes(s) ||
      action.includes(s) ||
      target.includes(s) ||
      id.includes(s)
    );
  });

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
        
        {/* Header Bar */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight="900" sx={{ letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <AuditIcon color="primary" fontSize="large" /> System Audit & Security Logs
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              Immutable audit trail of case officer actions, evidence access, and security authentication logs.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            size="small"
            sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}
          >
            Refresh Logs
          </Button>
        </Box>

        {loading && <LinearProgress sx={{ mb: 3, borderRadius: 2, height: 4 }} />}

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Active officers"
              value={auditStats?.active_officer_sessions ?? safeRoster.length}
              hint={safeRoster.length ? 'From staff roster' : 'No officers synced yet'}
              icon={<ShieldIcon fontSize="small" />}
              accent={tokens.navy}
              accentSoft="rgba(11, 31, 58, 0.08)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Audit events"
              value={(auditStats?.total_audit_events ?? safeLogs.length).toLocaleString()}
              hint="Immutable action trail"
              icon={<AuditIcon fontSize="small" />}
              accent={tokens.success}
              accentSoft="rgba(47, 107, 79, 0.12)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Retention"
              value={auditStats?.audit_retention_period || '7 Years'}
              hint="Policy retention window"
              icon={<SecurityIcon fontSize="small" />}
              accent={tokens.navyMid}
              accentSoft="rgba(20, 52, 92, 0.1)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Security flags"
              value={auditStats?.security_breaches_count ?? 0}
              hint={
                (auditStats?.security_breaches_count ?? 0) === 0
                  ? 'No breach events logged'
                  : `${auditStats?.security_events ?? 0} security-related events`
              }
              icon={<LockIcon fontSize="small" />}
              accent={(auditStats?.security_breaches_count ?? 0) > 0 ? tokens.danger : tokens.gold}
              accentSoft={
                (auditStats?.security_breaches_count ?? 0) > 0
                  ? 'rgba(155, 44, 44, 0.1)'
                  : 'rgba(184, 134, 11, 0.12)'
              }
            />
          </Grid>
        </Grid>

        {/* Case Officer Active Roster */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid item xs={12} md={5}>
            <Card sx={{ p: 3, height: '100%' }}>
              <Typography variant="subtitle1" fontWeight="800" sx={{ mb: 2 }}>
                CASE OFFICER ACTIVE ROSTER
              </Typography>
              <Stack spacing={2}>
                {safeRoster.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">No officers in roster yet</Typography>
                ) : (
                  safeRoster.map((officer, idx) => (
                    <Stack
                      key={officer.name || officer.officer_name || idx}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ p: 1.5, borderRadius: 1, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight="700">{officer.name || officer.officer_name || 'Officer'}</Typography>
                        <Typography variant="caption" color="text.secondary">{officer.role || officer.department || 'Staff'}</Typography>
                      </Box>
                      <Chip
                        label={`${officer.activeCases ?? officer.active_cases ?? officer.assignedCases ?? 0} cases`}
                        size="small"
                        color="primary"
                        sx={{ fontWeight: 700, fontSize: '0.68rem' }}
                      />
                    </Stack>
                  ))
                )}
              </Stack>
            </Card>
          </Grid>

          {/* Audit Stream Table */}
          <Grid item xs={12} md={7}>
            <Card sx={{ p: 3, height: '100%' }}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight="800">
                  REAL-TIME AUDIT LOG STREAM
                </Typography>
                <TextField
                  size="small"
                  placeholder="Filter officer or action..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{ startAdornment: <SearchIcon color="action" sx={{ mr: 1, fontSize: 18 }} /> }}
                  sx={{ width: 220 }}
                />
              </Box>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>TIMESTAMP</TableCell>
                      <TableCell>OFFICER</TableCell>
                      <TableCell>ACTION</TableCell>
                      <TableCell>TARGET RECORD</TableCell>
                      <TableCell align="right">ACTIONS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            {search ? 'No audit entries match this filter' : 'No audit events recorded yet'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLogs.map((log, idx) => (
                        <TableRow key={log.id || idx} hover>
                          <TableCell sx={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{log.timestamp || log.created_at || '—'}</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>{log.officer || log.officer_name || log.user || log.actor || 'System'}</TableCell>
                          <TableCell><Chip label={log.action || log.event || log.action_type || 'LOG'} size="small" color="primary" variant="outlined" sx={{ fontWeight: 700, fontSize: '0.62rem' }} /></TableCell>
                          <TableCell sx={{ fontSize: '0.8rem' }}>{log.target || log.target_record || log.resource || log.details || '—'}</TableCell>
                          <TableCell align="right">
                            <IconButton size="small" onClick={handleOpenMenu}>
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        </Grid>

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleCloseMenu}
          PaperProps={{ sx: { borderRadius: 2, minWidth: 150 } }}
        >
          <MenuItem onClick={handleCloseMenu} sx={{ fontSize: '0.82rem' }}>
            <ViewIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} /> Inspect Audit Entry
          </MenuItem>
        </Menu>

      </Box>
    </Box>
  );
};

export default AuditLogsPage;
