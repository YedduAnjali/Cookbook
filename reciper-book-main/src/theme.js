import { createTheme } from '@mui/material/styles';

/**
 * Cookbook theme — Warm Editorial palette.
 * Colors & typography match the Pencil design tokens in design/DESIGN.md.
 */
export const tokens = {
  terracotta: '#C75B39',
  terracottaDark: '#A84526',
  terracottaLight: '#F5D9CE',
  cream: '#FAF7F2',
  ivory: '#F2EDE4',
  charcoal: '#1A1A1A',
  slate: '#4A4A4A',
  muted: '#8A8578',
  border: '#E5DFD3',
  olive: '#6B7A3A',
  mustard: '#D4A017',
  plum: '#5D3A4E',
  success: '#4A7C59',
  error: '#B33A3A',
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: tokens.terracotta,
      dark: tokens.terracottaDark,
      light: tokens.terracottaLight,
      contrastText: tokens.cream,
    },
    secondary: {
      main: tokens.olive,
      contrastText: tokens.cream,
    },
    background: {
      default: tokens.cream,
      paper: '#FFFFFF',
    },
    text: {
      primary: tokens.charcoal,
      secondary: tokens.slate,
      disabled: tokens.muted,
    },
    divider: tokens.border,
    success: { main: tokens.success },
    error: { main: tokens.error },
    warning: { main: tokens.mustard },
    info: { main: tokens.plum },
  },

  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, fontSize: '3.5rem', lineHeight: 1.1, letterSpacing: '-0.02em' },
    h2: { fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, fontSize: '2.5rem', lineHeight: 1.15, letterSpacing: '-0.015em' },
    h3: { fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, fontSize: '1.875rem', lineHeight: 1.25, letterSpacing: '-0.01em' },
    h4: { fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, fontSize: '1.5rem', lineHeight: 1.3 },
    h5: { fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '1.25rem', lineHeight: 1.4 },
    h6: { fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '1rem', lineHeight: 1.4 },
    body1: { fontSize: '1rem', lineHeight: 1.55 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.015em', fontSize: '0.9375rem' },
    caption: { fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.125em', textTransform: 'uppercase' },
    overline: { fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.125em' },
  },

  shape: {
    borderRadius: 12,
  },

  shadows: [
    'none',
    '0 1px 2px rgba(26, 26, 26, 0.04)',
    '0 2px 8px rgba(26, 26, 26, 0.06)',
    '0 4px 12px rgba(26, 26, 26, 0.07)',
    '0 8px 24px rgba(26, 26, 26, 0.08)',
    '0 12px 32px rgba(26, 26, 26, 0.10)',
    '0 16px 48px rgba(26, 26, 26, 0.12)',
    ...Array(18).fill('0 16px 48px rgba(26, 26, 26, 0.12)'),
  ],

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: tokens.cream,
          color: tokens.charcoal,
          '-webkit-font-smoothing': 'antialiased',
        },
        '::selection': {
          background: tokens.terracottaLight,
          color: tokens.terracottaDark,
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '0.75rem 1.5rem',
          minHeight: 44,
        },
        containedPrimary: {
          '&:hover': { backgroundColor: tokens.terracottaDark },
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': { borderWidth: 1.5, backgroundColor: tokens.ivory },
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', fullWidth: true },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#FFFFFF',
          '& fieldset': { borderColor: tokens.border, borderWidth: 1.5 },
          '&:hover fieldset': { borderColor: tokens.muted },
          '&.Mui-focused fieldset': { borderColor: tokens.terracotta, borderWidth: 1.5 },
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: `1px solid ${tokens.border}`,
          overflow: 'hidden',
          transition: 'transform 200ms ease, box-shadow 200ms ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 32px rgba(26, 26, 26, 0.10)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.75rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          height: 28,
        },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'transparent' },
      styleOverrides: {
        root: {
          backgroundColor: tokens.cream,
          borderBottom: `1px solid ${tokens.border}`,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: tokens.terracottaLight,
          color: tokens.terracottaDark,
          fontWeight: 600,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: tokens.charcoal,
          fontSize: '0.75rem',
        },
      },
    },
  },
});

export default theme;
