import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { tokens, fonts } from '../../theme/tokens';

/**
 * Flat institutional KPI tile — border only, no elevation or shadow.
 */
const StatCard = ({
  label,
  value,
  hint,
  icon,
  accent = tokens.navy,
  accentSoft = 'rgba(11, 31, 58, 0.08)',
}) => (
  <Box
    sx={{
      p: 2.25,
      height: '100%',
      bgcolor: tokens.paperElevated,
      border: `1px solid ${tokens.line}`,
      borderRadius: 1,
      boxShadow: 'none !important',
      filter: 'none',
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1.5 }}>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: tokens.muted,
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontFamily: fonts.display,
            fontWeight: 600,
            fontSize: '2rem',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: tokens.navy,
            my: 0.75,
          }}
        >
          {value}
        </Typography>
        {hint ? (
          <Typography
            sx={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: tokens.muted,
              lineHeight: 1.35,
            }}
          >
            {hint}
          </Typography>
        ) : null}
      </Box>
      <Avatar
        sx={{
          width: 42,
          height: 42,
          bgcolor: accentSoft,
          color: accent,
          borderRadius: 1,
          boxShadow: 'none',
        }}
      >
        {icon}
      </Avatar>
    </Box>
  </Box>
);

export default StatCard;
