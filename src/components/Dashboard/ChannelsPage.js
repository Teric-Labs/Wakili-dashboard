import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Grid,
  Stack,
  Tabs,
  Tab,
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
  Paper,
  IconButton,
  Menu,
  MenuItem,
  useTheme
} from '@mui/material';
import {
  Phonelink as ChannelsIcon,
  PhoneAndroid as UssdIcon,
  Sms as SmsIcon,
  RecordVoiceOver as IvrIcon,
  Smartphone as AppIcon,
  Language as WebIcon,
  CheckCircle as OnlineIcon,
  Refresh as RefreshIcon,
  Speed as SpeedIcon,
  GraphicEq as SignalIcon,
  TrendingUp as TrendingIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import Sidebar from '../Layout/Sidebar';
import { getChannelsOverview, getUssdLogs, getSmsLogs, getIvrLogs } from '../services/api';

const ChannelsPage = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const [channelOverview, setChannelOverview] = useState([]);
  const [ussdLogs, setUssdLogs] = useState([]);
  const [smsLogs, setSmsLogs] = useState([]);
  const [ivrLogs, setIvrLogs] = useState([]);

  React.useEffect(() => {
    fetchBackendChannelsData();
  }, []);

  const fetchBackendChannelsData = async () => {
    setLoading(true);
    try {
      const [overviewRes, ussdRes, smsRes, ivrRes] = await Promise.all([
        getChannelsOverview().catch(() => null),
        getUssdLogs().catch(() => null),
        getSmsLogs().catch(() => null),
        getIvrLogs().catch(() => null)
      ]);
      if (overviewRes) setChannelOverview(overviewRes);
      if (ussdRes) setUssdLogs(ussdRes);
      if (smsRes) setSmsLogs(smsRes);
      if (ivrRes) setIvrLogs(ivrRes);
    } catch (e) {
      console.error("Backend channels fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenMenu = (event) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const handleRefresh = () => {
    fetchBackendChannelsData();
  };

  // App Metrics Logs
  const appLogs = [
    { platform: 'Android 14', device: 'Samsung Galaxy A54', appVer: 'v2.4.1', payload: 'Form Intake + PDF Evidence', responseTime: '124ms', status: 'Success' },
    { platform: 'iOS 17.4', device: 'iPhone 14 Pro', appVer: 'v2.4.0', payload: 'Biometric Auth + Status Check', responseTime: '98ms', status: 'Success' },
    { platform: 'Android 13', device: 'Tecno Spark 10', appVer: 'v2.4.1', payload: 'Dispute Claim Lodged', responseTime: '165ms', status: 'Success' }
  ];

  // Web Telemetry Logs
  const webLogs = [
    { session: 'WEB-1092', browser: 'Chrome 122.0 / Mac', ipRegion: 'Kampala Central', captcha: 'Passed', duration: '1m 50s', result: 'Form Submitted' },
    { session: 'WEB-1091', browser: 'Safari Mobile / iOS', ipRegion: 'Mbarara Municipality', captcha: 'Passed', duration: '2m 15s', result: 'Form Submitted' },
    { session: 'WEB-1090', browser: 'Firefox 123.0 / Windows', ipRegion: 'Jinja City', captcha: 'Passed', duration: '45s', result: 'Status Lookup' }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
        
        {/* Top Header Row */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight="900" sx={{ letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <ChannelsIcon color="primary" fontSize="large" /> Consumer Intake Channels
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              Real-time telemetry and operational metrics across USSD, SMS, IVR, Mobile App, and Web Portals.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            size="small"
            sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}
          >
            Refresh Telemetry
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
                    TOTAL INGEST VOLUME
                  </Typography>
                  <Typography variant="h4" fontWeight="800" sx={{ my: 0.5 }}>
                    {(Array.isArray(channelOverview) && channelOverview.length > 0
                      ? channelOverview.reduce((acc, c) => acc + (parseInt((c.volume || '0').toString().replace(/,/g, ''), 10) || 0), 0)
                      : (ussdLogs.length + smsLogs.length + ivrLogs.length)).toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="success.main" fontWeight="700">
                    Live Channel Operations
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(56, 189, 248, 0.12)', color: 'primary.main', width: 44, height: 44 }}>
                  <TrendingIcon fontSize="small" />
                </Avatar>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2.5, bgcolor: theme.palette.background.paper }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">
                    GATEWAY LATENCY
                  </Typography>
                  <Typography variant="h4" fontWeight="800" sx={{ my: 0.5 }}>
                    142 ms
                  </Typography>
                  <Typography variant="caption" color="success.main" fontWeight="700">
                    Optimal Processing Rate
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(16, 185, 129, 0.12)', color: 'success.main', width: 44, height: 44 }}>
                  <SpeedIcon fontSize="small" />
                </Avatar>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2.5, bgcolor: theme.palette.background.paper }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">
                    TOP CHANNEL
                  </Typography>
                  <Typography variant="h4" fontWeight="800" sx={{ my: 0.5 }}>
                    USSD
                  </Typography>
                  <Typography variant="caption" color="info.main" fontWeight="700">
                    44% Total Dispute Claims
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(245, 158, 11, 0.12)', color: 'warning.main', width: 44, height: 44 }}>
                  <UssdIcon fontSize="small" />
                </Avatar>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2.5, bgcolor: theme.palette.background.paper }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">
                    SYSTEM HEALTH
                  </Typography>
                  <Typography variant="h4" fontWeight="800" sx={{ my: 0.5, color: 'success.main' }}>
                    99.94%
                  </Typography>
                  <Typography variant="caption" color="success.main" fontWeight="700">
                    5/5 Gateways Active
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(16, 185, 129, 0.12)', color: 'success.main', width: 44, height: 44 }}>
                  <OnlineIcon fontSize="small" />
                </Avatar>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* Tab Selection Bar */}
        <Card sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: 2,
              '& .MuiTab-root': {
                py: 1.5,
                fontWeight: 700,
                fontSize: '0.85rem',
                textTransform: 'none',
                minHeight: 48
              }
            }}
          >
            <Tab icon={<SignalIcon fontSize="small" />} iconPosition="start" label="Overview" />
            <Tab icon={<UssdIcon fontSize="small" />} iconPosition="start" label="USSD" />
            <Tab icon={<SmsIcon fontSize="small" />} iconPosition="start" label="SMS" />
            <Tab icon={<IvrIcon fontSize="small" />} iconPosition="start" label="IVR Voice" />
            <Tab icon={<AppIcon fontSize="small" />} iconPosition="start" label="Mobile App" />
            <Tab icon={<WebIcon fontSize="small" />} iconPosition="start" label="Web Portal" />
          </Tabs>
        </Card>

        {/* TAB 0: GENERAL OVERVIEW */}
        {activeTab === 0 && (
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight="800" sx={{ mb: 2 }}>
                  INGESTION CHANNEL DISTRIBUTION & HEALTH MATRIX
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>CHANNEL NAME</TableCell>
                        <TableCell>IDENTIFIER / CODE</TableCell>
                        <TableCell>MONTHLY VOLUME</TableCell>
                        <TableCell>SHARE</TableCell>
                        <TableCell>LATENCY</TableCell>
                        <TableCell>SUCCESS</TableCell>
                        <TableCell>STATUS</TableCell>
                        <TableCell align="right">ACTIONS</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {channelOverview.map((row) => (
                        <TableRow key={row.name} hover>
                          <TableCell sx={{ fontWeight: 700 }}>{row.name}</TableCell>
                          <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{row.type}</TableCell>
                          <TableCell>{row.volume}</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>{row.share}</TableCell>
                          <TableCell>{row.latency}</TableCell>
                          <TableCell sx={{ color: 'success.main', fontWeight: 700 }}>{row.successRate}</TableCell>
                          <TableCell>
                            <Chip 
                              label={row.status} 
                              size="small" 
                              color="success" 
                              sx={{ fontWeight: 800, fontSize: '0.65rem', height: 20 }} 
                            />
                          </TableCell>
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

            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Typography variant="subtitle1" fontWeight="800" sx={{ mb: 2 }}>
                  CHANNEL VOLUME BREAKDOWN
                </Typography>
                <Stack spacing={2.5}>
                  <Box>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="body2" fontWeight="700">USSD</Typography>
                      <Typography variant="body2" fontWeight="800" color="primary.main">44%</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={44} sx={{ height: 8, borderRadius: 4 }} />
                  </Box>
                  <Box>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="body2" fontWeight="700">SMS (8008)</Typography>
                      <Typography variant="body2" fontWeight="800" color="info.main">22%</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={22} color="info" sx={{ height: 8, borderRadius: 4 }} />
                  </Box>
                  <Box>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="body2" fontWeight="700">IVR Voice (0800)</Typography>
                      <Typography variant="body2" fontWeight="800" color="warning.main">17%</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={17} color="warning" sx={{ height: 8, borderRadius: 4 }} />
                  </Box>
                  <Box>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="body2" fontWeight="700">Mobile App</Typography>
                      <Typography variant="body2" fontWeight="800" color="secondary.main">11%</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={11} color="secondary" sx={{ height: 8, borderRadius: 4 }} />
                  </Box>
                  <Box>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="body2" fontWeight="700">Web Portal</Typography>
                      <Typography variant="body2" fontWeight="800" color="success.main">6%</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={6} color="success" sx={{ height: 8, borderRadius: 4 }} />
                  </Box>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* TAB 1: USSD */}
        {activeTab === 1 && (
          <Card sx={{ p: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle1" fontWeight="800">
                  USSD GATEWAY TELEMETRY
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  High-speed low-bandwidth mobile financial dispute intake protocol
                </Typography>
              </Box>
              <Chip label="MTN & Airtel Interconnect: ONLINE" color="success" size="small" sx={{ fontWeight: 800 }} />
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">ACTIVE USSD SESSIONS</Typography>
                  <Typography variant="h5" fontWeight="800" sx={{ mt: 0.5 }}>342</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">AVG DURATION</Typography>
                  <Typography variant="h5" fontWeight="800" sx={{ mt: 0.5 }}>32 sec</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">COMPLETION RATE</Typography>
                  <Typography variant="h5" fontWeight="800" color="success.main" sx={{ mt: 0.5 }}>92.4%</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">TELCO TIMEOUTS</Typography>
                  <Typography variant="h5" fontWeight="800" color="warning.main" sx={{ mt: 0.5 }}>1.8%</Typography>
                </Paper>
              </Grid>
            </Grid>

            <Typography variant="subtitle2" fontWeight="800" sx={{ mb: 1.5 }}>
              RECENT USSD DISPUTE INTAKE LOGS
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>TELECOM NETWORK</TableCell>
                    <TableCell>SHORTCODE</TableCell>
                    <TableCell>MENU PROGRESSION</TableCell>
                    <TableCell>DURATION</TableCell>
                    <TableCell>TIMESTAMP</TableCell>
                    <TableCell>RESULT</TableCell>
                    <TableCell align="right">ACTIONS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ussdLogs.map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{log.telco}</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace' }}>{log.code}</TableCell>
                      <TableCell>{log.steps}</TableCell>
                      <TableCell>{log.duration}</TableCell>
                      <TableCell>{log.time}</TableCell>
                      <TableCell>
                        <Chip 
                          label={log.status} 
                          size="small" 
                          color={log.status === 'Submitted' ? 'success' : 'warning'} 
                          sx={{ fontWeight: 800, fontSize: '0.65rem' }} 
                        />
                      </TableCell>
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
        )}

        {/* TAB 2: SMS */}
        {activeTab === 2 && (
          <Card sx={{ p: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle1" fontWeight="800">
                  SMS INTAKE PROTOCOL (Shortcode 8008)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Automated keyword parsing & dispute classification engine
                </Typography>
              </Box>
              <Chip label="SMS Gateway: OPERATIONAL" color="success" size="small" sx={{ fontWeight: 800 }} />
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">SMS RECEIVED TODAY</Typography>
                  <Typography variant="h5" fontWeight="800" sx={{ mt: 0.5 }}>1,240</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">AUTO-ACK SENT</Typography>
                  <Typography variant="h5" fontWeight="800" color="success.main" sx={{ mt: 0.5 }}>99.8%</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">KEYWORD MATCH RATE</Typography>
                  <Typography variant="h5" fontWeight="800" color="info.main" sx={{ mt: 0.5 }}>96.4%</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">FAILED DELIVERY</Typography>
                  <Typography variant="h5" fontWeight="800" color="error.main" sx={{ mt: 0.5 }}>0.2%</Typography>
                </Paper>
              </Grid>
            </Grid>

            <Typography variant="subtitle2" fontWeight="800" sx={{ mb: 1.5 }}>
              INCOMING SMS PARSER STREAM
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>SENDER MASK</TableCell>
                    <TableCell>CARRIER</TableCell>
                    <TableCell>MATCHED KEYWORD</TableCell>
                    <TableCell>EXTRACTED MESSAGE TEXT</TableCell>
                    <TableCell>INGEST STATUS</TableCell>
                    <TableCell align="right">ACTIONS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {smsLogs.map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell sx={{ fontFamily: 'monospace' }}>{log.sender}</TableCell>
                      <TableCell>{log.carrier}</TableCell>
                      <TableCell><Chip label={log.keyword} size="small" color="primary" sx={{ fontWeight: 800, fontSize: '0.65rem' }} /></TableCell>
                      <TableCell sx={{ fontSize: '0.82rem' }}>{log.text}</TableCell>
                      <TableCell><Chip label={log.status} size="small" color="success" sx={{ fontWeight: 800, fontSize: '0.65rem' }} /></TableCell>
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
        )}

        {/* TAB 3: IVR */}
        {activeTab === 3 && (
          <Card sx={{ p: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle1" fontWeight="800">
                  IVR VOICE DESK TELEMETRY (Toll-Free Hotline 0800-283-78)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Voice bot speech-to-text intake supporting English, Luganda, Swahili, and Runyankole
                </Typography>
              </Box>
              <Chip label="IVR SIP Trunk: ONLINE" color="success" size="small" sx={{ fontWeight: 800 }} />
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">CALLS HANDLED TODAY</Typography>
                  <Typography variant="h5" fontWeight="800" sx={{ mt: 0.5 }}>412</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">AVG HOLD TIME</Typography>
                  <Typography variant="h5" fontWeight="800" color="success.main" sx={{ mt: 0.5 }}>14 sec</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">AI VOICE BOT INTAKE</Typography>
                  <Typography variant="h5" fontWeight="800" color="info.main" sx={{ mt: 0.5 }}>82.5%</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">HUMAN OFFICER ESCALATION</Typography>
                  <Typography variant="h5" fontWeight="800" color="warning.main" sx={{ mt: 0.5 }}>17.5%</Typography>
                </Paper>
              </Grid>
            </Grid>

            <Typography variant="subtitle2" fontWeight="800" sx={{ mb: 1.5 }}>
              LIVE IVR CALL SESSION LOGS
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>CALLER MASK</TableCell>
                    <TableCell>DETECTED LANGUAGE</TableCell>
                    <TableCell>DURATION</TableCell>
                    <TableCell>QUEUE WAIT</TableCell>
                    <TableCell>HANDLED BY</TableCell>
                    <TableCell>OUTCOME</TableCell>
                    <TableCell align="right">ACTIONS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ivrLogs.map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell sx={{ fontFamily: 'monospace' }}>{log.caller}</TableCell>
                      <TableCell>{log.language}</TableCell>
                      <TableCell>{log.duration}</TableCell>
                      <TableCell>{log.waitTime}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{log.agent}</TableCell>
                      <TableCell><Chip label={log.resolution} size="small" color="primary" sx={{ fontWeight: 800, fontSize: '0.65rem' }} /></TableCell>
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
        )}

        {/* TAB 4: MOBILE APP */}
        {activeTab === 4 && (
          <Card sx={{ p: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle1" fontWeight="800">
                  MOBILE APP TELEMETRY (Android & iOS v2.4.1)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Native consumer dispute portal with offline draft sync and document attachment support
                </Typography>
              </Box>
              <Chip label="Mobile API Gateway: HEALTHY" color="success" size="small" sx={{ fontWeight: 800 }} />
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">ACTIVE USERS</Typography>
                  <Typography variant="h5" fontWeight="800" sx={{ mt: 0.5 }}>8,420</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">CRASH-FREE RATE</Typography>
                  <Typography variant="h5" fontWeight="800" color="success.main" sx={{ mt: 0.5 }}>99.85%</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">API LATENCY</Typography>
                  <Typography variant="h5" fontWeight="800" color="info.main" sx={{ mt: 0.5 }}>112 ms</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">PUSH OPT-IN</Typography>
                  <Typography variant="h5" fontWeight="800" color="secondary.main" sx={{ mt: 0.5 }}>84.2%</Typography>
                </Paper>
              </Grid>
            </Grid>

            <Typography variant="subtitle2" fontWeight="800" sx={{ mb: 1.5 }}>
              MOBILE API REQUEST PAYLOAD TELEMETRY
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>PLATFORM</TableCell>
                    <TableCell>DEVICE MODEL</TableCell>
                    <TableCell>APP VERSION</TableCell>
                    <TableCell>ACTION / PAYLOAD</TableCell>
                    <TableCell>RESPONSE TIME</TableCell>
                    <TableCell>STATUS</TableCell>
                    <TableCell align="right">ACTIONS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appLogs.map((log, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{log.platform}</TableCell>
                      <TableCell>{log.device}</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace' }}>{log.appVer}</TableCell>
                      <TableCell>{log.payload}</TableCell>
                      <TableCell>{log.responseTime}</TableCell>
                      <TableCell><Chip label={log.status} size="small" color="success" sx={{ fontWeight: 800, fontSize: '0.65rem' }} /></TableCell>
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
        )}

        {/* TAB 5: WEB PORTAL */}
        {activeTab === 5 && (
          <Card sx={{ p: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle1" fontWeight="800">
                  PUBLIC WEB PORTAL TELEMETRY (https://ctdru.ug)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Institutional web portal for public consumer claims submission & case status tracking
                </Typography>
              </Box>
              <Chip label="SSL TLS 1.3: SECURE" color="success" size="small" sx={{ fontWeight: 800 }} />
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">DAILY VISITORS</Typography>
                  <Typography variant="h5" fontWeight="800" sx={{ mt: 0.5 }}>3,150</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">FORM CONVERSIONS</Typography>
                  <Typography variant="h5" fontWeight="800" color="success.main" sx={{ mt: 0.5 }}>14.2%</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">CAPTCHA PASS RATE</Typography>
                  <Typography variant="h5" fontWeight="800" color="info.main" sx={{ mt: 0.5 }}>98.9%</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">WAF SECURITY BLOCKS</Typography>
                  <Typography variant="h5" fontWeight="800" color="warning.main" sx={{ mt: 0.5 }}>24</Typography>
                </Paper>
              </Grid>
            </Grid>

            <Typography variant="subtitle2" fontWeight="800" sx={{ mb: 1.5 }}>
              WEB PORTAL SESSION INGEST LOGS
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>USER BROWSER / OS</TableCell>
                    <TableCell>IP REGION</TableCell>
                    <TableCell>CAPTCHA</TableCell>
                    <TableCell>TIME ON PAGE</TableCell>
                    <TableCell>RESULT</TableCell>
                    <TableCell align="right">ACTIONS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {webLogs.map((log) => (
                    <TableRow key={log.session} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{log.browser}</TableCell>
                      <TableCell>{log.ipRegion}</TableCell>
                      <TableCell><Chip label={log.captcha} size="small" color="success" sx={{ fontWeight: 800, fontSize: '0.65rem' }} /></TableCell>
                      <TableCell>{log.duration}</TableCell>
                      <TableCell><Chip label={log.result} size="small" color="primary" sx={{ fontWeight: 800, fontSize: '0.65rem' }} /></TableCell>
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
        )}

        {/* Global Action Menu for Channels */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleCloseMenu}
          PaperProps={{ sx: { borderRadius: 2, minWidth: 150 } }}
        >
          <MenuItem onClick={handleCloseMenu} sx={{ fontSize: '0.82rem' }}>
            <ViewIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} /> View Telemetry
          </MenuItem>
          <MenuItem onClick={handleCloseMenu} sx={{ fontSize: '0.82rem', color: 'error.main' }}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Purge Log
          </MenuItem>
        </Menu>

      </Box>
    </Box>
  );
};

export default ChannelsPage;
