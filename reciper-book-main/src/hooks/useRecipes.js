import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Realtime recipes subscription.
 *
 * If `ownerUid` is passed we query by that field *without* ordering on the server,
 * which avoids needing a composite (ownerUid + createdAt) index. We sort
 * client-side after receiving the results — fine for reasonable recipe volumes.
 */
export function useRecipes({ ownerUid } = {}) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const base = collection(db, 'recipes');
    const q = ownerUid
      ? query(base, where('ownerUid', '==', ownerUid))
      : query(base, orderBy('createdAt', 'desc'));

    setLoading(true);
    const unsub = onSnapshot(
      q,
      (snap) => {
        let list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (ownerUid) {
          list = list.sort((a, b) => {
            const aTs = a.createdAt?.seconds ?? 0;
            const bTs = b.createdAt?.seconds ?? 0;
            return bTs - aTs;
          });
        }
        setRecipes(list);
        setLoading(false);
      },
      (err) => {
        console.error('useRecipes error:', err);
        setError(err);
        setLoading(false);
      }
    );
    return unsub;
  }, [ownerUid]);

  return { recipes, loading, error };
}
