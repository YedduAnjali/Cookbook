import { Box, Chip, FormControl, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { tokens } from '../theme';

const CATEGORIES = ['', 'Main Dish', 'Breakfast', 'Dessert', 'Drink', 'Soup', 'Salad', 'Snack'];
const CUISINES = ['', 'Indian', 'Italian', 'Mexican', 'Chinese', 'Japanese', 'American', 'Thai', 'Mediterranean', 'Other'];
const DIFFICULTIES = ['', 'easy', 'medium', 'hard'];

export default function SearchFilter({ filters, setFilters }) {
  const update = (patch) => setFilters({ ...filters, ...patch });

  return (
    <Stack spacing={3} sx={{ mb: 4 }}>
      <TextField
        placeholder="Search recipes, ingredients…"
        value={filters.q}
        onChange={(e) => update({ q: e.target.value })}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon sx={{ color: tokens.muted }} />
            </InputAdornment>
          ),
          sx: { borderRadius: '999px' },
        }}
      />

      <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 0.5, '&::-webkit-scrollbar': { display: 'none' } }}>
        {CATEGORIES.map((c) => (
          <Chip
            key={c || 'all'}
            label={c || 'All'}
            onClick={() => update({ category: c })}
            variant={filters.category === c ? 'filled' : 'outlined'}
            color={filters.category === c ? 'primary' : 'default'}
            sx={{
              borderRadius: '999px',
              fontWeight: 600,
              letterSpacing: 0.3,
              textTransform: 'none',
              fontSize: '0.8125rem',
              px: 0.5,
              flexShrink: 0,
              ...(filters.category !== c && { bgcolor: tokens.cream, borderColor: tokens.border }),
            }}
          />
        ))}
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Cuisine</InputLabel>
          <Select
            value={filters.cuisine}
            label="Cuisine"
            onChange={(e) => update({ cuisine: e.target.value })}
          >
            {CUISINES.map((c) => (
              <MenuItem key={c || 'any'} value={c}>{c || 'Any cuisine'}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Difficulty</InputLabel>
          <Select
            value={filters.difficulty}
            label="Difficulty"
            onChange={(e) => update({ difficulty: e.target.value })}
          >
            {DIFFICULTIES.map((d) => (
              <MenuItem key={d || 'any'} value={d}>{d ? d[0].toUpperCase() + d.slice(1) : 'Any'}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Stack>
  );
}

export { CATEGORIES, CUISINES, DIFFICULTIES };
