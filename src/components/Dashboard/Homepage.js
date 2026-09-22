import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardHeader,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  LinearProgress,
  useTheme
} from '@mui/material';
import {
  Paid as PaidIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import { getDashboardStats, getRecentOrders } from '../services/api';

const Homepage = () => {
  const theme = useTheme();
  const [dashboardData, setDashboardData] = useState(null);
  const [recentOrders, setRecentOrders] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const statsData = await getDashboardStats();
      const ordersData = await getRecentOrders();
      setDashboardData(statsData);
      setRecentOrders(ordersData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#f5f5f7', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
        Dashboard Overview
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Welcome back, John! Here's an overview of your business performance.
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <LinearProgress sx={{ width: '50%' }} />
        </Box>
      ) : (
        <>
          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2 }}>
                <CardHeader title="Total Revenue" />
                <Typography variant="h5" fontWeight="bold">
                  ${dashboardData?.total_revenue?.toLocaleString() || '0'}
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2 }}>
                <CardHeader title="Financial Applications" />
                <Typography variant="h5" fontWeight="bold">
                  {dashboardData?.financial_service_count || '0'}
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2 }}>
                <CardHeader title="Input Orders" />
                <Typography variant="h5" fontWeight="bold">
                  {dashboardData?.input_orders_count || '0'}
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2 }}>
                <CardHeader title="Sell Orders" />
                <Typography variant="h5" fontWeight="bold">
                  {dashboardData?.sell_orders_count || '0'}
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Recent Orders */}
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2 }}>
                <CardHeader title="Recent Input Orders" />
                <List>
                  {recentOrders?.recent_input_orders?.map(order => (
                    <ListItem key={order.order_id}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                          <InventoryIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`Order ID: ${order.order_id}`}
                        secondary={`Status: ${order.status}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2 }}>
                <CardHeader title="Recent Sell Orders" />
                <List>
                  {recentOrders?.recent_sell_orders?.map(order => (
                    <ListItem key={order.order_id}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                          <PaidIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`Order ID: ${order.order_id}`}
                        secondary={`Status: ${order.status}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Homepage;
