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
  GraphicEq as SignalIcon,
  TrendingUp as TrendingIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import Sidebar from '../Layout/Sidebar';
import StatCard from './StatCard';
import { tokens } from '../../theme/tokens';
import { getChannelsOverview, getUssdLogs, getSmsLogs, getIvrLogs } from '../services/api';

const parseVolume = (value) => parseInt(String(value || '0').replace(/,/g, ''), 10) || 0;

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

  const volumeBreakdown = (channelOverview || []).map((row) => ({
    name: row.name,
    share: parseInt(String(row.share || '0').replace('%', ''), 10) || 0,
    volume: parseVolume(row.volume),
  }));

  const findChannel = (needle) =>
    (channelOverview || []).find((c) => String(c.name || '').toLowerCase().includes(needle));

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

        {(() => {
          const totalVolume = Array.isArray(channelOverview) && channelOverview.length > 0
            ? channelOverview.reduce((acc, c) => acc + parseVolume(c.volume), 0)
            : ussdLogs.length + smsLogs.length + ivrLogs.length;
          const ranked = [...(channelOverview || [])].sort((a, b) => parseVolume(b.volume) - parseVolume(a.volume));
          const top = ranked[0];
          const onlineCount = (channelOverview || []).filter((c) => String(c.status || '').toUpperCase() === 'ONLINE').length;
          const totalChannels = (channelOverview || []).length;
          return (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  label="Session volume"
                  value={totalVolume.toLocaleString()}
                  hint="Conversations across intake channels"
                  icon={<TrendingIcon fontSize="small" />}
                  accent={tokens.navy}
                  accentSoft="rgba(11, 31, 58, 0.08)"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  label="Top channel"
                  value={top?.name?.replace(/\s*\(.*\)/, '') || '—'}
                  hint={top ? `${top.share || '0%'} of sessions` : 'No channel traffic yet'}
                  icon={<UssdIcon fontSize="small" />}
                  accent={tokens.gold}
                  accentSoft="rgba(184, 134, 11, 0.12)"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  label="Channel logs"
                  value={(ussdLogs.length + smsLogs.length + ivrLogs.length).toLocaleString()}
                  hint={`${ussdLogs.length} USSD · ${smsLogs.length} SMS · ${ivrLogs.length} IVR`}
                  icon={<SignalIcon fontSize="small" />}
                  accent={tokens.navyMid}
                  accentSoft="rgba(20, 52, 92, 0.1)"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  label="Channels online"
                  value={totalChannels ? `${onlineCount}/${totalChannels}` : '0/0'}
                  hint={totalChannels ? 'From live conversation attribution' : 'Awaiting traffic'}
                  icon={<OnlineIcon fontSize="small" />}
                  accent={tokens.success}
                  accentSoft="rgba(47, 107, 79, 0.12)"
                />
              </Grid>
            </Grid>
          );
        })()}

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
                      {channelOverview.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                            <Typography variant="body2" color="text.secondary">No channel overview data yet</Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        channelOverview.map((row) => (
                          <TableRow key={row.name} hover>
                            <TableCell sx={{ fontWeight: 700 }}>{row.name}</TableCell>
                            <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{row.type}</TableCell>
                            <TableCell>{row.volume}</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>{row.share}</TableCell>
                            <TableCell>{row.latency || '—'}</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>{row.successRate || '—'}</TableCell>
                            <TableCell>
                              <Chip
                                label={row.status}
                                size="small"
                                color={String(row.status).toUpperCase() === 'ONLINE' ? 'success' : 'default'}
                                sx={{ fontWeight: 700, fontSize: '0.65rem', height: 20 }}
                              />
                            </TableCell>
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

            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 2 }}>
                  Channel volume breakdown
                </Typography>
                <Stack spacing={2.5}>
                  {volumeBreakdown.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">No channel traffic yet</Typography>
                  ) : (
                    volumeBreakdown.map((row) => (
                      <Box key={row.name}>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                          <Typography variant="body2" fontWeight="600">{row.name}</Typography>
                          <Typography variant="body2" fontWeight="700" sx={{ color: tokens.navy }}>
                            {row.share}% · {row.volume}
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(100, row.share)}
                          sx={{ height: 7, borderRadius: 1, bgcolor: tokens.sand, '& .MuiLinearProgress-bar': { bgcolor: tokens.navy } }}
                        />
                      </Box>
                    ))
                  )}
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
                  <Typography variant="caption" color="text.secondary" fontWeight="700">USSD SESSIONS</Typography>
                  <Typography variant="h5" fontWeight="800" sx={{ mt: 0.5 }}>
                    {parseVolume(findChannel('ussd')?.volume) || ussdLogs.length}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">SHARE OF TRAFFIC</Typography>
                  <Typography variant="h5" fontWeight="800" sx={{ mt: 0.5 }}>
                    {findChannel('ussd')?.share || '0%'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">SUCCESS RATE</Typography>
                  <Typography variant="h5" fontWeight="800" color="success.main" sx={{ mt: 0.5 }}>
                    {findChannel('ussd')?.successRate || '—'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">LOG ENTRIES</Typography>
                  <Typography variant="h5" fontWeight="800" sx={{ mt: 0.5 }}>{ussdLogs.length}</Typography>
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
                  {ussdLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">No USSD logs recorded yet</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    ussdLogs.map((log) => (
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
                            sx={{ fontWeight: 700, fontSize: '0.65rem' }}
                          />
                        </TableCell>
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
                  <Typography variant="caption" color="text.secondary" fontWeight="700">SMS SESSIONS</Typography>
                  <Typography variant="h5" fontWeight="800" sx={{ mt: 0.5 }}>
                    {parseVolume(findChannel('sms')?.volume) || smsLogs.length}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">SHARE OF TRAFFIC</Typography>
                  <Typography variant="h5" fontWeight="800" sx={{ mt: 0.5 }}>
                    {findChannel('sms')?.share || '0%'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">SUCCESS RATE</Typography>
                  <Typography variant="h5" fontWeight="800" color="success.main" sx={{ mt: 0.5 }}>
                    {findChannel('sms')?.successRate || '—'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">LOG ENTRIES</Typography>
                  <Typography variant="h5" fontWeight="800" sx={{ mt: 0.5 }}>{smsLogs.length}</Typography>
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
                  {smsLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">No SMS logs recorded yet</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    smsLogs.map((log) => (
                      <TableRow key={log.id} hover>
                        <TableCell sx={{ fontFamily: 'monospace' }}>{log.sender}</TableCell>
                        <TableCell>{log.carrier}</TableCell>
                        <TableCell><Chip label={log.keyword} size="small" color="primary" sx={{ fontWeight: 700, fontSize: '0.65rem' }} /></TableCell>
                        <TableCell sx={{ fontSize: '0.82rem' }}>{log.text}</TableCell>
                        <TableCell><Chip label={log.status} size="small" color="success" sx={{ fontWeight: 700, fontSize: '0.65rem' }} /></TableCell>
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
                  <Typography variant="caption" color="text.secondary" fontWeight="700">IVR SESSIONS</Typography>
                  <Typography variant="h5" fontWeight="800" sx={{ mt: 0.5 }}>
                    {parseVolume(findChannel('ivr')?.volume) || ivrLogs.length}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">SHARE OF TRAFFIC</Typography>
                  <Typography variant="h5" fontWeight="800" sx={{ mt: 0.5 }}>
                    {findChannel('ivr')?.share || '0%'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">SUCCESS RATE</Typography>
                  <Typography variant="h5" fontWeight="800" color="success.main" sx={{ mt: 0.5 }}>
                    {findChannel('ivr')?.successRate || '—'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">LOG ENTRIES</Typography>
                  <Typography variant="h5" fontWeight="800" sx={{ mt: 0.5 }}>{ivrLogs.length}</Typography>
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
                  {ivrLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">No IVR logs recorded yet</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    ivrLogs.map((log) => (
                      <TableRow key={log.id} hover>
                        <TableCell sx={{ fontFamily: 'monospace' }}>{log.caller}</TableCell>
                        <TableCell>{log.language}</TableCell>
                        <TableCell>{log.duration}</TableCell>
                        <TableCell>{log.waitTime}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{log.agent}</TableCell>
                        <TableCell><Chip label={log.resolution} size="small" color="primary" sx={{ fontWeight: 700, fontSize: '0.65rem' }} /></TableCell>
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
                  <Typography variant="caption" color="text.secondary" fontWeight="700">APP SESSIONS</Typography>
                  <Typography variant="h5" fontWeight="800" sx={{ mt: 0.5 }}>
                    {parseVolume(findChannel('mobile')?.volume)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">SHARE OF TRAFFIC</Typography>
                  <Typography variant="h5" fontWeight="800" sx={{ mt: 0.5 }}>
                    {findChannel('mobile')?.share || '0%'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">SUCCESS RATE</Typography>
                  <Typography variant="h5" fontWeight="800" color="success.main" sx={{ mt: 0.5 }}>
                    {findChannel('mobile')?.successRate || '—'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">STATUS</Typography>
                  <Typography variant="h5" fontWeight="800" sx={{ mt: 0.5 }}>
                    {findChannel('mobile')?.status || 'IDLE'}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 1.5 }}>
              Mobile app session logs
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
              No dedicated mobile app log feed yet — session counts come from conversation channel attribution.
            </Typography>
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
                  <Typography variant="caption" color="text.secondary" fontWeight="700">WEB SESSIONS</Typography>
                  <Typography variant="h5" fontWeight="800" sx={{ mt: 0.5 }}>
                    {parseVolume(findChannel('web')?.volume)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">SHARE OF TRAFFIC</Typography>
                  <Typography variant="h5" fontWeight="800" sx={{ mt: 0.5 }}>
                    {findChannel('web')?.share || '0%'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">SUCCESS RATE</Typography>
                  <Typography variant="h5" fontWeight="800" color="success.main" sx={{ mt: 0.5 }}>
                    {findChannel('web')?.successRate || '—'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">STATUS</Typography>
                  <Typography variant="h5" fontWeight="800" sx={{ mt: 0.5 }}>
                    {findChannel('web')?.status || 'IDLE'}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 1.5 }}>
              Web portal session logs
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
              No dedicated web portal log feed yet — session counts come from conversation channel attribution.
            </Typography>
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
