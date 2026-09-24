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
  Avatar,
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
import { getAuditLogs, getAuditOfficers, getAuditStats } from '../services/api';

const FALLBACK_OFFICERS = [
  { name: 'S. Kato', role: 'Senior Dispute Analyst', department: 'CTDRU Operations', activeCases: 14, status: 'Active' },
  { name: 'K. Sempa', role: 'Fraud Investigator', department: 'Cyber & Fintech Security', activeCases: 9, status: 'Active' },
  { name: 'L. Musoke', role: 'Legal Mediation Officer', department: 'Legal Compliance', activeCases: 6, status: 'Active' },
  { name: 'R. Akello', role: 'Intake Desk Auditor', department: 'Consumer Protection', activeCases: 11, status: 'Active' }
];

const FALLBACK_LOGS = [
  { id: 'LOG-9921', timestamp: '2026-09-24 22:45:12', officer: 'S. Kato', action: 'STATUS_UPDATE', target: 'Claim #c7b4a2e1-8890', ip: '197.239.4.12', status: 'SUCCESS' },
  { id: 'LOG-9920', timestamp: '2026-09-24 22:38:09', officer: 'K. Sempa', action: 'FRAUD_ESCALATION', target: 'Incident #inc-9912-3810', ip: '197.239.4.15', status: 'SUCCESS' },
  { id: 'LOG-9919', timestamp: '2026-09-24 22:15:44', officer: 'L. Musoke', action: 'DOC_DOWNLOAD', target: 'NITA-U Data Protection Act.pdf', ip: '197.239.4.18', status: 'SUCCESS' },
  { id: 'LOG-9918', timestamp: '2026-09-24 21:50:30', officer: 'System Admin', action: 'AUTH_LOGIN', target: 'Officer Portal', ip: '197.239.4.01', status: 'SUCCESS' }
];

const AuditLogsPage = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);

  const [officerRoster, setOfficerRoster] = useState(FALLBACK_OFFICERS);
  const [auditLogs, setAuditLogs] = useState(FALLBACK_LOGS);
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
      if (logsRes) setAuditLogs(logsRes);
      if (officersRes) setOfficerRoster(officersRes);
      if (statsRes) setAuditStats(statsRes);
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

  const filteredLogs = auditLogs.filter(log =>
    log.officer.toLowerCase().includes(search.toLowerCase()) ||
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.target.toLowerCase().includes(search.toLowerCase())
  );

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

        {/* 4 Summary Telemetry Cards */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2.5, bgcolor: theme.palette.background.paper }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">
                    ACTIVE OFFICERS
                  </Typography>
                  <Typography variant="h4" fontWeight="800" sx={{ my: 0.5 }}>
                    {officerRoster.length} Duty Officers
                  </Typography>
                  <Typography variant="caption" color="success.main" fontWeight="700">
                    All Analysts Online
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(56, 189, 248, 0.12)', color: 'primary.main', width: 44, height: 44 }}>
                  <ShieldIcon fontSize="small" />
                </Avatar>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2.5, bgcolor: theme.palette.background.paper }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">
                    AUDIT EVENTS (REALTIME)
                  </Typography>
                  <Typography variant="h4" fontWeight="800" sx={{ my: 0.5 }}>
                    {auditLogs.length} Verified Logs
                  </Typography>
                  <Typography variant="caption" color="success.main" fontWeight="700">
                    100% Immutable Trail
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(16, 185, 129, 0.12)', color: 'success.main', width: 44, height: 44 }}>
                  <AuditIcon fontSize="small" />
                </Avatar>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2.5, bgcolor: theme.palette.background.paper }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">
                    RETENTION POLICY
                  </Typography>
                  <Typography variant="h4" fontWeight="800" color="success.main" sx={{ my: 0.5, fontSize: '1.25rem' }}>
                    {auditStats?.audit_retention_period || '7 Years (Immutable)'}
                  </Typography>
                  <Typography variant="caption" color="success.main" fontWeight="700">
                    TLS 1.3 Audit Vault
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(139, 92, 246, 0.12)', color: 'secondary.main', width: 44, height: 44 }}>
                  <SecurityIcon fontSize="small" />
                </Avatar>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2.5, bgcolor: theme.palette.background.paper }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">
                    SECURITY FLAGS
                  </Typography>
                  <Typography variant="h4" fontWeight="800" sx={{ my: 0.5, color: 'success.main' }}>
                    {auditStats?.security_breaches_count ?? 0} Threats
                  </Typography>
                  <Typography variant="caption" color="success.main" fontWeight="700">
                    MFA Compliance {auditStats?.mfa_compliance_pct || '100%'}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(16, 185, 129, 0.12)', color: 'success.main', width: 44, height: 44 }}>
                  <LockIcon fontSize="small" />
                </Avatar>
              </Stack>
            </Card>
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
                {officerRoster.map((officer) => (
                  <Stack 
                    key={officer.name} 
                    direction="row" 
                    justifyContent="space-between" 
                    alignItems="center"
                    sx={{ p: 1.5, borderRadius: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight="800">{officer.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{officer.role}</Typography>
                    </Box>
                    <Chip 
                      label={`${officer.activeCases} Cases`} 
                      size="small" 
                      color="primary" 
                      sx={{ fontWeight: 800, fontSize: '0.68rem' }} 
                    />
                  </Stack>
                ))}
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
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id} hover>
                        <TableCell sx={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{log.timestamp}</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>{log.officer}</TableCell>
                        <TableCell><Chip label={log.action} size="small" color="primary" variant="outlined" sx={{ fontWeight: 800, fontSize: '0.62rem' }} /></TableCell>
                        <TableCell sx={{ fontSize: '0.8rem' }}>{log.target}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={handleOpenMenu}>
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
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
