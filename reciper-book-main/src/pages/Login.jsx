import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack, Typography, Link as MuiLink, CircularProgress } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { tokens } from '../theme';

export default function Login() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const handleGoogle = async () => {
    setBusy(true);
    try {
      const result = await loginWithGoogle();
      const isNewUser =
        result?._tokenResponse?.isNewUser ??
        result?.additionalUserInfo?.isNewUser;
      toast.success(isNewUser ? 'Welcome to Cookbook' : 'Welcome back');
      navigate('/');
    } catch (err) {
      const code = err?.code || '';
      if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        toast.error(err.message.replace('Firebase: ', ''));
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 280, md: '100vh' },
          backgroundImage:
            'linear-gradient(180deg, rgba(44,24,16,0.15) 40%, rgba(44,24,16,0.85) 100%), url(https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1200&q=80&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-end',
          p: { xs: 3, md: 8 },
          color: tokens.cream,
        }}
      >
        <Box sx={{ maxWidth: 520 }}>
          <Typography sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, fontSize: { xs: '2.5rem', md: '4.25rem' }, lineHeight: 1.05, letterSpacing: '-0.025em', whiteSpace: 'pre-line' }}>
            {'Cook.\nShare.\nSavor.'}
          </Typography>
          <Typography sx={{ mt: 2.5, fontSize: { xs: '1rem', md: '1.125rem' }, color: 'rgba(250,247,242,0.85)', maxWidth: 440, lineHeight: 1.55 }}>
            Your recipe journey starts here — discover, create, and share meals with a community of home cooks.
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: tokens.cream,
          px: { xs: 3, md: 10 },
          py: { xs: 6, md: 10 },
        }}
      >
        <Stack spacing={4} sx={{ width: '100%', maxWidth: 420 }}>
          <Logo />

          <Stack spacing={1}>
            <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', md: '2.75rem' } }}>
              Step into the kitchen
            </Typography>
            <Typography color="text.secondary">
              One click — sign in or create your account with Google.
            </Typography>
          </Stack>

          <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={handleGoogle}
            disabled={busy}
            startIcon={busy ? <CircularProgress size={18} /> : <GoogleIcon />}
            sx={{
              borderColor: tokens.border,
              color: tokens.charcoal,
              bgcolor: '#FFF',
              py: 1.5,
              '&:hover': { borderColor: tokens.charcoal, bgcolor: tokens.ivory },
            }}
          >
            {busy ? 'Connecting…' : 'Continue with Google'}
          </Button>

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', lineHeight: 1.55 }}>
            By continuing, you agree to our{' '}
            <MuiLink href="#terms" color="primary">Terms</MuiLink> and{' '}
            <MuiLink href="#privacy" color="primary">Privacy Policy</MuiLink>.
            <br />
            New accounts are created automatically on first sign-in.
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
