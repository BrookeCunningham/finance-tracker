import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

 const handleLogin = async () => {
  
  try {
    const response = await fetch('http://localhost:3000/auth/signIn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      window.alert('Login failed. Please check your credentials.');
      return;
    }

    // if signin successful, save token to browser 
    const data = await response.json();
    login(data.token); 
    navigate('/dashboard');
  } catch (err) {
    console.error('Fetch error:', err);
  }
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
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Login</Typography>
        <TextField label="Email" variant="outlined" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Password" variant="outlined" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button variant="contained" color="primary" fullWidth size="large" onClick={handleLogin}>Log In</Button>
        <Typography variant="body2" color="text.secondary">
          Don't have an account? <span style={{ color: '#1976d2', cursor: 'pointer' }} onClick={() => navigate('/register')}>Sign Up</span>
        </Typography>
      </Box>
    </Box>
  );
}

export default Login;