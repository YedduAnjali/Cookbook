import { Box, Stack, Typography } from '@mui/material';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import { Link } from 'react-router-dom';
import { tokens } from '../theme';

export default function Logo({ to = '/', size = 'md' }) {
  const markSize = size === 'lg' ? 44 : 36;
  const fontSize = size === 'lg' ? '1.75rem' : '1.5rem';

  return (
    <Stack
      component={Link}
      to={to}
      direction="row"
      alignItems="center"
      spacing={1.25}
      sx={{ textDecoration: 'none', color: 'inherit' }}
    >
      <Box
        sx={{
          width: markSize,
          height: markSize,
          borderRadius: '10px',
          bgcolor: tokens.terracotta,
          color: tokens.cream,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <RestaurantMenuRoundedIcon sx={{ fontSize: markSize * 0.55 }} />
      </Box>
      <Typography sx={{ fontSize, fontFamily: '"Playfair Display", serif', fontWeight: 600, color: tokens.charcoal }}>
        Cookbook
      </Typography>
    </Stack>
  );
}
