import { useState } from 'react';
import { Box, Button, CircularProgress, Container, Paper, Stack, Typography } from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { seedRecipesForUser } from '../firebase/seed';
import { seedRecipes } from '../data/seedRecipes';
import { tokens } from '../theme';

export default function Admin() {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);

  const handleSeed = async () => {
    setBusy(true);
    try {
      const res = await seedRecipesForUser(user);
      if (res.skipped) toast('These recipes already exist for your account', { icon: 'ℹ️' });
      else toast.success(`${res.added} recipes added`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Typography variant="caption" color="text.secondary">ADMIN · DEV TOOLS</Typography>
        <Typography variant="h1" sx={{ fontSize: { xs: '2rem', md: '2.75rem' } }}>
          Seed Indian recipes
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: '1.0625rem', maxWidth: 580 }}>
          One-click bootstrap — adds 12 authentic Indian recipes to Firestore, all owned by you.
        </Typography>
      </Stack>

      <Paper elevation={0} sx={{ p: 4, bgcolor: tokens.ivory, border: `1px solid ${tokens.border}`, borderRadius: 3, mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>What gets added</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, columnGap: 4, rowGap: 1.25 }}>
          {seedRecipes.map((r) => (
            <Stack key={r.title} direction="row" spacing={1} alignItems="center">
              <Box sx={{ color: tokens.terracotta, fontSize: '0.6rem' }}>●</Box>
              <Typography sx={{ fontWeight: 600 }}>{r.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
                · {r.category} · {r.totalTime} min
              </Typography>
            </Stack>
          ))}
        </Box>
      </Paper>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSeed}
          disabled={busy}
          startIcon={busy ? <CircularProgress size={18} color="inherit" /> : <AutoAwesomeRoundedIcon />}
        >
          {busy ? 'Seeding…' : 'Seed 12 recipes'}
        </Button>
        <Typography color="text.secondary" variant="body2">
          Signed in as {user?.displayName || user?.email}
        </Typography>
      </Stack>
    </Container>
  );
}
