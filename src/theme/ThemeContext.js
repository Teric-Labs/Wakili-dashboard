import React, { createContext, useState, useMemo } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

/**
 * 3-COLOR CONSISTENT DESIGN SYSTEM:
 * 1. Primary: Navy/Ocean Blue (#0284C7 / #0F172A) - Headers, Primary Buttons, Active Items
 * 2. Secondary: Emerald Green (#10B981 / #059669) - Status Badges, Success Actions, Highlights
 * 3. Neutral Slate: Slate Neutral (#64748B / #E2E8F0 / #FFFFFF) - Cards, Borders, Subtext, Backgrounds
 */

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'light', // Pure crisp white theme default
          background: {
            default: '#FFFFFF', // Pure White Body Background
            paper: '#FFFFFF',   // White Card Surface
            surface: '#F8FAFC'  // Very Subtle Slate Container
          },
          primary: {
            main: '#0284C7',    // Color 1: Primary Ocean Blue
            light: '#38BDF8',
            dark: '#0F172A',
            contrastText: '#FFFFFF'
          },
          secondary: {
            main: '#10B981',    // Color 2: Emerald Green Accent
            light: '#34D399',
            dark: '#059669',
            contrastText: '#FFFFFF'
          },
          info: {
            main: '#0284C7'
          },
          success: {
            main: '#10B981',
            light: '#34D399',
            dark: '#059669'
          },
          warning: {
            main: '#0284C7'
          },
          error: {
            main: '#0F172A'
          },
          text: {
            primary: '#0F172A',   // Color 3 text: Dark Slate
            secondary: '#64748B' // Color 3 subtext: Medium Slate
          },
          divider: '#E2E8F0'    // Clean Slate Border
        },
        typography: {
          fontFamily: '"Public Sans", "Inter", -apple-system, BlinkMacSystemFont, sans-serif',
          h4: { fontWeight: 900, letterSpacing: '-0.03em', color: '#0F172A' },
          h5: { fontWeight: 800, letterSpacing: '-0.02em', color: '#0F172A' },
          h6: { fontWeight: 800, color: '#0F172A' },
          subtitle1: { fontWeight: 700, color: '#0F172A' },
          subtitle2: { fontWeight: 600, color: '#64748B' },
          button: { fontWeight: 700, textTransform: 'none' }
        },
        shape: {
          borderRadius: 10
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: '#FFFFFF',
                color: '#0F172A'
              }
            }
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                padding: '8px 18px',
                fontSize: '0.85rem',
                fontWeight: 700,
                boxShadow: 'none',
                textTransform: 'none',
                '&:hover': {
                  boxShadow: 'none'
                }
              },
              containedPrimary: {
                backgroundColor: '#0284C7',
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: '#0F172A'
                }
              },
              containedSecondary: {
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: '#059669'
                }
              }
            }
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                backgroundColor: '#FFFFFF',
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
                border: '1px solid #E2E8F0'
              }
            }
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                padding: '14px 16px',
                fontSize: '0.85rem',
                borderColor: '#E2E8F0'
              },
              head: {
                fontWeight: 800,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#64748B',
                backgroundColor: '#F8FAFC'
              }
            }
          }
        }
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
