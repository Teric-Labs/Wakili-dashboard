import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
  Divider,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { loginUser, storeAuth } from '../services/api';
import CtdruMark from '../Brand/CtdruMark';
import { tokens, fonts } from '../../theme/tokens';
import ctdruLogo from '../../assets/logo/cropped-CTDR-U-Logo-1-150x150.png';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (!email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Enter a valid work email';
    }
    if (!password) next.password = 'Password is required';
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setIsLoading(true);
    try {
      const response = await loginUser({ email: email.trim(), password });
      storeAuth({ access_token: response.access_token, user: response.user });
      onLogin(response.user);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Incorrect email or password.');
      } else if (err.response?.status === 403) {
        setError('This account does not have CTDRU staff access.');
      } else {
        setError('Sign-in failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
        background: tokens.paper,
      }}
    >
      {/* Brand plane — institutional, not a card */}
      <Box
        sx={{
          position: 'relative',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          px: { md: 6, lg: 8 },
          py: 6,
          color: tokens.white,
          overflow: 'hidden',
          background: `
            radial-gradient(ellipse 80% 60% at 20% 10%, rgba(212, 168, 75, 0.18), transparent 55%),
            radial-gradient(ellipse 70% 50% at 90% 90%, rgba(20, 52, 92, 0.9), transparent 50%),
            linear-gradient(165deg, ${tokens.navy} 0%, #061426 48%, ${tokens.navyMid} 100%)
          `,
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(247, 244, 239, 0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(247, 244, 239, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            pointerEvents: 'none',
            opacity: 0.45,
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <CtdruMark
            size={52}
            inverted
            title="CTDRU Portal"
            subtitle="Consumer Protection HQ"
          />
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 440 }}>
          <Typography
            sx={{
              fontFamily: fonts.display,
              fontWeight: 600,
              fontSize: { md: '2.35rem', lg: '2.75rem' },
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              mb: 2,
            }}
          >
            Secure operations for Uganda’s financial consumer protection.
          </Typography>
          <Typography
            sx={{
              fontSize: '1.05rem',
              lineHeight: 1.65,
              color: 'rgba(247, 244, 239, 0.72)',
              maxWidth: 400,
            }}
          >
            Review disputes, triage fraud alerts, and manage the legal archive —
            reserved for authorized CTDRU officers.
          </Typography>
        </Box>

        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderTop: '1px solid rgba(247, 244, 239, 0.12)',
            pt: 3,
          }}
        >
          <Box
            component="img"
            src={ctdruLogo}
            alt=""
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              bgcolor: tokens.white,
              objectFit: 'cover',
            }}
          />
          <Box>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.04em' }}>
              CENTRE FOR TRANSPARENT DISPUTE RESOLUTION — UGANDA
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: 'rgba(247, 244, 239, 0.55)', mt: 0.25 }}>
              Confidential · Staff use only
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Sign-in panel */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: { xs: 3, sm: 5, md: 6, lg: 8 },
          py: { xs: 5, md: 6 },
          background: `
            linear-gradient(180deg, ${tokens.paperElevated} 0%, ${tokens.paper} 100%)
          `,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 400,
            mx: 'auto',
            animation: 'ctdruLoginIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) both',
            '@keyframes ctdruLoginIn': {
              from: { opacity: 0, transform: 'translateY(14px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 4 }}>
            <CtdruMark
              size={44}
              title="CTDRU Portal"
              subtitle="Staff sign-in"
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <LockOutlinedIcon sx={{ fontSize: 18, color: tokens.gold }} />
            <Typography
              sx={{
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: tokens.muted,
              }}
            >
              Officer access
            </Typography>
          </Box>

          <Typography
            component="h1"
            sx={{
              fontFamily: fonts.display,
              fontWeight: 600,
              fontSize: { xs: '1.85rem', sm: '2.1rem' },
              letterSpacing: '-0.02em',
              color: tokens.navy,
              mb: 0.75,
            }}
          >
            Sign in
          </Typography>
          <Typography sx={{ color: tokens.muted, mb: 3.5, lineHeight: 1.55 }}>
            Use your CTDRU staff credentials to open the operations dashboard.
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2.5,
                borderRadius: 1,
                border: `1px solid ${tokens.line}`,
              }}
            >
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}
          >
            <TextField
              id="login-email"
              label="Work email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors((f) => ({ ...f, email: undefined }));
              }}
              error={Boolean(fieldErrors.email)}
              helperText={fieldErrors.email}
              required
              fullWidth
              disabled={isLoading}
            />
            <TextField
              id="login-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors((f) => ({ ...f, password: undefined }));
              }}
              error={Boolean(fieldErrors.password)}
              helperText={fieldErrors.password}
              required
              fullWidth
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword((v) => !v)}
                      edge="end"
                      size="small"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <VisibilityOffOutlinedIcon fontSize="small" />
                      ) : (
                        <VisibilityOutlinedIcon fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{
                mt: 0.5,
                py: 1.35,
                fontSize: '0.95rem',
                fontWeight: 650,
                bgcolor: tokens.navy,
                borderRadius: 1,
                '&:hover': { bgcolor: tokens.navyMid },
                '&.Mui-disabled': {
                  bgcolor: tokens.navyMid,
                  color: 'rgba(255,255,255,0.7)',
                },
              }}
            >
              {isLoading ? (
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.25 }}>
                  <CircularProgress size={18} sx={{ color: tokens.white }} />
                  Signing in…
                </Box>
              ) : (
                'Sign in to portal'
              )}
            </Button>
          </Box>

          <Divider sx={{ my: 3.5, borderColor: tokens.line }} />

          <Typography
            sx={{
              fontSize: '0.8rem',
              color: tokens.muted,
              lineHeight: 1.55,
              textAlign: { xs: 'left', md: 'left' },
            }}
          >
            Access is limited to authorized CTDRU officers. For account help,
            contact your administrator or CTDRU IT support.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
