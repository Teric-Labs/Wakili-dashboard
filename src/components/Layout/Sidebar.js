import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Badge,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Menu as MenuIcon,
  Gavel as ComplaintsIcon,
  FolderSpecial as DocumentsIcon,
  Dashboard as DashboardIcon,
  Phonelink as ChannelsIcon,
  SmartToy as AiAgentIcon,
  VerifiedUser as AuditIcon,
  NotificationsOutlined as NotificationsIcon,
  SettingsOutlined as SettingsIcon,
  PersonOutline as ProfileIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import CtdruMark from '../Brand/CtdruMark';
import { tokens } from '../../theme/tokens';
import ctdruLogo from '../../assets/logo/cropped-CTDR-U-Logo-1-150x150.png';

const sidebarWidth = 270;
const SIDEBAR_DARK_BG = tokens.navy;
const ACCENT = tokens.goldSoft;
const MUTED = 'rgba(247, 244, 239, 0.55)';
const NAV_IDLE = 'rgba(247, 244, 239, 0.72)';

const Sidebar = ({ onLogout }) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState(null);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon fontSize="small" />, path: '/' },
    { text: 'Disputes & Claims', icon: <ComplaintsIcon fontSize="small" />, path: '/complaints' },
    { text: 'Intake Channels', icon: <ChannelsIcon fontSize="small" />, path: '/channels' },
    { text: 'Wakilibot Insights', icon: <AiAgentIcon fontSize="small" />, path: '/ai-agent' },
    { text: 'Legal & Policy Archive', icon: <DocumentsIcon fontSize="small" />, path: '/documents' },
    { text: 'Audit & Security Logs', icon: <AuditIcon fontSize="small" />, path: '/audit-logs' }
  ];

  const sidebarContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: SIDEBAR_DARK_BG, color: '#F8FAFC' }}>
      {/* Institutional Top Brand Header */}
      <Box 
        sx={{ 
          p: 2.5, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5, 
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          bgcolor: '#061426'
        }}
      >
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <CtdruMark
            size={40}
            inverted
            title="CTDRU PORTAL"
            subtitle="Consumer Protection HQ"
          />
        </Box>
      </Box>

      {/* Navigation List */}
      <Box sx={{ py: 2, flexGrow: 1 }}>
        <Typography 
          variant="caption" 
          sx={{ textTransform: 'uppercase', letterSpacing: 1.1, fontSize: '0.65rem', px: 2.5, mb: 1.5, display: 'block', color: MUTED, fontWeight: 800 }}
        >
          MAIN MENU
        </Typography>

        <List disablePadding>
          {menuItems.map((item) => {
            const isSelected = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={isSelected}
                  sx={{
                    borderRadius: 0, // No rounded shapes
                    py: 1.25,
                    px: 2.5,
                    transition: 'none',
                    borderLeft: isSelected ? `4px solid ${ACCENT}` : '4px solid transparent',
                    backgroundColor: isSelected ? 'rgba(212, 168, 75, 0.12)' : 'transparent',
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(212, 168, 75, 0.12)'
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.04)'
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: isSelected ? ACCENT : MUTED, minWidth: 32 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ 
                      fontSize: '0.85rem', 
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? tokens.white : NAV_IDLE
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* System Controls (Vertical Layout) */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)', bgcolor: '#061426' }}>
        <Typography 
          variant="caption" 
          sx={{ textTransform: 'uppercase', letterSpacing: 1.1, fontSize: '0.65rem', px: 1, mb: 1, display: 'block', color: MUTED, fontWeight: 800 }}
        >
          SYSTEM CONTROLS
        </Typography>

        <List disablePadding sx={{ mb: 1.5 }}>
          {/* Notifications Item */}
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              sx={{
                borderRadius: 0,
                py: 0.75,
                px: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.04)'
                }
              }}
            >
              <ListItemIcon sx={{ color: MUTED, minWidth: 32 }}>
                <Badge badgeContent={3} color="error" variant="dot">
                  <NotificationsIcon fontSize="small" />
                </Badge>
              </ListItemIcon>
              <ListItemText 
                primary="Notifications" 
                primaryTypographyProps={{ fontSize: '0.82rem', fontWeight: 600, color: NAV_IDLE }} 
              />
              <Chip label="3 New" size="small" color="error" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700, borderRadius: 0.5 }} />
            </ListItemButton>
          </ListItem>

          {/* Settings Item */}
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              sx={{
                borderRadius: 0,
                py: 0.75,
                px: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.04)'
                }
              }}
            >
              <ListItemIcon sx={{ color: MUTED, minWidth: 32 }}>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="System Settings" 
                primaryTypographyProps={{ fontSize: '0.82rem', fontWeight: 600, color: NAV_IDLE }} 
              />
            </ListItemButton>
          </ListItem>
        </List>

        <Divider sx={{ mb: 1.5, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

        {/* User Profile Card */}
        <Box 
          onClick={(e) => setProfileAnchor(e.currentTarget)}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5, 
            cursor: 'pointer',
            p: 1,
            borderRadius: 1,
            transition: 'all 0.15s ease-in-out',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.05)'
            }
          }}
        >
          <Avatar
            src={ctdruLogo}
            alt="CTDRU"
            sx={{ width: 36, height: 36, bgcolor: tokens.white, borderRadius: 1 }}
          />
          <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
            <Typography variant="caption" fontWeight="700" noWrap display="block" sx={{ color: '#FFFFFF' }}>
              CTDRU Officer
            </Typography>
          </Box>
        </Box>

        <Menu
          anchorEl={profileAnchor}
          open={Boolean(profileAnchor)}
          onClose={() => setProfileAnchor(null)}
          PaperProps={{ sx: { width: 220, mb: 1, borderRadius: 1, p: 0.5, bgcolor: tokens.navyMid, color: '#FFFFFF' } }}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2" fontWeight="800">CTDRU Analyst</Typography>
            <Typography variant="caption" sx={{ color: MUTED }}>Staff account</Typography>
          </Box>
          <Divider sx={{ my: 0.5, borderColor: 'rgba(255,255,255,0.1)' }} />
          <MenuItem onClick={() => setProfileAnchor(null)} sx={{ borderRadius: 0.5, fontSize: '0.85rem' }}>
            <ProfileIcon fontSize="small" sx={{ mr: 1.5, color: ACCENT }} /> Account Profile
          </MenuItem>
          <MenuItem onClick={() => setProfileAnchor(null)} sx={{ borderRadius: 0.5, fontSize: '0.85rem' }}>
            <SettingsIcon fontSize="small" sx={{ mr: 1.5, color: ACCENT }} /> System Preferences
          </MenuItem>
          <Divider sx={{ my: 0.5, borderColor: 'rgba(255,255,255,0.1)' }} />
          <MenuItem
            onClick={() => { setProfileAnchor(null); onLogout?.(); }}
            sx={{ borderRadius: 0.5, fontSize: '0.85rem' }}
          >
            <LogoutIcon fontSize="small" sx={{ mr: 1.5, color: '#F87171' }} /> Sign out
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Mobile Top Bar */}
      <Box
        sx={{
          display: { xs: 'flex', sm: 'none' },
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 56,
          px: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: SIDEBAR_DARK_BG,
          color: '#FFFFFF',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          zIndex: 1100
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ color: '#FFFFFF' }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="subtitle1" fontWeight="700">
            CTDRU Console
          </Typography>
        </Box>
      </Box>

      {/* Left Sidebar Drawer Container */}
      <Box
        component="nav"
        sx={{ width: { sm: sidebarWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Temporary Drawer for Mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: sidebarWidth, backgroundColor: SIDEBAR_DARK_BG }
          }}
        >
          {sidebarContent}
        </Drawer>

        {/* Permanent Sidebar for Desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: sidebarWidth, backgroundColor: SIDEBAR_DARK_BG, borderRight: '1px solid rgba(255, 255, 255, 0.08)' }
          }}
          open
        >
          {sidebarContent}
        </Drawer>
      </Box>
    </Box>
  );
};

export default Sidebar;
