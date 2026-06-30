import { useMemo, useState } from 'react';
import { Box, Container, Skeleton, Stack, Typography } from '@mui/material';
import RecipeCard from '../components/RecipeCard';
import SearchFilter from '../components/SearchFilter';
import { useRecipes } from '../hooks/useRecipes';
import { tokens } from '../theme';

const GRID_SX = {
  display: 'grid',
  gap: { xs: 2.5, md: 3 },
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, 1fr)',
    md: 'repeat(3, 1fr)',
    lg: 'repeat(3, 1fr)',
    xl: 'repeat(4, 1fr)',
  },
};

export default function Home() {
  const { recipes, loading } = useRecipes();
  const [filters, setFilters] = useState({ q: '', category: '', cuisine: '', difficulty: '' });

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return recipes.filter((r) => {
      if (filters.category && r.category !== filters.category) return false;
      if (filters.cuisine && r.cuisine !== filters.cuisine) return false;
      if (filters.difficulty && r.difficulty !== filters.difficulty) return false;
      if (!q) return true;
      return (
        r.title?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        (r.ingredients || []).some((i) => (i.name || '').toLowerCase().includes(q))
      );
    });
  }, [recipes, filters]);

  return (
    <>
      {/* Hero */}
      <Box
        sx={{
          position: 'relative',
          bgcolor: tokens.cream,
          py: { xs: 6, md: 12 },
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -120,
            right: -80,
            width: 480,
            height: 480,
            borderRadius: '50%',
            background: `radial-gradient(circle at center, ${tokens.terracottaLight}60 0%, transparent 70%)`,
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Stack spacing={2.5} sx={{ maxWidth: 760 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: tokens.terracotta }} />
              <Typography variant="caption" color="text.secondary">
                {recipes.length || '—'} RECIPES · UPDATED DAILY
              </Typography>
            </Stack>
            <Typography
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 600,
                fontSize: { xs: '2.75rem', sm: '3.5rem', md: '5rem' },
                lineHeight: 1.02,
                letterSpacing: '-0.03em',
                color: tokens.charcoal,
              }}
            >
              Recipes worth<br />cooking, from<br />home cooks.
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ fontSize: { xs: '1rem', md: '1.125rem' }, maxWidth: 560, lineHeight: 1.55 }}
            >
              Browse a library of seasonal dishes, curated collections, and new favourites shared by the community.
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* Browse */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
        <Stack spacing={0.5} sx={{ mb: 4 }}>
          <Typography variant="caption" color="text.secondary">BROWSE</Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.75rem' } }}>
            All recipes
          </Typography>
        </Stack>

        <SearchFilter filters={filters} setFilters={setFilters} />

        {/* Result count */}
        {!loading && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2.5 }}
          >
            Showing <strong style={{ color: tokens.charcoal }}>{filtered.length}</strong> of {recipes.length} recipes
          </Typography>
        )}

        {loading ? (
          <Box sx={GRID_SX}>
            {Array.from({ length: 6 }).map((_, i) => (
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
        ) : filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10, color: tokens.muted }}>
            <Typography sx={{ fontSize: '3rem', mb: 2 }}>🥘</Typography>
            <Typography variant="h4" sx={{ mb: 1 }}>No recipes match</Typography>
            <Typography color="text.secondary">Try clearing a filter, or add a new recipe of your own.</Typography>
          </Box>
        ) : (
          <Box sx={GRID_SX}>
            {filtered.map((r) => <RecipeCard key={r.id} recipe={r} />)}
          </Box>
        )}
      </Container>
    </>
  );
}
