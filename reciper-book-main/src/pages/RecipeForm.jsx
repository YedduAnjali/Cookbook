import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form';
import {
  Box, Button, CircularProgress, Container, IconButton, InputAdornment,
  MenuItem, Paper, Stack, TextField, Typography,
} from '@mui/material';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { createRecipe, getRecipe, updateRecipe } from '../firebase/recipes';
import { CATEGORIES, CUISINES, DIFFICULTIES } from '../components/SearchFilter';
import { tokens } from '../theme';
import { lookFor } from '../utils/categoryLook';

const DEFAULT_VALUES = {
  title: '',
  description: '',
  category: '',
  cuisine: '',
  difficulty: 'easy',
  prepTime: '',
  cookTime: '',
  servings: '',
  ingredients: [{ amount: '', name: '' }],
  steps: [''],
};

const SectionHeader = ({ caption, title, sub }) => (
  <Stack spacing={0.5} sx={{ mb: 3 }}>
    <Typography variant="caption" color="text.secondary">{caption}</Typography>
    <Typography variant="h4">{title}</Typography>
    {sub && <Typography color="text.secondary">{sub}</Typography>}
  </Stack>
);

export default function RecipeForm({ mode = 'create' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [existing, setExisting] = useState(null);

  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm({ defaultValues: DEFAULT_VALUES, mode: 'onBlur' });

  const ingredients = useFieldArray({ control, name: 'ingredients' });
  const steps = useFieldArray({ control, name: 'steps' });
  const watchedCategory = useWatch({ control, name: 'category' });

  useEffect(() => {
    if (mode !== 'edit' || !id) return;
    (async () => {
      const r = await getRecipe(id);
      if (!r) return toast.error('Recipe not found');
      if (r.ownerUid !== user.uid) return toast.error('You can only edit your own recipes');
      setExisting(r);
      reset({
        title: r.title ?? '',
        description: r.description ?? '',
        category: r.category ?? '',
        cuisine: r.cuisine ?? '',
        difficulty: r.difficulty ?? 'easy',
        prepTime: r.prepTime ?? '',
        cookTime: r.cookTime ?? '',
        servings: r.servings ?? '',
        ingredients: r.ingredients?.length ? r.ingredients : [{ amount: '', name: '' }],
        steps: (r.steps?.length ? r.steps : ['']).map((s) => (typeof s === 'string' ? s : '')),
      });
      setImagePreview(r.imageUrl || '');
    })();
  }, [mode, id, user, reset]);

  const handleImage = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (values) => {
    const cleaned = {
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
      ingredients: values.ingredients.filter((i) => (i.name || '').trim()),
      steps: values.steps.map((s) => (s || '').trim()).filter(Boolean),
    };
    if (cleaned.ingredients.length === 0) return toast.error('Add at least one ingredient');
    if (cleaned.steps.length === 0) return toast.error('Add at least one cooking step');

    try {
      if (mode === 'create') {
        await createRecipe({ data: cleaned, imageFile, owner: user });
        toast.success('Recipe published');
      } else {
        await updateRecipe(id, { data: cleaned, imageFile, owner: user });
        toast.success('Recipe updated');
      }
      navigate('/my-recipes');
    } catch (err) {
      toast.error(err.message.replace('Firebase: ', ''));
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
      {/* Page heading */}
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Typography variant="caption" color="text.secondary">
          {mode === 'edit' ? 'EDIT RECIPE' : 'NEW RECIPE'}
        </Typography>
        <Typography variant="h1" sx={{ fontSize: { xs: '2rem', md: '2.75rem' } }}>
          {mode === 'edit' ? 'Refine your recipe' : 'Share a new recipe'}
        </Typography>
        <Typography color="text.secondary">
          A great recipe tells a story — good photo, clear ingredients, and friendly steps.
        </Typography>
      </Stack>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* SECTION 1 · BASICS */}
        <Paper sx={{ p: { xs: 3, md: 4 }, mb: 3 }}>
          <SectionHeader caption="1 · BASICS" title="Let's start with the basics" />

          <Stack spacing={3}>
            <TextField
              label="Recipe title"
              placeholder="e.g. Grandma's butter chicken"
              {...register('title', { required: 'Title is required', minLength: { value: 3, message: 'At least 3 characters' } })}
              error={Boolean(errors.title)}
              helperText={errors.title?.message}
            />

            <TextField
              label="Short description"
              placeholder="Two sentences on what makes this dish special"
              multiline
              minRows={3}
              {...register('description')}
            />

            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' } }}>
              <Controller
                control={control}
                name="category"
                rules={{ required: 'Pick a category' }}
                render={({ field }) => (
                  <TextField select label="Category" {...field} error={Boolean(errors.category)} helperText={errors.category?.message}>
                    <MenuItem value="">— Select —</MenuItem>
                    {CATEGORIES.filter(Boolean).map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </TextField>
                )}
              />
              <Controller
                control={control}
                name="cuisine"
                render={({ field }) => (
                  <TextField select label="Cuisine" {...field}>
                    <MenuItem value="">— Select —</MenuItem>
                    {CUISINES.filter(Boolean).map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </TextField>
                )}
              />
              <Controller
                control={control}
                name="difficulty"
                render={({ field }) => (
                  <TextField select label="Difficulty" {...field}>
                    {DIFFICULTIES.filter(Boolean).map((d) => (
                      <MenuItem key={d} value={d}>{d[0].toUpperCase() + d.slice(1)}</MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Box>

            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' } }}>
              <TextField
                label="Prep time"
                type="number"
                inputProps={{ min: 0 }}
                InputProps={{ endAdornment: <InputAdornment position="end">min</InputAdornment> }}
                {...register('prepTime', { valueAsNumber: false })}
              />
              <TextField
                label="Cook time"
                type="number"
                inputProps={{ min: 0 }}
                InputProps={{ endAdornment: <InputAdornment position="end">min</InputAdornment> }}
                {...register('cookTime', { valueAsNumber: false })}
              />
              <TextField
                label="Servings"
                type="number"
                inputProps={{ min: 1 }}
                InputProps={{ endAdornment: <InputAdornment position="end">people</InputAdornment> }}
                {...register('servings')}
              />
            </Box>

            {/* Image upload — fully optional */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  RECIPE IMAGE
                </Typography>
                <Typography variant="caption" sx={{ color: tokens.muted, letterSpacing: 0, textTransform: 'none' }}>
                  · Optional
                </Typography>
              </Stack>

              {imagePreview ? (
                <Box>
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="preview"
                    sx={{ width: '100%', maxHeight: 360, objectFit: 'cover', borderRadius: 3, border: `1px solid ${tokens.border}` }}
                  />
                  <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                    <Button size="small" component="label" htmlFor="recipe-image" startIcon={<CloudUploadRoundedIcon />}>
                      Change photo
                      <input id="recipe-image" type="file" accept="image/*" hidden onChange={handleImage} />
                    </Button>
                    <Button size="small" color="error" onClick={() => { setImageFile(null); setImagePreview(''); }}>
                      Remove
                    </Button>
                  </Stack>
                </Box>
              ) : (
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                  {/* Upload zone */}
                  <Box
                    component="label"
                    htmlFor="recipe-image"
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      minHeight: 220,
                      p: 3,
                      border: `2px dashed ${tokens.border}`,
                      borderRadius: 3,
                      cursor: 'pointer',
                      bgcolor: tokens.ivory,
                      transition: 'border-color 150ms ease',
                      '&:hover': { borderColor: tokens.terracotta },
                    }}
                  >
                    <input id="recipe-image" type="file" accept="image/*" hidden onChange={handleImage} />
                    <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: tokens.cream, display: 'grid', placeItems: 'center' }}>
                      <CloudUploadRoundedIcon sx={{ color: tokens.terracotta }} />
                    </Box>
                    <Typography variant="h6" sx={{ textAlign: 'center' }}>Upload a photo</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                      PNG, JPG · up to 5 MB
                    </Typography>
                  </Box>

                  {/* Placeholder preview */}
                  <Box>
                    <Box
                      sx={{
                        minHeight: 220,
                        borderRadius: 3,
                        background: lookFor(watchedCategory).bg,
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <Typography sx={{ fontSize: '5rem', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))' }}>
                        {lookFor(watchedCategory).emoji}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                      Or skip — we'll use this {watchedCategory ? watchedCategory.toLowerCase() : 'category-themed'} placeholder.
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Stack>
        </Paper>

        {/* SECTION 2 · INGREDIENTS */}
        <Paper sx={{ p: { xs: 3, md: 4 }, mb: 3 }}>
          <SectionHeader caption="2 · INGREDIENTS" title="What goes in?" sub="Quantity can be free-text — e.g. ‘1 cup’, ‘to taste’." />

          <Stack spacing={1.5}>
            {ingredients.fields.map((field, i) => (
              <Box
                key={field.id}
                sx={{
                  display: 'grid',
                  gap: 1.5,
                  alignItems: 'center',
                  gridTemplateColumns: { xs: '1fr 1fr auto', sm: '140px 1fr 48px' },
                }}
              >
                <TextField
                  placeholder="1 cup"
                  size="small"
                  {...register(`ingredients.${i}.amount`)}
                />
                <TextField
                  placeholder="arborio rice"
                  size="small"
                  {...register(`ingredients.${i}.name`)}
                />
                <IconButton
                  color="error"
                  onClick={() => ingredients.remove(i)}
                  disabled={ingredients.fields.length === 1}
                  aria-label="Remove ingredient"
                >
                  <DeleteOutlineRoundedIcon />
                </IconButton>
              </Box>
            ))}
          </Stack>

          <Button
            startIcon={<AddRoundedIcon />}
            onClick={() => ingredients.append({ amount: '', name: '' })}
            sx={{ mt: 2 }}
          >
            Add ingredient
          </Button>
        </Paper>

        {/* SECTION 3 · STEPS */}
        <Paper sx={{ p: { xs: 3, md: 4 }, mb: 3 }}>
          <SectionHeader caption="3 · INSTRUCTIONS" title="How do you make it?" sub="Write each step as if you're guiding a friend." />

          <Stack spacing={2}>
            {steps.fields.map((field, i) => (
              <Stack key={field.id} direction="row" spacing={2} alignItems="flex-start">
                <Box
                  sx={{
                    flexShrink: 0,
                    width: 40, height: 40,
                    mt: 0.5,
                    borderRadius: '50%',
                    bgcolor: tokens.terracotta,
                    color: tokens.cream,
                    display: 'grid',
                    placeItems: 'center',
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 600,
                    fontSize: 18,
                  }}
                >
                  {i + 1}
                </Box>
                <TextField
                  multiline
                  minRows={2}
                  placeholder={`Step ${i + 1}`}
                  fullWidth
                  {...register(`steps.${i}`)}
                />
                <IconButton
                  color="error"
                  onClick={() => steps.remove(i)}
                  disabled={steps.fields.length === 1}
                  sx={{ mt: 0.5 }}
                  aria-label="Remove step"
                >
                  <DeleteOutlineRoundedIcon />
                </IconButton>
              </Stack>
            ))}
          </Stack>

          <Button
            startIcon={<AddRoundedIcon />}
            onClick={() => steps.append('')}
            sx={{ mt: 2 }}
          >
            Add step
          </Button>
        </Paper>

        {/* ACTIONS */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Button
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <CheckRoundedIcon />}
            sx={{ minWidth: 220 }}
          >
            {isSubmitting ? 'Saving…' : (mode === 'edit' ? 'Save changes' : 'Publish recipe')}
          </Button>
        </Stack>
      </form>
    </Container>
  );
}
