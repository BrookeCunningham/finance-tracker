import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "@mui/material/Button";

function Sidebar() {
  // objects to use
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Transactions', path: '/transactions' },
    { label: 'Budgets', path: '/budgets' },
    { label: 'Settings', path: '/settings' },
  ];

  return (
    <Box sx={{
      width: 240,
      height: '100vh',
      backgroundColor: 'white',
      borderRight: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      padding: 2,
      position: 'fixed',
      top: 0,
      left: 0
    }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, padding: '16px 8px 24px', borderBottom: '1px solid #e5e7eb', marginBottom: 2 }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="12" width="4" height="10" rx="1" fill="#1976d2"/>
        <rect x="8" y="8" width="4" height="14" rx="1" fill="#1976d2"/>
        <rect x="14" y="4" width="4" height="18" rx="1" fill="#1976d2"/>
        <rect x="20" y="9" width="4" height="13" rx="1" fill="#1976d2" opacity="0.4"/>
      </svg>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Fin<span style={{ color: '#1976d2' }}>trak</span>
      </Typography>
    </Box>

      {navItems.map((item) => (
        <Box
          key={item.path}
          // redirect ie change url to match path ie. open display
          onClick={() => navigate(item.path)}
          sx={{
            padding: '10px 12px',
            borderRadius: 1,
            cursor: 'pointer',
            marginBottom: 0.5,
            backgroundColor: location.pathname === item.path ? '#e3f2fd' : 'transparent',
            color: location.pathname === item.path ? '#1976d2' : '#6b7280',
            fontWeight: location.pathname === item.path ? 600 : 400,
            fontSize: 14,
            borderLeft: location.pathname === item.path ? '3px solid #1976d2' : '3px solid transparent',
            '&:hover': {
              backgroundColor: '#f7f8fc',
              color: '#111827'
            }
          }}
        >
          {item.label}
        </Box>
      ))}
      <Box sx={{ marginTop: 'auto', paddingTop: 2, borderTop: '1px solid #e5e7eb', padding: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          onClick={() => { logout(); navigate('/login'); }}
        >
          Log Out
        </Button>
      </Box>
    </Box>
  );
}

export default Sidebar;