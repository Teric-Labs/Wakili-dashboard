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
  Paper,
  Drawer,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  useTheme
} from '@mui/material';
import {
  SmartToy as BotIcon,
  RecordVoiceOver as VoiceIcon,
  Chat as ChatIcon,
  Psychology as IntentIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon,
  TrendingUp as TrendingIcon,
  Close as CloseIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  FormatQuote as QuoteIcon
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  Cell
} from 'recharts';
import Sidebar from '../Layout/Sidebar';
import StatCard from './StatCard';
import { tokens } from '../../theme/tokens';
import { getAiAgentOverview, getAiAgentIntentPrecision, getAiAgentSessions, getAiAgentLanguages } from '../services/api';

const AiAgentPage = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [targetSession, setTargetSession] = useState(null);

  const [aiSessions, setAiSessions] = useState([]);
  const [intentAccuracyData, setIntentAccuracyData] = useState([]);
  const [aiOverview, setAiOverview] = useState(null);
  const [languageDistribution, setLanguageDistribution] = useState([]);
  React.useEffect(() => {
    fetchBackendAiData();
  }, []);

  const fetchBackendAiData = async () => {
    setLoading(true);
    try {
      const [overviewRes, intentsRes, sessionsRes, langRes] = await Promise.all([
        getAiAgentOverview().catch(() => null),
        getAiAgentIntentPrecision().catch(() => null),
        getAiAgentSessions().catch(() => null),
        getAiAgentLanguages().catch(() => null)
      ]);
      setAiOverview(overviewRes);
      setIntentAccuracyData(Array.isArray(intentsRes) ? intentsRes : []);
      setAiSessions(Array.isArray(sessionsRes) ? sessionsRes : []);
      if (Array.isArray(langRes) && langRes.length > 0) {
        const LANGUAGE_COLORS = ['primary', 'info', 'warning', 'secondary', 'success', 'error'];
        setLanguageDistribution(
          langRes.map((l, i) => ({
            language: l.language,
            percentage: l.percentage,
            color: LANGUAGE_COLORS[i % LANGUAGE_COLORS.length]
          }))
        );
      } else {
        setLanguageDistribution([]);
      }
    } catch (e) {
      console.error("Backend AI fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchBackendAiData();
  };

  const handleOpenMenu = (event, session) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setTargetSession(session);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setTargetSession(null);
  };

  const handleViewTranscript = () => {
    if (targetSession) {
      setSelectedSession(targetSession);
    }
    handleCloseMenu();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
        
        {/* Header Bar */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight="900" sx={{ letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <BotIcon color="primary" fontSize="large" /> Wakilibot Insights
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              NLP Intent classification, voicechat transcripts, language distribution, and autonomous resolution metrics.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            size="small"
            sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}
          >
            Refresh Insights
          </Button>
        </Box>

        {loading && <LinearProgress sx={{ mb: 3, borderRadius: 2, height: 4 }} />}

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="AI resolution rate"
              value={aiOverview?.ai_resolution_rate || '0%'}
              hint={`${aiOverview?.human_escalation_rate || '0%'} escalated to officers`}
              icon={<CheckIcon fontSize="small" />}
              accent={tokens.success}
              accentSoft="rgba(47, 107, 79, 0.12)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Sessions tracked"
              value={Number(aiOverview?.total_sessions ?? aiSessions.length).toLocaleString()}
              hint={`${aiOverview?.languages_supported_count || languageDistribution.length || 0} languages seen`}
              icon={<IntentIcon fontSize="small" />}
              accent={tokens.navy}
              accentSoft="rgba(11, 31, 58, 0.08)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Voice sessions"
              value={Number(aiOverview?.voice_chat_sessions_count || 0).toLocaleString()}
              hint="IVR / voice channel sessions"
              icon={<VoiceIcon fontSize="small" />}
              accent={tokens.navyMid}
              accentSoft="rgba(20, 52, 92, 0.1)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Avg response time"
              value={aiOverview?.avg_response_time || '—'}
              hint="From live conversation telemetry"
              icon={<TrendingIcon fontSize="small" />}
              accent={tokens.gold}
              accentSoft="rgba(184, 134, 11, 0.12)"
            />
          </Grid>
        </Grid>

        {/* Intent Accuracy Bar Chart */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 1 }}>
                Intent resolution by category
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                % of sessions auto-resolved per intent from live conversations
              </Typography>
              <Box sx={{ width: '100%', height: 240 }}>
                {intentAccuracyData.length === 0 ? (
                  <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="body2" color="text.secondary">No session intent data yet</Typography>
                  </Box>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={intentAccuracyData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                      <XAxis type="number" domain={[0, 100]} stroke={theme.palette.text.secondary} fontSize={11} />
                      <YAxis dataKey="intent" type="category" stroke={theme.palette.text.secondary} fontSize={11} width={130} />
                      <ChartTooltip
                        contentStyle={{
                          backgroundColor: theme.palette.background.paper,
                          borderColor: theme.palette.divider,
                          borderRadius: 8,
                        }}
                      />
                      <Bar dataKey="accuracy" radius={[0, 4, 4, 0]}>
                        {intentAccuracyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || tokens.navy} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, height: '100%' }}>
              <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 2 }}>
                Language distribution
              </Typography>
              <Stack spacing={2}>
                {languageDistribution.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">No language data yet</Typography>
                ) : (
                  languageDistribution.map((lang) => (
                    <Box key={lang.language}>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                        <Typography variant="body2" fontWeight="600">{lang.language}</Typography>
                        <Typography variant="body2" fontWeight="700" sx={{ color: tokens.navy }}>{lang.percentage}%</Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={lang.percentage}
                        sx={{ height: 7, borderRadius: 1, bgcolor: tokens.sand, '& .MuiLinearProgress-bar': { bgcolor: tokens.navy } }}
                      />
                    </Box>
                  ))
                )}
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* AI Conversation Sessions Stream Table */}
        <Card sx={{ p: 3 }}>
          <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 2 }}>
            Recent Wakilibot sessions
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>CHANNEL</TableCell>
                  <TableCell>LANGUAGE</TableCell>
                  <TableCell>DETECTED INTENT</TableCell>
                  <TableCell>CONFIDENCE</TableCell>
                  <TableCell>SENTIMENT</TableCell>
                  <TableCell>DURATION</TableCell>
                  <TableCell>OUTCOME</TableCell>
                  <TableCell align="right">ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {aiSessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No active AI agent sessions recorded.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  aiSessions.map((session) => (
                    <TableRow 
                      key={session.id} 
                      hover 
                      onClick={() => setSelectedSession(session)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell sx={{ fontWeight: 700 }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          {session.channel === 'Voice Call' ? <VoiceIcon fontSize="small" color="primary" /> : <ChatIcon fontSize="small" color="info" />}
                          <Typography variant="body2" fontWeight="700">{session.channel}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{session.language}</TableCell>
                      <TableCell><Chip label={(session.intent || 'General Inquiry').replace(/_/g, ' ')} size="small" color="primary" variant="outlined" sx={{ fontWeight: 800, fontSize: '0.65rem' }} /></TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'success.main' }}>{session.confidence}</TableCell>
                      <TableCell>{session.sentiment}</TableCell>
                      <TableCell>{session.duration}</TableCell>
                      <TableCell>
                        <Chip 
                          label={session.status} 
                          size="small" 
                          color={session.status === 'Auto-Resolved' ? 'success' : 'error'} 
                          sx={{ fontWeight: 800, fontSize: '0.65rem' }} 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={(e) => handleOpenMenu(e, session)}>
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
            PaperProps={{ sx: { borderRadius: 2, minWidth: 160 } }}
          >
            <MenuItem onClick={handleViewTranscript} sx={{ fontSize: '0.82rem' }}>
              <ViewIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} /> View Transcript
            </MenuItem>
          </Menu>
        </Card>

        {/* Transcript Inspection Drawer */}
        <Drawer
          anchor="right"
          open={Boolean(selectedSession)}
          onClose={() => setSelectedSession(null)}
          PaperProps={{ sx: { width: { xs: '100%', sm: 460 }, p: 3, bgcolor: theme.palette.background.paper } }}
        >
          {selectedSession && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="800" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BotIcon color="primary" /> AI Conversation Transcript
                </Typography>
                <IconButton onClick={() => setSelectedSession(null)}><CloseIcon /></IconButton>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">SESSION IDENTIFIER</Typography>
                  <Typography variant="body1" fontFamily="monospace" fontWeight="800">{selectedSession.id}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">CHANNEL & LANGUAGE</Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                    <Chip label={selectedSession.channel} size="small" color="primary" sx={{ fontWeight: 800 }} />
                    <Chip label={selectedSession.language} size="small" color="info" sx={{ fontWeight: 800 }} />
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">DETECTED INTENT & CONFIDENCE</Typography>
                  <Typography variant="subtitle1" fontWeight="800" color="success.main">
                    {selectedSession.intent} ({selectedSession.confidence})
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <QuoteIcon fontSize="small" /> LIVE SPEECH-TO-TEXT TRANSCRIPT
                  </Typography>
                  <Paper sx={{ p: 2, mt: 1, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ lineHeight: 1.6, fontStyle: 'italic' }}>
                      "{selectedSession.transcript}"
                    </Typography>
                  </Paper>
                </Box>
              </Stack>
            </Box>
          )}
        </Drawer>

      </Box>
    </Box>
  );
};

export default AiAgentPage;
