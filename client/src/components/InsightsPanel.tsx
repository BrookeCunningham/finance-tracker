// useEffect = effect on load
// useState = stores data
import { useEffect, useState } from 'react';
// MUI components
import { Box, Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material';
// charts from recharts 
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
// access to api which connects to database
import { getMonthlyInsights } from '../api/insights';

// interface = object without implementation
interface InsightsCategory {
  category: string;
  currentValue: number;
}

interface InsightsTopCategory {
  category: string;
  percentChange: number | null;
}

interface LocalInsightsResponse {
  categories: InsightsCategory[];
  totalCurrent: number;
  topCategory?: InsightsTopCategory | null;
}

// function that returns the react componant
const InsightsPanel = () => {
  // defining const to store data
  const [data, setData] = useState<LocalInsightsResponse | null>(null);
  // loading starts as true
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // when page opens fetch insights
  // small funct inside funct
  useEffect(() => {
  const fetchInsights = async () => {
    try {
      const result = await getMonthlyInsights();
      // use hook to change data
      setData(result);
    } catch (err) {
      setError('Failed to load insights');
    } finally {
      setLoading(false);
    }
  };
  fetchInsights();
}, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data || data.categories.length === 0) {
    return <Typography color="text.secondary">No spending data yet this month.</Typography>;
  }

  const chartData = data.categories.map((c) => ({
    category: c.category,
    amount: c.currentValue,
  }));

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Monthly Insights
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Total spend this month
              </Typography>
              <Typography variant="h5">£{data.totalCurrent.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {data.topCategory && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Top category
                </Typography>
                <Typography variant="h5">{data.topCategory.category}</Typography>
                {data.topCategory.percentChange !== null && (
                  <Typography
                    variant="body2"
                    color={data.topCategory.percentChange >= 0 ? 'error.main' : 'success.main'}
                  >
                    {data.topCategory.percentChange >= 0 ? '+' : ''}
                    {data.topCategory.percentChange.toFixed(1)}% vs last month
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      <Card>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip/>
              <Bar dataKey="amount" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default InsightsPanel;