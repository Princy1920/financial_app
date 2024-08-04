import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Grid, Card, Button, Box, IconButton, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddIcon from '@mui/icons-material/Add';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from '@mui/icons-material/Logout';

const FullScreenBox = styled(Box)({
  height: '100vh',
  width: '100vw',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  // backgroundImage: 'url("/api/placeholder/1920/1080")', // Placeholder for background image
  backgroundSize: 'cover',
  backgroundPosition: 'center',
});

const ContentBox = styled(Box)({
  flexGrow: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '32px',
  // backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white overlay
});

const StyledCard = styled(Card)(({ theme }) => ({
  width: '250px',
  height: '250px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '24px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  },
}));

const IconWrapper = styled('div')(({ theme }) => ({
  fontSize: '64px',
  color: theme.palette.primary.main,
}));

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    // Clear user data from local storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Navigate to the login page
    navigate('/login');
  };

  const cards = [
    { title: 'Transaction List', icon: ListAltIcon, path: '/transactions' },
    { title: 'Add Transaction', icon: AddIcon, path: '/transaction/new' },
    { title: 'Report', icon: AssessmentIcon, path: '/report' },
  ];

  return (
    <FullScreenBox>
      <AppBar position="static" elevation={0} sx={{ backgroundColor: '#1a2224' }}>
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
           FinTracker
          </Typography>
          <IconButton color="inherit" aria-label="logout" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <ContentBox>
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          {cards.map((card) => (
            <Grid item key={card.title}>
              <StyledCard>
                <IconWrapper>
                  <card.icon fontSize="inherit" />
                </IconWrapper>
                <Typography variant="h6" component="h2" align="center" sx={{ mt: 2, mb: 2 }}>
                  {card.title}
                </Typography>
                <Button
                  size="small"
                  aria-label={`Go to ${card.title}`}
                  onClick={() => handleNavigation(card.path)}
                  variant="contained"
                  sx={{
                    width: '40%',
                    py: 1,
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    borderRadius: '20px',
                    backgroundColor: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    }
                  }}
                >
                  GO!
                </Button>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </ContentBox>
    </FullScreenBox>
  );
};

export default Dashboard;
