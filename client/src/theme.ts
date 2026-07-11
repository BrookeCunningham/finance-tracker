import { createTheme } from '@mui/material/styles';

// store all of apps default settings

// theme object from mui lib 
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

// default means no brackets
export default theme;