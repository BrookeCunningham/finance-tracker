import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
// needs to display transactions and insights
import { getTransactions } from "../api/transactions";
import InsightsPanel from "../components/InsightsPanel";

function Dashboard() {
  const [transactions, setTransactions] = useState<any[]>([]);

  // call get transactions
  // [] on mounting 
  useEffect(() => {
  getTransactions()
    .then((data) => setTransactions(data.transactions))
    .catch((err) => console.error(err));
  }, []);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthlyTransactions = transactions.filter(
    (t) => new Date(t.createdAt) >= monthStart
  );

  const income = monthlyTransactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = monthlyTransactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0);

  // calc bank balance
  const balance = income + expenses;

  // display info
  const summaryCards = [
    { label: 'Total Balance', value: `£${balance.toFixed(2)}` },
    { label: 'Income', value: `£${income.toFixed(2)}` },
    { label: 'Expenses', value: `£${Math.abs(expenses).toFixed(2)}` },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ marginLeft: '240px', padding: 4, flex: 1, backgroundColor: '#f7f8fc', minHeight: '100vh' }}>
        <Typography variant="h5" sx={{ fontWeight: 600, marginBottom: 3 }}>Dashboard</Typography>

        {/* Summary Cards */}
        <Box sx={{ display: 'flex', gap: 3, marginBottom: 4 }}>
          {summaryCards.map((card) => (
            <Card key={card.label} sx={{ flex: 1, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">{card.label}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 600, marginTop: 1 }}>{card.value}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Insights */}
        <Box sx={{ marginBottom: 4 }}>
          <InsightsPanel />
        </Box>

        {/* Recent Transactions */}
        <Card sx={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: 2 }}>Recent Transactions</Typography>
            {transactions.length === 0 ? (
              <Typography variant="body2" color="text.secondary">No transactions yet.</Typography>
            ) : (
              transactions.slice(0, 5).map((t) => (
                <Box key={t.transactionId} sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <Typography variant="body2">{t.description}</Typography>
                  <Typography variant="body2" sx={{ color: t.amount > 0 ? '#1976d2' : '#ff4d6d', fontWeight: 600 }}>
                    {t.amount > 0 ? '+' : ''}£{t.amount.toFixed(2)}
                  </Typography>
                </Box>
              ))
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default Dashboard;