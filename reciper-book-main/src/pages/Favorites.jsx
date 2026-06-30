import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { Box, Button, Container, Skeleton, Stack, Typography } from '@mui/material';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
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

export default function Favorites() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // array-contains without orderBy avoids the composite index requirement.
    const q = query(
      collection(db, 'recipes'),
      where('favoritedBy', 'array-contains', user.uid)
    );
    setLoading(true);
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
        setRecipes(list);
        setLoading(false);
      },
      (err) => {
        console.error('Favorites error:', err);
        setError(err);
        setLoading(false);
      }
    );
    return unsub;
  }, [user.uid]);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
      {/* Header */}
      <Stack spacing={1} sx={{ mb: 5 }}>
        <Typography variant="caption" color="text.secondary">
          YOUR LITTLE BLACK BOOK
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', md: '3.25rem' } }}>
            Saved recipes
          </Typography>
          <FavoriteRoundedIcon sx={{ color: tokens.terracotta, fontSize: { xs: 32, md: 40 } }} />
        </Stack>
        <Typography color="text.secondary">
          {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} waiting for your next cooking session.
        </Typography>
      </Stack>

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
        <Box sx={{ p: 4, bgcolor: '#B33A3A0D', borderLeft: `4px solid ${tokens.error}`, borderRadius: 2 }}>
          <Typography sx={{ fontWeight: 600, color: tokens.error, mb: 1 }}>Couldn't load favorites</Typography>
          <Typography variant="body2" color="text.secondary">{error.message}</Typography>
        </Box>
      ) : recipes.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography sx={{ fontSize: '4rem', mb: 2 }}>🤍</Typography>
          <Typography variant="h3" sx={{ mb: 1 }}>Nothing saved yet</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Tap the heart on any recipe to keep it here for later.
          </Typography>
          <Button component={Link} to="/" variant="contained" size="large">
            Browse recipes
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
