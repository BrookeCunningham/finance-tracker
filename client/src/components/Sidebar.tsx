import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

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
      <Typography variant="h6" sx={{ fontWeight: 700, padding: '16px 8px 24px', borderBottom: '1px solid #e5e7eb', marginBottom: 2 }}>
        Fin<span style={{ color: '#1976d2' }}>trak</span>
      </Typography>

      {navItems.map((item) => (
        <Box
          key={item.path}
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
    </Box>
  );
}

export default Sidebar;