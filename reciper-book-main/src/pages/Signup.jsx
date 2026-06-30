import { Navigate } from 'react-router-dom';

// We use Google sign-in for everything — "sign up" and "sign in" are the same
// action. This file exists only to redirect any stale /signup links.
export default function Signup() {
  return <Navigate to="/login" replace />;
}
