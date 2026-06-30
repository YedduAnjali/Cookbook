import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import '@fontsource/playfair-display/500.css';
import '@fontsource/playfair-display/600.css';
import '@fontsource/playfair-display/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import App from './App';
import theme, { tokens } from './theme';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: tokens.cream,
            color: tokens.charcoal,
            borderRadius: 12,
            padding: '12px 16px',
            boxShadow: '0 8px 24px rgba(26, 26, 26, 0.08)',
            border: `1px solid ${tokens.border}`,
            fontSize: 14,
            fontWeight: 500,
          },
          success: { iconTheme: { primary: tokens.success, secondary: tokens.cream } },
          error: { iconTheme: { primary: tokens.error, secondary: tokens.cream } },
        }}
      />
    </ThemeProvider>
  </React.StrictMode>
);
