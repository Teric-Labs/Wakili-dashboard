import { createTheme } from '@mui/material/styles';
import { tokens, fonts } from './tokens';

/** Fallback theme (App uses ThemeModeProvider). Kept for any direct imports. */
const theme = createTheme({
  palette: {
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
    background: {
      default: tokens.paper,
      paper: tokens.paperElevated,
    },
  },
  typography: {
    fontFamily: fonts.sans,
    h1: { fontFamily: fonts.display, fontWeight: 600 },
    h2: { fontFamily: fonts.display, fontWeight: 600 },
    h3: { fontFamily: fonts.display, fontWeight: 600 },
    h4: { fontFamily: fonts.display, fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme;
