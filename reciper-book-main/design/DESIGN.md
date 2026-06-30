# Cookbook — Design Reference

This folder is the **visual source of truth** for the Recipe Book app. The full interactive design lives in a Pencil `.pen` file (accessible via the Pencil editor in Claude Code) — this document is the handoff spec for implementation.

## Design language

**Warm Editorial** — feels like a premium food publication (Bon Appétit, NYT Cooking).
- Serif headings, clean sans body
- Generous whitespace, photography-forward
- Never pure white or pure black — everything is warm-toned

---

## Color tokens

### Primary
| Token | Hex | Usage |
|---|---|---|
| `--color-terracotta` | `#C75B39` | Primary CTA, active states, links |
| `--color-terracotta-dark` | `#A84526` | Hover, pressed |
| `--color-terracotta-light` | `#F5D9CE` | Subtle highlights, tag backgrounds |

### Neutrals
| Token | Hex | Usage |
|---|---|---|
| `--color-cream` | `#FAF7F2` | Page background |
| `--color-ivory` | `#F2EDE4` | Card/section background |
| `--color-charcoal` | `#1A1A1A` | Headings, primary text |
| `--color-slate` | `#4A4A4A` | Body copy |
| `--color-muted` | `#8A8578` | Meta text, captions |
| `--color-border` | `#E5DFD3` | Dividers, input borders |

### Accents
| Token | Hex | Usage |
|---|---|---|
| `--color-olive` | `#6B7A3A` | Vegetarian, healthy tags |
| `--color-mustard` | `#D4A017` | Ratings (stars), featured badge |
| `--color-plum` | `#5D3A4E` | Desserts, special tags |

### Semantic
| Token | Hex | Usage |
|---|---|---|
| `--color-success` | `#4A7C59` | Saved toasts, published status |
| `--color-error` | `#B33A3A` | Delete, error messages |

---

## Typography

- **Headings:** `Playfair Display` (600 weight, negative letter-spacing on display sizes)
- **Body:** `Inter` (400 regular, 500 medium, 600 semibold)

### Scale
| Style | Font | Size | Line-height | Letter-spacing |
|---|---|---|---|---|
| Display | Playfair | 72px | 1.05 | -2% |
| H1 | Playfair | 48px | 1.1 | -1% |
| H2 | Playfair | 36px | 1.2 | -1% |
| H3 | Playfair | 28px | 1.3 | 0 |
| H4 | Inter | 20px | 1.4 | 0 |
| Body Large | Inter | 18px | 1.55 | 0 |
| Body | Inter | 16px | 1.5 | 0 |
| Body Small | Inter | 14px | 1.45 | 0 |
| Caption | Inter 600 | 12px | 1.3 | +2% (uppercase) |

---

## Spacing (8px base)

`4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128`

## Border radius
- `--r-sm`: 6px (tags, inputs)
- `--r-md`: 12px (buttons)
- `--r-lg`: 20px (cards, modals)
- `--r-full`: 9999px (pills, avatars)

## Shadows
- `--shadow-sm`: `0 2px 8px rgba(26,26,26,0.06)`
- `--shadow-md`: `0 8px 24px rgba(26,26,26,0.08)` (card hover)
- `--shadow-lg`: `0 16px 48px rgba(26,26,26,0.12)` (modals)
- `--focus-ring`: `0 0 0 3px rgba(199,91,57,0.2)`

---

## Component anatomy

### Primary Button
- 48px height, 12px radius, padding `14px 24px`
- Terracotta bg, cream text, 15px 600 weight
- Hover: `--color-terracotta-dark`
- Focus: visible focus ring

### Input
- 48px height, 12px radius, `1.5px` border
- Label above in caption style (uppercase, 12px, tracked)
- Focus: border terracotta + focus ring

### Recipe Card
- 20px radius, clipped
- Image top (height 220px), body padding 20px
- Tag pill top-left of image, heart button top-right
- Title Playfair 22/600, meta row with icons + small text
- Hover: translate-Y -4px, shadow-md

### Navbar
- 72px height, cream bg, border-bottom
- Logo left (mark + wordmark), links center, actions right
- Active link = charcoal + bold; inactive = slate + regular

---

## Pages designed

All screens live in the Pencil file, laid out horizontally on canvas:

| # | Screen | What's inside |
|---|---|---|
| 0 | Design System | Color swatches, type scale, buttons, inputs, tags, recipe card, states (toasts/empty/skeleton/modal) |
| 1 | Login | Split 50/50 — hero image left, form right |
| 2 | Signup | Same split, name/email/password/strength meter/terms |
| 3 | Home / Explore | Nav, hero with rotated card stack, 6 categories, featured grid, latest + filter chips, footer |
| 4 | Recipe Detail | Breadcrumb, editorial hero, stats action bar, sticky ingredients + numbered instructions, chef's tip, related recipes |
| 5 | Add Recipe | 4-step progress (Basics → Ingredients → Instructions → Review) |
| 6 | My Recipes | KPI cards, tabs, 8 recipe cards with Published/Draft status |
| 7 | Search Results | Filter sidebar (categories, cuisine, time slider, difficulty), active chips, result grid, pagination |

Screenshots are in this folder (filenames use Pencil node IDs — see key below):
- `pqfAK.png` → Design System
- `QvXWf.png` → Login
- `uHu4D.png` → Signup
- `DloGM.png` → Home
- `keeaa.png` → Recipe Detail
- `OIaWm.png` → Add Recipe
- `m4hH3.png` → My Recipes
- `M7ydM.png` → Search Results
