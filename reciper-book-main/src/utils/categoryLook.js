import { tokens } from '../theme';

/**
 * Per-category visual treatment — emoji fallback and gradient background
 * used when a recipe has no uploaded image. Keeps seed recipes and
 * user-created no-image recipes visually consistent.
 */
export const CATEGORY_LOOK = {
  'Main Dish': { emoji: '🍛', bg: 'linear-gradient(135deg,#F5D9CE 0%,#E8A980 100%)', color: tokens.terracotta },
  Soup:        { emoji: '🥣', bg: 'linear-gradient(135deg,#FBE9D7 0%,#D4A017 100%)', color: '#8A7A0A' },
  Salad:       { emoji: '🥗', bg: 'linear-gradient(135deg,#E4E8D4 0%,#6B7A3A 100%)', color: tokens.olive },
  Dessert:     { emoji: '🍰', bg: 'linear-gradient(135deg,#E8DCE4 0%,#5D3A4E 100%)', color: tokens.plum },
  Breakfast:   { emoji: '🥐', bg: 'linear-gradient(135deg,#F7ECC6 0%,#D4A017 100%)', color: '#8A7A0A' },
  Snack:       { emoji: '🍿', bg: 'linear-gradient(135deg,#F5D9CE 0%,#C75B39 100%)', color: tokens.terracotta },
  Drink:       { emoji: '🥤', bg: 'linear-gradient(135deg,#E4E8D4 0%,#4A7C59 100%)', color: tokens.success },
};

export const DEFAULT_LOOK = {
  emoji: '🍽️',
  bg: 'linear-gradient(135deg,#F5D9CE 0%,#C75B39 100%)',
  color: tokens.terracotta,
};

export function lookFor(category) {
  return CATEGORY_LOOK[category] || DEFAULT_LOOK;
}
