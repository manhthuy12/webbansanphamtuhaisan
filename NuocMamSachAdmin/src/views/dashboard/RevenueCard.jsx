import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// MUI Icons
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

// Project imports
import MainCard from 'ui-component/cards/MainCard';

// ===========================|| DASHBOARD - REVENUE CARD ||=========================== //

const RevenueCard = ({ title, revenue, revenueChangePercentage, revenueTitle }) => {
  const theme = useTheme();
  const isRevenueUp = revenueChangePercentage >= 0;

  return (
    <MainCard
      border={false}
      content={false}
      sx={{
        bgcolor: 'secondary.dark',
        color: '#fff',
        overflow: 'hidden',
        position: 'relative',
        '&:after': {
          content: '""',
          position: 'absolute',
          width: 210,
          height: 210,
          background: theme.palette.secondary[800],
          borderRadius: '50%',
          top: { xs: -105, sm: -85 },
          right: { xs: -140, sm: -95 }
        },
        '&:before': {
          content: '""',
          position: 'absolute',
          width: 210,
          height: 210,
          background: theme.palette.secondary[800],
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
            <Typography sx={{ fontSize: '1.325rem', color: 'secondary.200', fontWeight: 500 }}>{title}</Typography>
          </Grid>
          <Grid item>
            <Grid container alignItems="center">
              <Grid item>
                <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>{revenue}</Typography>
              </Grid>
              <Grid item>
                <Avatar
                  sx={{
                    cursor: 'pointer',
                    ...theme.typography.smallAvatar,
                    bgcolor: isRevenueUp ? 'success.light' : 'error.light',
                    color: isRevenueUp ? 'success.dark' : 'error.dark'
                  }}
                >
                  {isRevenueUp ? <ArrowUpwardIcon fontSize="inherit" /> : <ArrowDownwardIcon fontSize="inherit" />}
                </Avatar>
              </Grid>
            </Grid>
          </Grid>
          <Grid item sx={{ mb: 1.25 }}>
            <Typography
              sx={{
                fontSize: '1rem',
                fontWeight: 500,
                color: 'secondary.200'
              }}
            >
              {isRevenueUp
                ? `+${revenueChangePercentage.toFixed(2)}% ${revenueTitle}`
                : `${revenueChangePercentage.toFixed(2)}% ${revenueTitle}`}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </MainCard>
  );
};

RevenueCard.propTypes = {
  title: PropTypes.string.isRequired,
  revenue: PropTypes.string.isRequired,
  revenueChangePercentage: PropTypes.number.isRequired
};

export default RevenueCard;
