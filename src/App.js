import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import OrderLayout from './components/Layout/OrderLayout';
import PurchasesLayout from './components/Layout/PurchasesLayout';
import InventoryLayout from './components/Layout/InventoryLayout';
import FarmerLayout from './components/Layout/FarmerLayout';
import FinancialServicesLayout from './components/Layout/FinancialServicesLayout';
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// This is your main application entry point
function App() {
  // Create a default theme with key configurations
  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0'
      },
      secondary: {
        main: '#7b1fa2',
        light: '#9c27b0',
        dark: '#6a1b9a'
      },
      success: {
        main: '#2e7d32',
        light: '#4caf50',
        dark: '#1b5e20'
      },
      warning: {
        main: '#ed6c02',
        light: '#ff9800',
        dark: '#e65100'
      },
      error: {
        main: '#d32f2f',
        light: '#ef5350',
        dark: '#c62828'
      }
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 600
      },
      h5: {
        fontWeight: 600
      },
      h6: {
        fontWeight: 600
      }
    },
    shape: {
      borderRadius: 8
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            fontWeight: 500
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 4px 12px 0 rgba(0,0,0,0.1)'
          }
        }
      }
    }
  });

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Main route using MainLayout which contains both sidebar and dashboard */}
            <Route path="/" element={<MainLayout />} />
            
            {/* Additional route examples */}
            <Route path="/dashboard" element={<MainLayout />} />
            <Route path="/orders" element={<OrderLayout />} />
            <Route path="/purchases" element={<PurchasesLayout />} />
            <Route path="/farmers" element={<FarmerLayout />} />
            <Route path="/financials" element={<FinancialServicesLayout />} />
            <Route path="/inventory" element={<InventoryLayout  />} />
            <Route path="/reports" element={<MainLayout />} />
            <Route path="/settings" element={<MainLayout />} />
            
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;