import { useEffect, useState } from 'react';
import { Grid, Button } from '@mui/material';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

import PopularCard from './PopularCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { getRevenueStatistics } from 'services/revenueService'; // Import API call
import { gridSpacing } from 'store/constant';
import RevenueCard from './RevenueCard';
import { formatCurrency } from 'utils/formatCurrency'; // Import a utility to format currency
import SummaryCard from './SummaryCard';

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState(null);
  const [startDate, setStartDate] = useState(dayjs()); // Sử dụng dayjs thay vì new Date()
  const [endDate, setEndDate] = useState(dayjs());

  // Hàm format date theo yêu cầu: YYYY-MM-DDTHH:mm:ss
  const formatDate = (date) => date.format('YYYY-MM-DDTHH:mm:ss');

  // Gọi API lấy dữ liệu doanh thu
  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
      const data = await getRevenueStatistics(formattedStartDate, formattedEndDate);
      setRevenueData(data);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu doanh thu:', error);
    } finally {
      setLoading(false);
    }
  };

  // Khi render lần đầu, tự động lấy dữ liệu doanh thu
  useEffect(() => {
    fetchRevenueData();
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing} justifyContent="flex-end">
          {/* Date Pickers for startDate and endDate */}
          <Grid item>
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              value={startDate}
              onChange={(date) => setStartDate(date ? dayjs(date) : dayjs())}
            />
          </Grid>
          <Grid item>
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              value={endDate}
              onChange={(date) => setEndDate(date ? dayjs(date) : dayjs())}
            />
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={fetchRevenueData}>
              Tính doanh thu
            </Button>
          </Grid>
        </Grid>
      </Grid>

      {/* Hiển thị RevenueCard với dữ liệu */}
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <SummaryCard iconType="products" title="Tổng sản phẩm" value={revenueData?.totalProducts} iconColor="secondary.main" />
          </Grid>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <SummaryCard iconType="orders" title="Tổng đơn hàng" value={revenueData?.totalOrders} iconColor="warning.main" />
          </Grid>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <SummaryCard iconType="customers" title="Tổng khách hàng" value={revenueData?.totalUsers} iconColor="info.main" />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <RevenueCard
              title="Doanh thu ngày"
              revenue={revenueData ? formatCurrency(revenueData?.todayRevenue) : '$0'}
              revenueChangePercentage={revenueData ? revenueData?.todayRevenueChangePercentage : 0}
              revenueTitle={'so với hôm qua'}
            />
          </Grid>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <RevenueCard
              title="Doanh thu tháng"
              revenue={revenueData ? formatCurrency(revenueData.monthlyRevenue) : '$0'}
              revenueChangePercentage={revenueData ? revenueData.monthlyRevenueChangePercentage : 0}
              revenueTitle={'so với tháng trước'}
            />
          </Grid>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <RevenueCard
              title="Doanh thu năm"
              revenue={revenueData ? formatCurrency(revenueData.yearlyRevenue) : '$0'}
              revenueChangePercentage={revenueData ? revenueData.yearlyRevenueChangePercentage : 0}
              revenueTitle={'so với năm ngoái'}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={8}>
            <TotalGrowthBarChart revenueData={revenueData} isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} md={4}>
            <PopularCard isLoading={isLoading} bestSellingProducts={revenueData?.bestSellingProducts} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
