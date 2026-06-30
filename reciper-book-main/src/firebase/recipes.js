// CRUD helpers for recipes + image upload to Firebase Storage.
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes
} from 'firebase/storage';
import { db, storage } from './config';

const recipesCol = collection(db, 'recipes');

export async function uploadRecipeImage(file, ownerUid) {
  if (!file) return null;
  const safeName = `${Date.now()}-${file.name.replace(/[^\w.\-]/g, '_')}`;
  const path = `recipes/${ownerUid}/${safeName}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return { url, path };
}

export async function createRecipe({ data, imageFile, owner }) {
  let image = null;
  if (imageFile) image = await uploadRecipeImage(imageFile, owner.uid);

  const prep = Number(data.prepTime) || 0;
  const cook = Number(data.cookTime) || 0;

  return addDoc(recipesCol, {
    ...data,
    prepTime: prep,
    cookTime: cook,
    totalTime: prep + cook,
    servings: Number(data.servings) || 0,
    titleLower: (data.title || '').toLowerCase(),
    imageUrl: image?.url ?? '',
    imagePath: image?.path ?? '',
    ownerUid: owner.uid,
    ownerName: owner.displayName ?? owner.email ?? 'Anonymous chef',
    ownerPhotoURL: owner.photoURL ?? '',
    favoritedBy: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function updateRecipe(id, { data, imageFile, owner }) {
  const prep = Number(data.prepTime) || 0;
  const cook = Number(data.cookTime) || 0;

  const payload = {
    ...data,
    prepTime: prep,
    cookTime: cook,
    totalTime: prep + cook,
    servings: Number(data.servings) || 0,
    titleLower: (data.title || '').toLowerCase(),
    updatedAt: serverTimestamp(),
  };
  if (imageFile) {
    const image = await uploadRecipeImage(imageFile, owner.uid);
    payload.imageUrl = image.url;
    payload.imagePath = image.path;
  }
  await updateDoc(doc(db, 'recipes', id), payload);
}

export async function deleteRecipe(id, imagePath) {
  if (imagePath) {
    try {
      await deleteObject(ref(storage, imagePath));
    } catch (e) {
      // Image may already be gone — non-fatal.
      console.warn('Could not delete image:', e.message);
    }
  }
  await deleteDoc(doc(db, 'recipes', id));
}

export async function getRecipe(id) {
  const snap = await getDoc(doc(db, 'recipes', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function toggleFavorite(recipeId, uid, isFav) {
  await updateDoc(doc(db, 'recipes', recipeId), {
    favoritedBy: isFav ? arrayRemove(uid) : arrayUnion(uid)
  });
}
