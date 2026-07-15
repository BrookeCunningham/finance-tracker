import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config";

function Settings() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [userForm, setUserForm] = useState({ firstName: '', surname: '', email: '' });

  useEffect(() => {
    fetch(`${API_URL}/user/view`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((r) => r.json())
      .then((data) => setUserForm({
        firstName: data.user.firstName,
        surname: data.user.surname,
        email: data.user.email
      }))
      .catch(console.error);
  }, []);

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(`${API_URL}/user/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(userForm)
      });
      if (!response.ok) throw new Error('Failed to update user');
      window.alert('Details updated successfully');
    } catch (err) {
      console.error(err);
      window.alert('Failed to update details');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure? This cannot be undone.')) return;
    try {
      const response = await fetch(`${API_URL}/user/delete`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete account');
      logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
      window.alert('Failed to delete account');
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ marginLeft: '240px', padding: 4, flex: 1, backgroundColor: '#f7f8fc', minHeight: '100vh' }}>
        <Typography variant="h5" sx={{ fontWeight: 600, marginBottom: 3 }}>Settings</Typography>

        {/* Personal Details */}
        <Card sx={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)', marginBottom: 3 }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Personal Details</Typography>
            <TextField
              label="First Name"
              fullWidth
              value={userForm.firstName}
              onChange={(e) => setUserForm({ ...userForm, firstName: e.target.value })}
            />
            <TextField
              label="Surname"
              fullWidth
              value={userForm.surname}
              onChange={(e) => setUserForm({ ...userForm, surname: e.target.value })}
            />
            <TextField
              label="Email"
              fullWidth
              value={userForm.email}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
            />
            <Button variant="contained" color="primary" onClick={handleUpdateUser} sx={{ alignSelf: 'flex-start' }}>
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card sx={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)', border: '1px solid #ff4d6d' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#ff4d6d', marginBottom: 1 }}>Danger Zone</Typography>
            <Divider sx={{ marginBottom: 2 }} />
            <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
              Deleting your account is permanent and cannot be undone.
            </Typography>
            <Button variant="outlined" color="error" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default Settings;