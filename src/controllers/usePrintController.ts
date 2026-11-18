import { useCallback, useEffect, useRef } from 'react';

/** CSS restores all filtered roles. Native details are opened only while printing. */
export function usePrintController() {
  const previous = useRef<Map<HTMLDetailsElement, boolean>>(new Map());
  const prepare = useCallback(() => {
    if (previous.current.size) return;
    document.querySelectorAll<HTMLDetailsElement>('main details').forEach((element) => { previous.current.set(element, element.open); element.open = true; });
  }, []);
  const restore = useCallback(() => {
    previous.current.forEach((open, element) => { element.open = open; }); previous.current.clear();
  }, []);
  useEffect(() => {
    window.addEventListener('beforeprint', prepare); window.addEventListener('afterprint', restore);
    return () => { window.removeEventListener('beforeprint', prepare); window.removeEventListener('afterprint', restore); restore(); };
  }, [prepare, restore]);
  return useCallback(() => { prepare(); window.print(); }, [prepare]);
}
