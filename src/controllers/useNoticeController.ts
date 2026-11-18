import { useEffect, useRef, useState } from 'react';

/** Move a floating notice out of the way of keyboard focus, without moving focus. */
export function useNoticeController(visible: boolean) {
  const noticeRef = useRef<HTMLElement>(null);
  const [placement, setPlacement] = useState<'bottom' | 'top'>('bottom');
  useEffect(() => {
    if (!visible) return;
    let frame = 0;
    const check = () => {
      const notice = noticeRef.current;
      const focused = document.activeElement;
      if (!notice || !(focused instanceof HTMLElement) || focused === document.body || notice.contains(focused)) return;
      const a = notice.getBoundingClientRect(); const b = focused.getBoundingClientRect();
      if (a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top) {
        setPlacement((current) => current === 'bottom' ? 'top' : 'bottom');
      }
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(check); };
    document.addEventListener('focusin', schedule);
    window.addEventListener('resize', schedule);
    window.addEventListener('scroll', schedule, { passive: true });
    schedule();
    return () => { cancelAnimationFrame(frame); document.removeEventListener('focusin', schedule); window.removeEventListener('resize', schedule); window.removeEventListener('scroll', schedule); };
  }, [visible]);
  return { noticeRef, placement };
}
