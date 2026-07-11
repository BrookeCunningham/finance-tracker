// entry point of application
// REACTDOM lets you render React components to the browser
import ReactDOM from 'react-dom/client';
// App file to get app component
import App from './App';
// export default = no braces
// export const = braces
// Material UI (MUI), a library of pre-built React components
import { ThemeProvider } from '@mui/material/styles';
// clean starting point for the app, removes default browser styling
import CssBaseline from '@mui/material/CssBaseline';
// imports custom theme from theme.ts file
import theme from './theme';

// creates a root element in the HTML file and renders the React app into it
ReactDOM.createRoot(document.getElementById('root')!).render(
  // gives the custom theme to the entire app
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
);