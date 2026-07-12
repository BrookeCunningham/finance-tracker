import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import LinearProgress from "@mui/material/LinearProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { getBudgets, addBudget, editBudget, deleteBudget } from "../api/budgets";

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Eating Out', 'Subscriptions', 'Income', 'Other'];

function Budget() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ category: 'Other', budgetValue: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getBudgets().then((data) => setBudgets(data.budgets)).catch(console.error);
  };

  const handleOpen = (budget?: any) => {
    if (budget) {
      setEditingId(budget.budgetId);
      setForm({ category: budget.category, budgetValue: budget.budgetValue});
    } else {
      setEditingId(null);
      setForm({ category: 'Other', budgetValue: '' });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    try {
      const payload = {
        category: form.category,
        budgetValue: parseFloat(form.budgetValue),
      };
      if (editingId) {
        await editBudget(editingId, payload);
      } else {
        await addBudget(payload);
      }
      fetchData();
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBudget(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ marginLeft: '240px', padding: 4, flex: 1, backgroundColor: '#f7f8fc', minHeight: '100vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>Budgets</Typography>
          <Button variant="contained" color="primary" onClick={() => handleOpen()}>+ Add Budget</Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
          Showing spend for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
        </Typography>

        {budgets.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No budgets yet.</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {budgets.map((b) => {
              const spent = b.spent ?? 0;
              const budgetValue = parseFloat(b.budgetValue);
              const progress = Math.min((spent / budgetValue) * 100, 100);
              const over = spent > budgetValue;
              return (
                <Card key={b.budgetId} sx={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>{b.category}</Typography>
                      <Typography variant="body2" color={over ? 'error' : 'text.secondary'}>
                        £{spent.toFixed(2)} / £{budgetValue.toFixed(2)}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      color={over ? 'error' : 'primary'}
                      sx={{ height: 8, borderRadius: 4, marginBottom: 1 }}
                    />
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Button size="small" onClick={() => handleOpen(b)}>Edit</Button>
                      <Button size="small" color="error" onClick={() => handleDelete(b.budgetId)}>Delete</Button>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )}

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>{editingId ? 'Edit Budget' : 'Add Budget'}</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: '16px !important' }}>
            <TextField
              label="Category"
              fullWidth
              select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Budget (£)"
              fullWidth
              type="number"
              value={form.budgetValue}
              onChange={(e) => setForm({ ...form, budgetValue: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default Budget;