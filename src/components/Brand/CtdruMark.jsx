import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';
import { tokens, fonts } from '../../theme/tokens';
import ctdruLogo from '../../assets/logo/cropped-CTDR-U-Logo-1-150x150.png';

/**
 * CTDRU mark + wordmark used on login and sidebar (matches Wakilibot-web).
 */
const CtdruMark = ({
  size = 40,
  inverted = false,
  title = 'CTDRU Portal',
  subtitle = 'Consumer Protection HQ',
  showSubtitle = true,
}) => {
  const textColor = inverted ? tokens.white : tokens.navy;
  const subColor = inverted ? 'rgba(255,255,255,0.72)' : tokens.muted;

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5 }}>
      <Avatar
        src={ctdruLogo}
        alt="CTDRU"
        sx={{
          width: size,
          height: size,
          bgcolor: tokens.white,
          boxShadow: inverted
            ? '0 4px 14px rgba(0, 0, 0, 0.28)'
            : '0 6px 18px rgba(11, 31, 58, 0.18)',
          '& .MuiAvatar-img': { objectFit: 'cover' },
        }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
        <Typography
          component="span"
          sx={{
            fontFamily: fonts.display,
            fontWeight: 650,
            fontSize: Math.max(15, size * 0.38),
            color: textColor,
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </Typography>
        {showSubtitle && (
          <Typography
            component="span"
            sx={{
              fontSize: Math.max(10, size * 0.2),
              fontWeight: 500,
              color: subColor,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default CtdruMark;
