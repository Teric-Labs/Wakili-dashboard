import React, { createContext, useState, useMemo } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { tokens, fonts } from './tokens';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

/**
 * Dashboard theme aligned with Wakilibot-web:
 * navy primary, gold accent, paper backgrounds, Fraunces + Source Sans 3.
 */
export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'light',
          background: {
            default: tokens.paper,
            paper: tokens.paperElevated,
            surface: tokens.sand,
          },
          primary: {
            main: tokens.navy,
            light: tokens.navyMid,
            dark: '#061426',
            contrastText: tokens.white,
          },
          secondary: {
            main: tokens.gold,
            light: tokens.goldSoft,
            dark: '#8A6508',
            contrastText: tokens.navy,
          },
          info: {
            main: tokens.navyMid,
          },
          success: {
            main: tokens.success,
          },
          warning: {
            main: tokens.gold,
          },
          error: {
            main: tokens.danger,
          },
          text: {
            primary: tokens.navy,
            secondary: tokens.muted,
          },
          divider: tokens.line,
        },
        typography: {
          fontFamily: fonts.sans,
          h1: { fontFamily: fonts.display, fontWeight: 600, letterSpacing: '-0.02em', color: tokens.navy },
          h2: { fontFamily: fonts.display, fontWeight: 600, letterSpacing: '-0.02em', color: tokens.navy },
          h3: { fontFamily: fonts.display, fontWeight: 600, color: tokens.navy },
          h4: { fontFamily: fonts.display, fontWeight: 600, letterSpacing: '-0.02em', color: tokens.navy },
          h5: { fontFamily: fonts.display, fontWeight: 560, letterSpacing: '-0.02em', color: tokens.navy },
          h6: { fontFamily: fonts.sans, fontWeight: 600, color: tokens.navy },
          subtitle1: { fontWeight: 600, color: tokens.navy },
          subtitle2: { fontWeight: 600, color: tokens.muted },
          button: { fontFamily: fonts.sans, fontWeight: 600, textTransform: 'none' },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              ':root': {
                '--navy': tokens.navy,
                '--navy-mid': tokens.navyMid,
                '--paper': tokens.paper,
                '--sand': tokens.sand,
                '--gold': tokens.gold,
                '--muted': tokens.muted,
                '--line': tokens.line,
              },
              body: {
                backgroundColor: tokens.paper,
                color: tokens.navy,
                fontFamily: fonts.sans,
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                padding: '8px 18px',
                fontSize: '0.85rem',
                fontWeight: 600,
                boxShadow: 'none',
                textTransform: 'none',
                '&:hover': {
                  boxShadow: 'none',
                },
              },
              containedPrimary: {
                backgroundColor: tokens.navy,
                color: tokens.white,
                '&:hover': {
                  backgroundColor: tokens.navyMid,
                },
              },
              containedSecondary: {
                backgroundColor: tokens.gold,
                color: tokens.navy,
                '&:hover': {
                  backgroundColor: tokens.goldSoft,
                },
              },
            },
          },
          MuiCard: {
            defaultProps: {
              elevation: 0,
            },
            styleOverrides: {
              root: {
                borderRadius: 8,
                backgroundColor: tokens.paperElevated,
                boxShadow: 'none',
                border: `1px solid ${tokens.line}`,
              },
            },
          },
          MuiPaper: {
            defaultProps: {
              elevation: 0,
            },
            styleOverrides: {
              root: {
                backgroundImage: 'none',
                boxShadow: 'none',
              },
              elevation1: { boxShadow: 'none' },
              elevation2: { boxShadow: 'none' },
              elevation3: { boxShadow: 'none' },
              elevation4: { boxShadow: 'none' },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                padding: '14px 16px',
                fontSize: '0.85rem',
                borderColor: tokens.line,
              },
              head: {
                fontWeight: 700,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: tokens.muted,
                backgroundColor: tokens.sand,
              },
            },
          },
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
