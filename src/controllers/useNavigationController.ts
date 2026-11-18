import { useCallback, useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import type { PortfolioConfig } from '../models/portfolio.types';

export function useNavigationController(navigation: PortfolioConfig['navigation']) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState('');
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const focusFrame = useRef(0);
  useEffect(() => () => cancelAnimationFrame(focusFrame.current), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) { setMenuOpen(false); toggleRef.current?.focus(); }
    };
    const onOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const viewport = window.matchMedia('(min-width: 60rem)');
    const onResize = () => { if (viewport.matches) setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onOutside);
    viewport.addEventListener('change', onResize);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onOutside); viewport.removeEventListener('change', onResize); };
  }, [isMenuOpen]);
  useEffect(() => {
    const onHash = () => { const id = window.location.hash.slice(1); setActiveSectionId(navigation.some((item) => item.sectionId === id) ? id : ''); };
    window.addEventListener('hashchange', onHash); onHash();
    if (!('IntersectionObserver' in window)) return () => window.removeEventListener('hashchange', onHash);
    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => visible.set(entry.target.id, entry.isIntersecting));
      const first = navigation.find((item) => visible.get(item.sectionId));
      if (first) setActiveSectionId(first.sectionId);
    }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
    navigation.forEach((item) => { const section = document.getElementById(item.sectionId); if (section) observer.observe(section); });
    return () => { observer.disconnect(); window.removeEventListener('hashchange', onHash); };
  }, [navigation]);
  const onNavigate = useCallback((event: MouseEvent<HTMLAnchorElement>, target: string) => {
    setMenuOpen(false);
    if (event.detail === 0) {
      // Run after the anchor's default navigation, which can otherwise override focus.
      cancelAnimationFrame(focusFrame.current);
      focusFrame.current = requestAnimationFrame(() => {
        const section = document.getElementById(target);
        const focusTarget = target === 'main-content' ? section : section?.querySelector<HTMLElement>('h1, h2') ?? section;
        focusTarget?.focus({ preventScroll: true });
      });
    }
  }, []);
  return { isMenuOpen, activeSectionId, headerRef, toggleRef, closeMenu, onNavigate, toggleMenu: () => setMenuOpen((open) => !open) };
}
