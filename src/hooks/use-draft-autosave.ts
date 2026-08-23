"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function useDraftAutosave(key: string, form: Record<string, string | boolean>, delay = 2000) {
  const [hasDraft, setHasDraft] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const formRef = useRef(form);
  formRef.current = form;

  const storageKey = `draft_${key}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setHasDraft(true);
      }
    } catch {}
  }, [storageKey]);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(formRef.current));
      } catch {}
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [form, delay, storageKey]);

  const loadDraft = useCallback((): Record<string, string | boolean> | null => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  }, [storageKey]);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      setHasDraft(false);
    } catch {}
  }, [storageKey]);

  return { hasDraft, loadDraft, clearDraft };
}
