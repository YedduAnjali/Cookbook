import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import {
  Avatar, Box, Breadcrumbs, Button, Chip, Container, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, IconButton, Paper, Skeleton, Stack, Typography,
} from '@mui/material';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import toast from 'react-hot-toast';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { deleteRecipe, toggleFavorite } from '../firebase/recipes';
import { tokens } from '../theme';
import { lookFor } from '../utils/categoryLook';

const DIFFICULTY_COLOR = {
  easy: tokens.success,
  medium: tokens.mustard,
  hard: tokens.terracotta,
};

export default function RecipeDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState(() => new Set());
  const [servingsOverride, setServingsOverride] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'recipes', id), (snap) => {
      setRecipe(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      setLoading(false);
    });
    return unsub;
  }, [id]);

  const isOwner = user && recipe && user.uid === recipe.ownerUid;
  const isFav = user && recipe?.favoritedBy?.includes(user.uid);
  const currentServings = servingsOverride ?? recipe?.servings ?? 1;
  const scale = recipe?.servings ? currentServings / recipe.servings : 1;
  const look = lookFor(recipe?.category);

  const toggleIngredient = (idx) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  const handleFav = async () => {
    try {
      await toggleFavorite(recipe.id, user.uid, isFav);
      toast.success(isFav ? 'Removed from saved' : 'Saved');
    } catch (err) {
      toast.error(err.message.replace('Firebase: ', ''));
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteRecipe(recipe.id, recipe.imagePath);
      toast.success('Recipe deleted');
      navigate('/my-recipes');
    } catch (err) {
      toast.error(err.message.replace('Firebase: ', ''));
      setDeleting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied');
  };

  if (loading) return <DetailSkeleton />;
  if (!recipe) return <RecipeMissing />;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      {/* Breadcrumb */}
      <Breadcrumbs
        separator={<NavigateNextRoundedIcon fontSize="small" />}
        sx={{ mb: 4, '& .MuiBreadcrumbs-separator': { color: tokens.muted } }}
      >
        <Typography component={Link} to="/" sx={{ color: tokens.muted, fontSize: 13, textDecoration: 'none', '&:hover': { color: tokens.charcoal } }}>
          Home
        </Typography>
        {recipe.category && (
          <Typography sx={{ color: tokens.muted, fontSize: 13 }}>{recipe.category}</Typography>
        )}
        <Typography sx={{ color: tokens.terracotta, fontSize: 13, fontWeight: 600 }}>
          {recipe.title}
        </Typography>
      </Breadcrumbs>

      {/* HERO: content left + image right */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' },
          gap: { xs: 3, md: 6 },
          alignItems: 'center',
          mb: 5,
        }}
      >
        <Stack spacing={3}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {recipe.category && (
              <Chip label={recipe.category} size="small" sx={{ bgcolor: tokens.terracottaLight, color: tokens.terracotta }} />
            )}
            {recipe.cuisine && (
              <Chip label={recipe.cuisine} size="small" sx={{ bgcolor: '#6B7A3A22', color: tokens.olive }} />
            )}
            {recipe.difficulty && (
              <Chip
                label={recipe.difficulty}
                size="small"
                icon={<LocalFireDepartmentRoundedIcon style={{ color: DIFFICULTY_COLOR[recipe.difficulty] }} />}
                sx={{ bgcolor: `${DIFFICULTY_COLOR[recipe.difficulty]}22`, color: DIFFICULTY_COLOR[recipe.difficulty], textTransform: 'capitalize' }}
              />
            )}
          </Stack>

          <Typography
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600,
              fontSize: { xs: '2.5rem', md: '4.25rem' },
              lineHeight: 1.02,
              letterSpacing: '-0.03em',
              color: tokens.charcoal,
            }}
          >
            {recipe.title}
          </Typography>

          {recipe.description && (
            <Typography sx={{ fontSize: { xs: '1rem', md: '1.125rem' }, lineHeight: 1.6, color: tokens.slate }}>
              {recipe.description}
            </Typography>
          )}

          {recipe.ownerName && (
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ pt: 1 }}>
              <Avatar src={recipe.ownerPhotoURL || undefined} sx={{ width: 44, height: 44 }}>
                {recipe.ownerName.charAt(0).toUpperCase()}
              </Avatar>
              <Stack>
                <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{recipe.ownerName}</Typography>
                <Typography sx={{ fontSize: 12, color: tokens.muted }}>
                  Home cook
                </Typography>
              </Stack>
            </Stack>
          )}
        </Stack>

        {/* Hero image / placeholder */}
        <Box
          sx={{
            position: 'relative',
            aspectRatio: '1',
            maxHeight: 520,
            borderRadius: 5,
            overflow: 'hidden',
            boxShadow: '0 16px 48px rgba(26,26,26,0.15)',
            background: recipe.imageUrl ? `url(${recipe.imageUrl}) center/cover` : look.bg,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          {!recipe.imageUrl && (
            <Typography sx={{ fontSize: { xs: '6rem', md: '9rem' }, filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.2))' }}>
              {look.emoji}
            </Typography>
          )}
        </Box>
      </Box>

      {/* ACTION BAR */}
      <Paper
        sx={{
          p: 2.5,
          mb: 5,
          bgcolor: tokens.cream,
          border: `1px solid ${tokens.border}`,
          borderRadius: 4,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          '&:hover': { transform: 'none', boxShadow: 'none' },
        }}
      >
        <Stack direction="row" spacing={{ xs: 2, md: 5 }} flexWrap="wrap" useFlexGap>
          <Stat icon={<AccessTimeRoundedIcon />} label="TOTAL TIME" value={`${recipe.totalTime || '—'} min`} />
          <Stat icon={<PeopleAltRoundedIcon />} label="SERVINGS" value={`${currentServings}`} />
          <Stat icon={<LocalFireDepartmentRoundedIcon />} label="DIFFICULTY" value={recipe.difficulty || '—'} capitalize />
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          {user && (
            <Button
              variant={isFav ? 'contained' : 'outlined'}
              onClick={handleFav}
              startIcon={isFav ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
            >
              {isFav ? 'Saved' : 'Save'}
            </Button>
          )}
          <IconButton onClick={handleShare} sx={{ bgcolor: tokens.ivory, '&:hover': { bgcolor: tokens.border } }}>
            <ShareRoundedIcon />
          </IconButton>
          {isOwner && (
            <>
              <IconButton component={Link} to={`/edit/${recipe.id}`} sx={{ bgcolor: tokens.ivory, '&:hover': { bgcolor: tokens.border } }}>
                <EditRoundedIcon />
              </IconButton>
              <IconButton onClick={() => setDeleteOpen(true)} sx={{ color: tokens.error, bgcolor: tokens.ivory, '&:hover': { bgcolor: '#B33A3A15' } }}>
                <DeleteOutlineRoundedIcon />
              </IconButton>
            </>
          )}
        </Stack>
      </Paper>

      {/* CONTENT: sticky ingredients + instructions */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '380px 1fr' },
          gap: { xs: 4, md: 8 },
          alignItems: 'start',
        }}
      >
        {/* Ingredients */}
        <Paper
          sx={{
            position: { md: 'sticky' },
            top: { md: 88 },
            p: { xs: 3, md: 4 },
            bgcolor: tokens.ivory,
            border: `1px solid ${tokens.border}`,
            borderRadius: 4,
            '&:hover': { transform: 'none', boxShadow: 'none' },
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h4">Ingredients</Typography>
            {recipe.servings > 0 && (
              <Stack direction="row" alignItems="center" sx={{ bgcolor: tokens.cream, borderRadius: 999, border: `1px solid ${tokens.border}` }}>
                <IconButton size="small" onClick={() => setServingsOverride(Math.max(1, currentServings - 1))}>
                  <RemoveRoundedIcon fontSize="small" />
                </IconButton>
                <Typography sx={{ minWidth: 28, textAlign: 'center', fontWeight: 600, fontSize: 14 }}>
                  {currentServings}
                </Typography>
                <IconButton size="small" onClick={() => setServingsOverride(currentServings + 1)}>
                  <AddRoundedIcon fontSize="small" />
                </IconButton>
              </Stack>
            )}
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            Tap each to check them off as you cook.
          </Typography>

          {recipe.ingredients?.length ? (
            <Stack spacing={1.5}>
              {recipe.ingredients.map((ing, i) => {
                const checked = checkedIngredients.has(i);
                return (
                  <Stack
                    key={i}
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    onClick={() => toggleIngredient(i)}
                    sx={{ cursor: 'pointer', userSelect: 'none' }}
                  >
                    <Box
                      sx={{
                        width: 22,
                        height: 22,
                        borderRadius: '6px',
                        flexShrink: 0,
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: checked ? tokens.terracotta : 'transparent',
                        border: `1.5px solid ${checked ? tokens.terracotta : tokens.border}`,
                        transition: 'all 150ms ease',
                      }}
                    >
                      {checked && (
                        <Box component="span" sx={{ color: tokens.cream, fontSize: 14, lineHeight: 1 }}>✓</Box>
                      )}
                    </Box>
                    <Typography
                      sx={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: checked ? tokens.muted : tokens.charcoal,
                        textDecoration: checked ? 'line-through' : 'none',
                      }}
                    >
                      {scaleAmount(ing.amount, scale)}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 15,
                        color: checked ? tokens.muted : tokens.slate,
                        textDecoration: checked ? 'line-through' : 'none',
                      }}
                    >
                      {ing.name}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          ) : (
            <Typography color="text.secondary">No ingredients listed.</Typography>
          )}
        </Paper>

        {/* Steps */}
        <Box>
          <Stack spacing={0.5} sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary">INSTRUCTIONS</Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}>
              How to make it
            </Typography>
          </Stack>

          {recipe.steps?.length ? (
            <Stack spacing={4}>
              {recipe.steps.map((step, i) => (
                <Stack key={i} direction="row" spacing={3} alignItems="flex-start">
                  <Box
                    sx={{
                      flexShrink: 0,
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      bgcolor: tokens.terracotta,
                      color: tokens.cream,
                      display: 'grid',
                      placeItems: 'center',
                      fontFamily: '"Playfair Display", serif',
                      fontWeight: 600,
                      fontSize: 22,
                    }}
                  >
                    {i + 1}
                  </Box>
                  <Typography sx={{ pt: 1, fontSize: { xs: '1rem', md: '1.0625rem' }, lineHeight: 1.6, color: tokens.slate }}>
                    {step}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          ) : (
            <Typography color="text.secondary">No steps provided.</Typography>
          )}
        </Box>
      </Box>

      {/* Delete confirmation */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600 }}>
          Delete this recipe?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            "{recipe.title}" will be permanently removed — including image and saves.
            This can't be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setDeleteOpen(false)} disabled={deleting}>
            Keep it
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={deleting}
            startIcon={<DeleteOutlineRoundedIcon />}
          >
            {deleting ? 'Deleting…' : 'Delete recipe'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

function Stat({ icon, label, value, capitalize }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Box
        sx={{
          width: 40, height: 40,
          borderRadius: 2,
          bgcolor: tokens.ivory,
          color: tokens.terracotta,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        {icon}
      </Box>
      <Stack spacing={0}>
        <Typography sx={{ fontSize: 10, fontWeight: 600, letterSpacing: 1.5, color: tokens.muted }}>
          {label}
        </Typography>
        <Typography
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 600,
            fontSize: '1.25rem',
            lineHeight: 1.1,
            color: tokens.charcoal,
            textTransform: capitalize ? 'capitalize' : 'none',
          }}
        >
          {value}
        </Typography>
      </Stack>
    </Stack>
  );
}

function DetailSkeleton() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Skeleton variant="text" width={200} sx={{ mb: 4 }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' }, gap: 6, mb: 4 }}>
        <Stack spacing={2}>
          <Skeleton variant="rectangular" width={220} height={28} />
          <Skeleton variant="text" width="90%" height={80} />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="80%" />
        </Stack>
        <Skeleton variant="rectangular" height={480} sx={{ borderRadius: 3 }} />
      </Box>
      <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 3, mb: 4 }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '380px 1fr' }, gap: 6 }}>
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
        <Stack spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="text" width="100%" height={60} />
          ))}
        </Stack>
      </Box>
    </Container>
  );
}

function RecipeMissing() {
  return (
    <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
      <Typography sx={{ fontSize: '4rem', mb: 2 }}>🔍</Typography>
      <Typography variant="h3" sx={{ mb: 1 }}>Recipe not found</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        It may have been deleted or the link is wrong.
      </Typography>
      <Button component={Link} to="/" variant="contained" size="large">
        Back to Explore
      </Button>
    </Container>
  );
}

/**
 * Attempts to scale a free-text amount (e.g. "1 cup", "1/2 tbsp", "2-3 cloves")
 * by a multiplier. Falls back to original text if no leading number parse succeeds.
 */
function scaleAmount(amount, scale) {
  if (!amount || scale === 1) return amount;
  const match = String(amount).match(/^(\d+(?:\.\d+)?|\d+\/\d+)(\s+.*)?$/);
  if (!match) return amount;
  const raw = match[1];
  const rest = match[2] || '';
  let n = raw.includes('/') ? raw.split('/').map(Number).reduce((a, b) => a / b) : Number(raw);
  if (!Number.isFinite(n)) return amount;
  const scaled = n * scale;
  const display = Math.round(scaled * 100) / 100;
  return `${display}${rest}`;
}
