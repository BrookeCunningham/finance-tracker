import { createTheme } from '@mui/material/styles';

// theme = typescript object
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f7f8fc',
    },
    text: {
      primary: '#111827',
      secondary: '#6b7280',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
});

// exports this theme object
export default theme;