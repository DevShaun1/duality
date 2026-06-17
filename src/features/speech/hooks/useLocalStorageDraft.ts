import { useEffect, useState } from 'react';

/**
 * Persists a string draft to localStorage and restores it on first render.
 *
 * @param {string} storageKey - localStorage key used for the draft value
 * @returns {{ draft: string; setDraft: (value: string) => void; clearDraft: () => void }}
 * Current draft value, setter, and clear helper.
 */
export function useLocalStorageDraft(storageKey: string) {
  const [draft, setDraft] = useState(() => {
    if (typeof window === 'undefined') {
      return '';
    }

    return window.localStorage.getItem(storageKey) ?? '';
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (draft) {
      window.localStorage.setItem(storageKey, draft);
      return;
    }

    window.localStorage.removeItem(storageKey);
  }, [draft, storageKey]);

  const clearDraft = () => {
    setDraft('');
  };

  return {
    draft,
    setDraft,
    clearDraft,
  };
}
