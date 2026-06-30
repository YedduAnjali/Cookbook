import { AppBar, Avatar, Box, Button, Stack, Toolbar, Tooltip } from '@mui/material';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useAuth } from '../context/AuthContext';
import { tokens } from '../theme';
import Logo from './Logo';

function initials(nameOrEmail = '') {
  const name = String(nameOrEmail).trim();
  if (!name) return '?';
  if (name.includes('@')) return name[0].toUpperCase();
  const parts = name.split(/\s+/);
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
}

const navLinkSx = {
  color: tokens.slate,
  fontSize: '0.9375rem',
  fontWeight: 500,
  textDecoration: 'none',
  padding: '0.25rem 0',
  transition: 'color 150ms ease',
  '&:hover': { color: tokens.charcoal },
  '&.active': { color: tokens.charcoal, fontWeight: 600 },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/login') return null;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ minHeight: '72px !important', px: { xs: 2, md: 6 } }}>
        <Logo />

        <Stack direction="row" spacing={5} sx={{ ml: 6, display: { xs: 'none', md: 'flex' }, flexGrow: 1 }}>
          <Box component={NavLink} to="/" end sx={navLinkSx}>Explore</Box>
          {user && <Box component={NavLink} to="/add" sx={navLinkSx}>Add Recipe</Box>}
          {user && <Box component={NavLink} to="/my-recipes" sx={navLinkSx}>My Recipes</Box>}
          {user && <Box component={NavLink} to="/favorites" sx={navLinkSx}>Saved</Box>}
        </Stack>

        <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />

        <Stack direction="row" spacing={1.25} alignItems="center">
          {user ? (
            <>
              <Tooltip title={user.displayName || user.email}>
                <Avatar src={user.photoURL || undefined} sx={{ width: 36, height: 36 }}>
                  {initials(user.displayName || user.email)}
                </Avatar>
              </Tooltip>
              <Button onClick={handleLogout} size="small" variant="outlined" startIcon={<LogoutRoundedIcon />} sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
                Log out
              </Button>
            </>
          ) : (
            <Button component={Link} to="/login" variant="contained" color="primary">
              Sign in
            </Button>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
