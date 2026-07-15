import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function Register() {
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, surname, email, password })
    });

    if (!response.ok) {
      window.alert('Registration failed. Please check your credentials.');
      return;
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    navigate('/dashboard');
  };

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f7f8fc'
    }}>
      <Box sx={{
        backgroundColor: 'white',
        padding: 4,
        borderRadius: 2,
        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: 400,
        textAlign: 'center'
      }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Create an account</Typography>
        <TextField label="First Name" variant="outlined" fullWidth value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <TextField label="Surname" variant="outlined" fullWidth value={surname} onChange={(e) => setSurname(e.target.value)} />
        <TextField label="Email" variant="outlined" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Password" variant="outlined" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button variant="contained" color="primary" fullWidth size="large" onClick={handleRegister}>Sign Up</Button>
        <Typography variant="body2" color="text.secondary">
          Already have an account? <span style={{ color: '#1976d2', cursor: 'pointer' }} onClick={() => navigate('/login')}>Log In</span>
        </Typography>
      </Box>
    </Box>
  );
}

export default Register;