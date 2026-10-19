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
  Tabs,
  Tab,
  Drawer,
  TextField,
  Divider,
  IconButton,
  useTheme
} from '@mui/material';
import {
  ReportProblem as EscalationIcon,
  Shield as PiiIcon,
  CheckCircleOutline as ResolvedIcon,
  HourglassEmpty as OpenIcon,
  Visibility as ViewIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import Sidebar from '../Layout/Sidebar';
import StatCard from './StatCard';
import { tokens } from '../../theme/tokens';
import { getEscalations, updateEscalation, getPiiComplianceStats } from '../services/api';

const STATUS_TABS = ['all', 'open', 'in_review', 'resolved'];

const REASON_LABELS = {
  low_confidence: 'Low intent confidence',
  unmapped_intent: 'Unmapped intent',
  sensitive_topic: 'Sensitive topic',
  user_requested_human: 'User asked for a human',
  guardrail_refusal: 'Guardrail refusal',
  other: 'Other',
};

const statusColor = (status) => {
  if (status === 'resolved') return 'success';
  if (status === 'in_review') return 'warning';
  return 'default';
};

const EscalationsPage = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [escalations, setEscalations] = useState([]);
  const [piiStats, setPiiStats] = useState(null);
  const [selected, setSelected] = useState(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [saving, setSaving] = useState(false);

  // Always fetch the full, unfiltered list - the status tabs filter it
  // client-side (see visibleEscalations below). Fetching per-tab from the
  // server instead would make the stat cards wrong: whichever tab is
  // active, the other two statuses would read 0 because the list they're
  // counted from had already been filtered down to just the active one.
  const fetchData = async () => {
    setLoading(true);
    try {
      const [escRes, piiRes] = await Promise.all([
        getEscalations().catch(() => []),
        getPiiComplianceStats().catch(() => null),
      ]);
      setEscalations(Array.isArray(escRes) ? escRes : []);
      if (piiRes && typeof piiRes === 'object') setPiiStats(piiRes);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const openCount = escalations.filter((e) => e.status === 'open').length;
  const inReviewCount = escalations.filter((e) => e.status === 'in_review').length;
  const resolvedCount = escalations.filter((e) => e.status === 'resolved').length;
  const visibleEscalations =
    activeTab === 'all' ? escalations : escalations.filter((e) => e.status === activeTab);

  const handleOpenDetail = (escalation) => {
    setSelected(escalation);
    setNotesDraft(escalation.officer_notes || '');
  };

  const handleCloseDetail = () => {
    setSelected(null);
    setNotesDraft('');
  };

  const handleTransition = async (newStatus) => {
    if (!selected) return;
    setSaving(true);
    try {
      const updated = await updateEscalation(selected.escalation_id || selected.id, {
        status: newStatus,
        officer_notes: notesDraft,
      });
      setEscalations((prev) =>
        prev.map((e) => (e.escalation_id === updated.escalation_id ? { ...e, ...updated } : e))
      );
      setSelected(updated);
    } catch (e) {
      console.error('Failed to update escalation:', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight="900" sx={{ letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <EscalationIcon color="primary" fontSize="large" /> Escalations & Compliance
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Conversations Wakilibot's guardrail layer could not resolve on its own, queued for CTDR-U review —
            plus a compliance view of the PII redaction screen applied before anything is stored.
          </Typography>
        </Box>

        {loading && <LinearProgress sx={{ mb: 3, borderRadius: 2, height: 4 }} />}

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Open"
              value={openCount}
              hint="Awaiting first review"
              icon={<OpenIcon fontSize="small" />}
              accent={tokens.danger}
              accentSoft="rgba(155, 44, 44, 0.1)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="In review"
              value={inReviewCount}
              hint="Claimed by an officer"
              icon={<EscalationIcon fontSize="small" />}
              accent={tokens.gold}
              accentSoft="rgba(184, 134, 11, 0.12)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Resolved"
              value={resolvedCount}
              hint="Closed out by CTDR-U"
              icon={<ResolvedIcon fontSize="small" />}
              accent={tokens.success}
              accentSoft="rgba(47, 107, 79, 0.12)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="PII redactions"
              value={piiStats?.total_redactions ?? 0}
              hint={
                piiStats
                  ? `${piiStats.records_with_redactions ?? 0} of ${piiStats.total_records_screened ?? 0} records screened`
                  : 'No compliance data yet'
              }
              icon={<PiiIcon fontSize="small" />}
              accent={tokens.navyMid}
              accentSoft="rgba(20, 52, 92, 0.1)"
            />
          </Grid>
        </Grid>

        <Card sx={{ p: 3 }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="subtitle1" fontWeight="800">ESCALATION QUEUE</Typography>
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              sx={{ minHeight: 0 }}
            >
              {STATUS_TABS.map((s) => (
                <Tab key={s} value={s} label={s.replace('_', ' ')} sx={{ minHeight: 0, py: 0.5, textTransform: 'capitalize' }} />
              ))}
            </Tabs>
          </Box>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>CONVERSATION</TableCell>
                  <TableCell>REASON</TableCell>
                  <TableCell>CHANNEL</TableCell>
                  <TableCell>LANGUAGE</TableCell>
                  <TableCell>CONFIDENCE</TableCell>
                  <TableCell>STATUS</TableCell>
                  <TableCell align="right">ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleEscalations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No escalations in this view yet.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleEscalations.map((e) => (
                    <TableRow key={e.escalation_id || e.id} hover>
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        {(e.conversation_id || '').slice(0, 12) || '—'}
                      </TableCell>
                      <TableCell>{REASON_LABELS[e.reason] || e.reason || 'Other'}</TableCell>
                      <TableCell sx={{ textTransform: 'capitalize' }}>{e.channel || '—'}</TableCell>
                      <TableCell sx={{ textTransform: 'capitalize' }}>{e.language || '—'}</TableCell>
                      <TableCell>{e.confidence != null ? `${Math.round(e.confidence * 100)}%` : '—'}</TableCell>
                      <TableCell>
                        <Chip
                          label={(e.status || 'open').replace('_', ' ')}
                          size="small"
                          color={statusColor(e.status)}
                          sx={{ fontWeight: 700, fontSize: '0.65rem', textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleOpenDetail(e)}>
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        <Drawer anchor="right" open={Boolean(selected)} onClose={handleCloseDetail} PaperProps={{ sx: { width: { xs: '100%', sm: 440 }, p: 3 } }}>
          {selected && (
            <Stack spacing={2.5}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h6" fontWeight="800">Escalation Review</Typography>
                <IconButton size="small" onClick={handleCloseDetail}><CloseIcon fontSize="small" /></IconButton>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">CONVERSATION ID</Typography>
                <Typography variant="body1" fontFamily="monospace" fontWeight="700">{selected.conversation_id || 'N/A'}</Typography>
              </Box>

              <Stack direction="row" spacing={1}>
                <Chip label={REASON_LABELS[selected.reason] || selected.reason} size="small" color="error" sx={{ fontWeight: 700 }} />
                <Chip label={(selected.status || 'open').replace('_', ' ')} size="small" color={statusColor(selected.status)} sx={{ fontWeight: 700, textTransform: 'capitalize' }} />
              </Stack>

              <Divider />

              <Box>
                <Typography variant="caption" color="text.secondary">CLASSIFIED INTENT</Typography>
                <Typography variant="body1" fontWeight="700">{selected.intent || 'Unclassified'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">MESSAGE EXCERPT (PII-screened)</Typography>
                <Typography variant="body2">{selected.message_excerpt || 'No excerpt provided.'}</Typography>
              </Box>

              <Divider />

              <TextField
                label="Officer notes"
                multiline
                minRows={3}
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                placeholder="What did you find? What action was taken with the provider / consumer?"
              />

              <Stack direction="row" spacing={1}>
                <Button
                  variant={selected.status === 'in_review' ? 'contained' : 'outlined'}
                  disabled={saving}
                  onClick={() => handleTransition('in_review')}
                  fullWidth
                >
                  Claim / In review
                </Button>
                <Button
                  variant={selected.status === 'resolved' ? 'contained' : 'outlined'}
                  color="success"
                  disabled={saving}
                  onClick={() => handleTransition('resolved')}
                  fullWidth
                >
                  Mark resolved
                </Button>
              </Stack>
            </Stack>
          )}
        </Drawer>

      </Box>
    </Box>
  );
};

export default EscalationsPage;
