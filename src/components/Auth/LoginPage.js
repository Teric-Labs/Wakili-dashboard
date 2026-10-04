import React, { useState } from 'react';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import { loginUser, storeAuth } from '../services/api';

const BRAND_DARK = '#0B132B';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await loginUser({ email: email.trim(), password });
      // The backend doesn't expose role on the plain user object - whether
      // this account actually has staff access is enforced per-request by
      // the backend's require_staff dependency (a non-staff login succeeds
      // here but gets 403s from every dashboard data endpoint).
      storeAuth({ access_token: response.access_token, user: response.user });
      onLogin(response.user);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Incorrect email or password.');
      } else if (err.response?.status === 403) {
        setError('This account does not have CTDR-U staff access.');
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#0F172A',
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 4,
          borderRadius: 2,
          bgcolor: '#FFFFFF',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <Avatar sx={{ bgcolor: '#0284C7', borderRadius: 1, width: 40, height: 40 }}>
            <ShieldIcon sx={{ fontSize: 22 }} />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="900" sx={{ letterSpacing: '-0.02em' }}>
              CTDRU PORTAL
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
              Staff sign-in
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            id="login-email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            size="small"
          />
          <TextField
            id="login-password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            size="small"
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{ bgcolor: BRAND_DARK, '&:hover': { bgcolor: '#0284C7' }, mt: 1 }}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
