import { Link } from 'react-router-dom';
import { Avatar, Box, Card, CardActionArea, CardContent, Chip, IconButton, Stack, Typography } from '@mui/material';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import { useAuth } from '../context/AuthContext';
import { toggleFavorite } from '../firebase/recipes';
import { tokens } from '../theme';
import { lookFor } from '../utils/categoryLook';

const DIFFICULTY_COLOR = {
  easy: tokens.success,
  medium: tokens.mustard,
  hard: tokens.terracotta,
};

export default function RecipeCard({ recipe }) {
  const { user } = useAuth();
  const isFav = user && recipe.favoritedBy?.includes(user.uid);
  const look = lookFor(recipe.category);

  const handleFav = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    await toggleFavorite(recipe.id, user.uid, isFav);
  };

  return (
    <Card>
      <CardActionArea
        component={Link}
        to={`/recipes/${recipe.id}`}
        sx={{ '&:hover': { textDecoration: 'none' } }}
      >
        <Box
          sx={{
            position: 'relative',
            height: 220,
            background: recipe.imageUrl ? `url(${recipe.imageUrl}) center/cover` : look.bg,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          {!recipe.imageUrl && (
            <Typography sx={{ fontSize: '4rem', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))' }}>
              {look.emoji}
            </Typography>
          )}

          {recipe.category && (
            <Chip
              label={recipe.category}
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                left: 12,
                bgcolor: tokens.cream,
                color: look.color,
                fontSize: '0.6875rem',
                '& .MuiChip-label': { px: 1.25 },
              }}
            />
          )}

          {user && (
            <IconButton
              onClick={handleFav}
              size="small"
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                bgcolor: tokens.cream,
                color: isFav ? tokens.terracotta : tokens.charcoal,
                width: 36,
                height: 36,
                '&:hover': { bgcolor: '#FFF' },
              }}
              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFav ? <FavoriteRoundedIcon fontSize="small" /> : <FavoriteBorderRoundedIcon fontSize="small" />}
            </IconButton>
          )}
        </Box>

        <CardContent sx={{ p: 2.5 }}>
          <Typography
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600,
              fontSize: '1.25rem',
              lineHeight: 1.3,
              color: tokens.charcoal,
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {recipe.title}
          </Typography>

          {recipe.description && (
            <Typography
              color="text.secondary"
              sx={{
                fontSize: '0.8125rem',
                lineHeight: 1.5,
                mb: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {recipe.description}
            </Typography>
          )}

          <Stack
            direction="row"
            spacing={1.75}
            alignItems="center"
            sx={{ pt: 1.5, borderTop: `1px solid ${tokens.border}` }}
          >
            <Stack direction="row" spacing={0.5} alignItems="center">
              <AccessTimeRoundedIcon sx={{ fontSize: 14, color: tokens.muted }} />
              <Typography variant="body2" sx={{ fontSize: '0.75rem', color: tokens.muted }}>
                {recipe.totalTime || '—'} min
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <PeopleAltRoundedIcon sx={{ fontSize: 14, color: tokens.muted }} />
              <Typography variant="body2" sx={{ fontSize: '0.75rem', color: tokens.muted }}>
                {recipe.servings || '—'}
              </Typography>
            </Stack>
            {recipe.difficulty && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <LocalFireDepartmentRoundedIcon sx={{ fontSize: 14, color: DIFFICULTY_COLOR[recipe.difficulty] }} />
                <Typography variant="body2" sx={{ fontSize: '0.75rem', color: DIFFICULTY_COLOR[recipe.difficulty], fontWeight: 600, textTransform: 'capitalize' }}>
                  {recipe.difficulty}
                </Typography>
              </Stack>
            )}
          </Stack>

          {recipe.ownerName && (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.5 }}>
              <Avatar src={recipe.ownerPhotoURL || undefined} sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                {recipe.ownerName.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body2" sx={{ fontSize: '0.75rem', color: tokens.muted }}>
                by {recipe.ownerName}
              </Typography>
            </Stack>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
