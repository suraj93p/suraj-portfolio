import { useCallback, useEffect, useRef, useState } from 'react';
import { writeClipboard } from '../services/clipboard.service';

export function useContactController(email: string) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'success' | 'error'>('idle');
  const mounted = useRef(true);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; clearTimeout(timer.current); }; }, []);
  const copyEmail = useCallback(async () => {
    clearTimeout(timer.current);
    setCopyStatus('copying');
    try {
      await writeClipboard(email);
      if (mounted.current) setCopyStatus('success');
    } catch { if (mounted.current) setCopyStatus('error'); }
    if (mounted.current) timer.current = setTimeout(() => setCopyStatus('idle'), 6000);
  }, [email]);
  return { copyStatus, copyEmail };
}
