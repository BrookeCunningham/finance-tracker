import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { getTransactions, addTransaction, editTransaction, deleteTransaction } from "../api/transactions";

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Eating Out', 'Subscriptions', 'Income', 'Other'];

function Transactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ description: '', amount: '', category: 'Other', date: '', type: 'Expense' });

  // on open fetch transactions
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = () => {
    getTransactions()
      .then((data) => setTransactions(data.transactions))
      .catch((err) => console.error(err));
  };

  const handleOpen = (transaction?: any) => {
    if (transaction) {
      setEditingId(transaction.transactionId);
      setForm({
        description: transaction.description,
        amount: transaction.amount,
        category: transaction.category,
        date: transaction.createdAt?.split('T')[0] ?? '',
        type: transaction.type
      });
    } else {
      setEditingId(null);
      setForm({ description: '', amount: '', category: 'Other', date: '', type: 'Expense' });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
  try {

        const rawAmount = parseFloat(form.amount);
        const amount = form.type === 'Expense' ? -Math.abs(rawAmount) : Math.abs(rawAmount);

        const payload = {
            description: form.description,
            amount,
            category: form.category,
            date: form.date
        };
        if (editingId) {
        await editTransaction(editingId, payload);
        } else {
        await addTransaction(payload);
        }
        fetchTransactions();
        handleClose();
    } catch (err) {
        console.error(err);
    }
    };

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
      fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ marginLeft: '240px', padding: 4, flex: 1, backgroundColor: '#f7f8fc', minHeight: '100vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>Transactions</Typography>
          <Button variant="contained" color="primary" onClick={() => handleOpen()}>+ Add Transaction</Button>
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="text.secondary">No transactions yet.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((t) => (
                  <TableRow key={t.transactionId}>
                    <TableCell>{t.description}</TableCell>
                    <TableCell>{t.category}</TableCell>
                    <TableCell>{new Date(t.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell sx={{ color: t.amount > 0 ? '#1976d2' : '#ff4d6d', fontWeight: 600 }}>
                      {t.amount > 0 ? '+' : ''}£{parseFloat(t.amount).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => handleOpen(t)}>Edit</Button>
                      <Button size="small" color="error" onClick={() => handleDelete(t.transactionId)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add/Edit Modal */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>{editingId ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: '16px !important' }}>
            <TextField
              label="Description"
              fullWidth
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <TextField
            label="Type"
            fullWidth
            select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
            <MenuItem value="Expense">Expense</MenuItem>
            <MenuItem value="Income">Income</MenuItem>
            </TextField>
            <TextField
              label="Amount (£)"
              fullWidth
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
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
            label="Date"
            fullWidth
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            slotProps={{ inputLabel: { shrink: true } }}
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

export default Transactions;