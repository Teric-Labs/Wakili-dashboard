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
import { getAiAgentOverview, getAiAgentIntentPrecision, getAiAgentSessions } from '../services/api';

const FALLBACK_SESSIONS = [
  {
    id: 'BOT-80921',
    channel: 'Voice Call',
    language: 'Luganda',
    intent: 'wrong_number_transfer',
    confidence: '98.4%',
    sentiment: 'Positive',
    duration: '2m 14s',
    status: 'Auto-Resolved',
    transcript: 'User: Nsindise efinia zange ku namba emkyamu. Wakilibot: Nsanyuse okukuyamba. Nkoze okusaba kwo okukwata ku kuddiza ssente ezo.'
  },
  {
    id: 'BOT-80920',
    channel: 'Text Chat',
    language: 'English',
    intent: 'fraud_sim_swap',
    confidence: '96.2%',
    sentiment: 'Urgent',
    duration: '1m 45s',
    status: 'Escalated to Officer',
    transcript: 'User: My SIM card lost network and 800,000 UGX was withdrawn without OTP. Wakilibot: High-priority security incident logged. Connecting you to CTDRU Fraud Officer.'
  },
  {
    id: 'BOT-80919',
    channel: 'Voice Call',
    language: 'Swahili',
    intent: 'airtime_deduction',
    confidence: '94.8%',
    sentiment: 'Neutral',
    duration: '3m 02s',
    status: 'Auto-Resolved',
    transcript: 'User: Salio langu la airtime limepungua bila sababu. Wakilibot: Tumepokea dai lako. Imesajiliwa namba ya kumbukumbu.'
  },
  {
    id: 'BOT-80918',
    channel: 'Text Chat',
    language: 'English',
    intent: 'agent_dispute',
    confidence: '97.1%',
    sentiment: 'Positive',
    duration: '1m 12s',
    status: 'Auto-Resolved',
    transcript: 'User: Agent charged 5,000 extra fee. Wakilibot: Tariff violation registered under Mobile Money Agent Guidelines.'
  }
];

const FALLBACK_INTENTS = [
  { intent: 'Wrong Number Transfer', accuracy: 98.4, color: '#0284C7' },
  { intent: 'SIM Swap & Fraud', accuracy: 96.2, color: '#0F172A' },
  { intent: 'Airtime Deductions', accuracy: 94.8, color: '#10B981' },
  { intent: 'Agent Tariff Dispute', accuracy: 97.1, color: '#64748B' }
];

const AiAgentPage = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [targetSession, setTargetSession] = useState(null);

  const [aiSessions, setAiSessions] = useState(FALLBACK_SESSIONS);
  const [intentAccuracyData, setIntentAccuracyData] = useState(FALLBACK_INTENTS);
  const [aiOverview, setAiOverview] = useState(null);

  React.useEffect(() => {
    fetchBackendAiData();
  }, []);

  const fetchBackendAiData = async () => {
    setLoading(true);
    try {
      const [overviewRes, intentsRes, sessionsRes] = await Promise.all([
        getAiAgentOverview().catch(() => null),
        getAiAgentIntentPrecision().catch(() => null),
        getAiAgentSessions().catch(() => null)
      ]);
      if (overviewRes) setAiOverview(overviewRes);
      if (intentsRes) setIntentAccuracyData(intentsRes);
      if (sessionsRes) setAiSessions(sessionsRes);
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

        {/* 4 Summary Telemetry Cards */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2.5, bgcolor: theme.palette.background.paper }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">
                    AI RESOLUTION RATE
                  </Typography>
                  <Typography variant="h4" fontWeight="800" sx={{ my: 0.5, color: 'success.main' }}>
                    {aiOverview?.ai_resolution_rate || '84.2%'}
                  </Typography>
                  <Typography variant="caption" color="success.main" fontWeight="700">
                    {aiOverview?.human_escalation_rate || '15.8%'} Escalated to Human
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
                    NLP INTENT CONFIDENCE
                  </Typography>
                  <Typography variant="h4" fontWeight="800" sx={{ my: 0.5 }}>
                    {aiOverview?.nlp_intent_confidence || '96.8%'}
                  </Typography>
                  <Typography variant="caption" color="info.main" fontWeight="700">
                    {aiOverview?.languages_supported_count || 4} Languages Supported
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(56, 189, 248, 0.12)', color: 'primary.main', width: 44, height: 44 }}>
                  <IntentIcon fontSize="small" />
                </Avatar>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2.5, bgcolor: theme.palette.background.paper }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">
                    VOICE CHAT SESSIONS
                  </Typography>
                  <Typography variant="h4" fontWeight="800" sx={{ my: 0.5 }}>
                    {aiOverview?.voice_chat_sessions_count?.toLocaleString() || '18,920'}
                  </Typography>
                  <Typography variant="caption" color="primary.main" fontWeight="700">
                    Luganda & English Top
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(139, 92, 246, 0.12)', color: 'secondary.main', width: 44, height: 44 }}>
                  <VoiceIcon fontSize="small" />
                </Avatar>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2.5, bgcolor: theme.palette.background.paper }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">
                    AVG BOT RESPONSE TIME
                  </Typography>
                  <Typography variant="h4" fontWeight="800" sx={{ my: 0.5 }}>
                    {aiOverview?.avg_response_time || '0.8 sec'}
                  </Typography>
                  <Typography variant="caption" color="success.main" fontWeight="700">
                    Sub-second Latency
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(245, 158, 11, 0.12)', color: 'warning.main', width: 44, height: 44 }}>
                  <TrendingIcon fontSize="small" />
                </Avatar>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* Intent Accuracy Bar Chart */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight="800" sx={{ mb: 1 }}>
                INTENT CLASSIFICATION PRECISION BY DISPUTE CATEGORY
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                Evaluation metrics for Wakilibot zero-shot intent classifier
              </Typography>
              <Box sx={{ width: '100%', height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={intentAccuracyData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <XAxis type="number" domain={[0, 100]} stroke={theme.palette.text.secondary} fontSize={11} />
                    <YAxis dataKey="intent" type="category" stroke={theme.palette.text.secondary} fontSize={11} width={130} />
                    <ChartTooltip 
                      contentStyle={{ 
                        backgroundColor: theme.palette.background.paper, 
                        borderColor: theme.palette.divider,
                        borderRadius: 8
                      }} 
                    />
                    <Bar dataKey="accuracy" radius={[0, 6, 6, 0]}>
                      {intentAccuracyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, height: '100%' }}>
              <Typography variant="subtitle1" fontWeight="800" sx={{ mb: 2 }}>
                CITIZEN LANGUAGE DISTRIBUTION
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography variant="body2" fontWeight="700">Luganda</Typography>
                    <Typography variant="body2" fontWeight="800" color="primary.main">48%</Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={48} sx={{ height: 8, borderRadius: 4 }} />
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography variant="body2" fontWeight="700">English</Typography>
                    <Typography variant="body2" fontWeight="800" color="info.main">34%</Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={34} color="info" sx={{ height: 8, borderRadius: 4 }} />
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography variant="body2" fontWeight="700">Swahili</Typography>
                    <Typography variant="body2" fontWeight="800" color="warning.main">12%</Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={12} color="warning" sx={{ height: 8, borderRadius: 4 }} />
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography variant="body2" fontWeight="700">Runyankole / Local Dialects</Typography>
                    <Typography variant="body2" fontWeight="800" color="secondary.main">6%</Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={6} color="secondary" sx={{ height: 8, borderRadius: 4 }} />
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* AI Conversation Sessions Stream Table */}
        <Card sx={{ p: 3 }}>
          <Typography variant="subtitle1" fontWeight="800" sx={{ mb: 2 }}>
            REAL-TIME WAKILIBOT SESSION STREAM
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
                {aiSessions.map((session) => (
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
                    <TableCell><Chip label={session.intent.replace(/_/g, ' ')} size="small" color="primary" variant="outlined" sx={{ fontWeight: 800, fontSize: '0.65rem' }} /></TableCell>
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
                ))}
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
