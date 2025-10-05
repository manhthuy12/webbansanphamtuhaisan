import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets (import the necessary icons)
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Icon for Orders
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'; // Icon for Customers
import Inventory2Icon from '@mui/icons-material/Inventory2'; // Icon for Products

// ==============================|| DASHBOARD - SUMMARY CARD ||============================== //

const SummaryCard = ({ iconType, title, value, iconColor }) => {
  const theme = useTheme();

  // Set the icon based on the iconType
  const getIcon = () => {
    switch (iconType) {
      case 'orders':
        return <ShoppingCartIcon fontSize="inherit" />;
      case 'customers':
        return <PeopleAltIcon fontSize="inherit" />;
      case 'products':
        return <Inventory2Icon fontSize="inherit" />;
      default:
        return null;
    }
  };

  return (
    <MainCard
      border={false}
      content={false}
      sx={{
        bgcolor: theme.palette.primary.dark,
        color: '#fff',
        overflow: 'hidden',
        position: 'relative',
        '&>div': {
          position: 'relative',
          zIndex: 5
        },
        '&:after': {
          content: '""',
          position: 'absolute',
          width: 210,
          height: 210,
          background: theme.palette.primary[800],
          borderRadius: '50%',
          top: { xs: -105, sm: -85 },
          right: { xs: -140, sm: -95 }
        },
        '&:before': {
          content: '""',
          position: 'absolute',
          width: 210,
          height: 210,
          background: theme.palette.primary[800],
          borderRadius: '50%',
          top: { xs: -155, sm: -125 },
          right: { xs: -70, sm: -15 },
          opacity: 0.5
        }
      }}
    >
      <Box sx={{ p: 2.25 }}>
        <Grid container direction="column">
          <Grid item>
            <Grid container justifyContent="space-between">
              <Grid item>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.largeAvatar,
                    bgcolor: iconColor || 'primary.800',
                    color: '#fff',
                    mt: 1
                  }}
                >
                  {getIcon()}
                </Avatar>
              </Grid>
            </Grid>
          </Grid>
          <Grid item sx={{ mb: 0.75 }}>
            <Grid container alignItems="center">
              <Grid item>
                <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>{value}</Typography>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: 'primary.200'
                  }}
                >
                  {title}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </MainCard>
  );
};

SummaryCard.propTypes = {
  iconType: PropTypes.oneOf(['orders', 'customers', 'products']).isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  iconColor: PropTypes.string
};

export default SummaryCard;
