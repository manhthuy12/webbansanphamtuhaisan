import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { formatCurrency } from 'utils/formatCurrency';

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const TotalGrowthBarChart = ({ isLoading, revenueData }) => {
  const [value, setValue] = useState('today');
  const theme = useTheme();

  const { primary } = theme.palette.text;
  const divider = theme.palette.divider;
  const grey500 = theme.palette.grey[500];

  const primary200 = theme.palette.primary[200];
  const primaryDark = theme.palette.primary.dark;
  const secondaryMain = theme.palette.secondary.main;
  const secondaryLight = theme.palette.secondary.light;

  // Lọc những ngày có doanh thu > 0 từ revenueData.dailyRevenue
  const filteredRevenueData = Object.entries(revenueData?.dailyRevenue || {}).filter(([, revenue]) => revenue > 0);

  const categories = filteredRevenueData.map(([date]) => date); // Các ngày có doanh thu > 0
  const seriesData = filteredRevenueData.map(([, revenue]) => revenue); // Doanh thu cho các ngày đó

  const chartData = {
    series: [
      {
        name: 'Doanh thu',
        data: seriesData // Sử dụng dữ liệu doanh thu đã lọc
      }
    ],
    options: {
      chart: {
        id: 'bar-chart',
        type: 'bar',
        height: 350,
        toolbar: {
          show: true
        }
      },
      xaxis: {
        categories, // Hiển thị các ngày có doanh thu > 0
        labels: {
          style: {
            colors: [primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary]
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: [primary]
          }
        }
      },
      grid: { borderColor: divider },
      tooltip: { theme: 'light' },
      legend: { labels: { colors: grey500 } },
      colors: [secondaryMain]
    }
  };

  useEffect(() => {
    // Cập nhật chart data khi dữ liệu sẵn sàng và isLoading là false
    if (!isLoading) {
      ApexCharts.exec('bar-chart', 'updateOptions', chartData.options);
    }
  }, [primary200, primaryDark, secondaryMain, secondaryLight, primary, divider, isLoading, grey500, categories, seriesData]);

  const status = [
    {
      value: 'today',
      label: 'Today'
    },
    {
      value: 'month',
      label: 'This Month'
    },
    {
      value: 'year',
      label: 'This Year'
    }
  ];

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <Typography variant="subtitle2">Tổng doanh thu</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h3">{formatCurrency(revenueData.totalRevenue)}</Typography> {/* Số liệu ví dụ */}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                '& .apexcharts-menu.apexcharts-menu-open': {
                  bgcolor: 'background.paper'
                }
              }}
            >
              <Chart options={chartData.options} series={chartData.series} type="bar" height={350} />
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

TotalGrowthBarChart.propTypes = {
  isLoading: PropTypes.bool,
  revenueData: PropTypes.object // Bổ sung prop revenueData
};

export default TotalGrowthBarChart;
