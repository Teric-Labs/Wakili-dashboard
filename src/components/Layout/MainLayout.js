import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Homepage from '../Dashboard/Homepage';

const MainLayout = ({ onLogout }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar onLogout={onLogout} />
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Homepage />
      </Box>
    </Box>
  );
};

export default MainLayout;