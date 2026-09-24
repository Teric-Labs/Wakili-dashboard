import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import ComplaintsPage from './components/Dashboard/ComplaintsPage';
import ChannelsPage from './components/Dashboard/ChannelsPage';
import DocumentsPage from './components/Dashboard/DocumentsPage';
import AiAgentPage from './components/Dashboard/AiAgentPage';
import AuditLogsPage from './components/Dashboard/AuditLogsPage';
import { ThemeModeProvider } from './theme/ThemeContext';

function App() {
  return (
    <ThemeModeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/dashboard" element={<MainLayout />} />
          <Route path="/complaints" element={<ComplaintsPage />} />
          <Route path="/disputes" element={<ComplaintsPage />} />
          <Route path="/incidents" element={<ComplaintsPage />} />
          <Route path="/channels" element={<ChannelsPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/ai-agent" element={<AiAgentPage />} />
          <Route path="/audit-logs" element={<AuditLogsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeModeProvider>
  );
}

export default App;