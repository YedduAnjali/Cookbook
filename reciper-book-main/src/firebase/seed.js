import {
  collection,
  doc,
  writeBatch,
  serverTimestamp,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from './config';
import { seedRecipes } from '../data/seedRecipes';

/**
 * Seeds the Firestore `recipes` collection with 12 Indian recipes,
 * all owned by the signed-in user. Safe to call multiple times — it
 * checks if the user already has seed recipes before writing.
 *
 * Uses writeBatch for a single atomic network call (one trip, not 12).
 *
 * @param {import('firebase/auth').User} user — signed-in Firebase Auth user
 * @returns {Promise<{ added: number, skipped: boolean }>}
 */
export async function seedRecipesForUser(user) {
  if (!user?.uid) throw new Error('You must be signed in to seed recipes.');

  // Idempotency check: if this user already has a recipe with any of the
  // seed titles, assume seeding has already been done.
  const recipesRef = collection(db, 'recipes');
  const existing = await getDocs(
    query(
      recipesRef,
      where('ownerUid', '==', user.uid),
      where('title', '==', seedRecipes[0].title)
    )
  );
  if (!existing.empty) {
    return { added: 0, skipped: true };
  }

  const batch = writeBatch(db);
  const ownerName = user.displayName || user.email || 'Home Cook';
  const ownerPhotoURL = user.photoURL || '';

  seedRecipes.forEach((recipe) => {
    const newDocRef = doc(recipesRef);
    batch.set(newDocRef, {
      ...recipe,
      titleLower: recipe.title.toLowerCase(),
      ownerUid: user.uid,
      ownerName,
      ownerPhotoURL,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  await batch.commit();
  return { added: seedRecipes.length, skipped: false };
}
