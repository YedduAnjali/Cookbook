import { Link } from 'react-router-dom';
import { Box, Button, Container, Paper, Skeleton, Stack, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useAuth } from '../context/AuthContext';
import { useRecipes } from '../hooks/useRecipes';
import RecipeCard from '../components/RecipeCard';
import { tokens } from '../theme';

const GRID_SX = {
  display: 'grid',
  gap: { xs: 2.5, md: 3 },
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, 1fr)',
    md: 'repeat(3, 1fr)',
  },
};

export default function MyRecipes() {
  const { user } = useAuth();
  const { recipes, loading, error } = useRecipes({ ownerUid: user.uid });

  const totalViews = 0; // placeholder — view tracking is Phase 2
  const totalSaves = recipes.reduce((sum, r) => sum + (r.favoritedBy?.length || 0), 0);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
      {/* Header */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'flex-end' }}
        spacing={3}
        sx={{ mb: 5 }}
      >
        <Stack spacing={1}>
          <Typography variant="caption" color="text.secondary">
            WELCOME BACK, {(user.displayName || user.email || '').split(' ')[0].toUpperCase()}
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', md: '3.25rem' } }}>
            My recipes
          </Typography>
          <Typography color="text.secondary">
            Your personal cookbook. {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} total.
          </Typography>
        </Stack>
        <Button
          component={Link}
          to="/add"
          variant="contained"
          size="large"
          startIcon={<AddRoundedIcon />}
        >
          New recipe
        </Button>
      </Stack>

      {/* Stats strip */}
      {recipes.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)' },
            gap: 2,
            mb: 5,
          }}
        >
          <StatCard label="TOTAL RECIPES" value={recipes.length} />
          <StatCard label="TOTAL SAVES" value={totalSaves} />
          <StatCard label="AVG COOK TIME" value={averageCookTime(recipes)} unit="min" />
        </Box>
      )}

      {/* Body */}
      {loading ? (
        <Box sx={GRID_SX}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Box key={i} sx={{ borderRadius: 3, overflow: 'hidden', border: `1px solid ${tokens.border}` }}>
              <Skeleton variant="rectangular" height={220} />
              <Box sx={{ p: 2.5 }}>
                <Skeleton variant="text" width="80%" height={28} />
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="60%" />
              </Box>
            </Box>
          ))}
        </Box>
      ) : error ? (
        <Paper
          sx={{
            p: 4,
            bgcolor: '#B33A3A0D',
            borderLeft: `4px solid ${tokens.error}`,
            borderRadius: 2,
          }}
        >
          <Typography sx={{ fontWeight: 600, color: tokens.error, mb: 1 }}>
            Couldn't load your recipes
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {error.message}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Check the browser console — if it mentions a missing index, deploy it via
            <code style={{ padding: '2px 6px', background: tokens.ivory, borderRadius: 4, margin: '0 4px' }}>
              firebase deploy --only firestore:indexes
            </code>
          </Typography>
        </Paper>
      ) : recipes.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography sx={{ fontSize: '4rem', mb: 2 }}>🍳</Typography>
          <Typography variant="h3" sx={{ mb: 1 }}>No recipes yet</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Your first dish is just a click away.
          </Typography>
          <Button component={Link} to="/add" variant="contained" size="large" startIcon={<AddRoundedIcon />}>
            Add your first recipe
          </Button>
        </Box>
      ) : (
        <Box sx={GRID_SX}>
          {recipes.map((r) => <RecipeCard key={r.id} recipe={r} />)}
        </Box>
      )}
    </Container>
  );
}

function StatCard({ label, value, unit }) {
  return (
    <Paper
      sx={{
        p: { xs: 2.5, md: 3 },
        bgcolor: tokens.ivory,
        border: `1px solid ${tokens.border}`,
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        {label}
      </Typography>
      <Typography
        sx={{
          fontFamily: '"Playfair Display", serif',
          fontWeight: 600,
          fontSize: { xs: '1.75rem', md: '2.5rem' },
          lineHeight: 1,
          color: tokens.charcoal,
        }}
      >
        {value}{unit && <Typography component="span" sx={{ ml: 0.75, fontSize: '1rem', color: tokens.muted, fontWeight: 400 }}>{unit}</Typography>}
      </Typography>
    </Paper>
  );
}

function averageCookTime(recipes) {
  if (!recipes.length) return 0;
  const sum = recipes.reduce((acc, r) => acc + (r.totalTime || 0), 0);
  return Math.round(sum / recipes.length);
}
