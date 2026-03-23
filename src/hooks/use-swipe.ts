import { useEffect, useRef, useCallback } from 'react';

interface SwipeConfig {
  /** Element to attach listeners to */
  elementRef: React.RefObject<HTMLElement | null>;
  /** Min horizontal distance to count as swipe */
  minDistance?: number;
  /** Max vertical distance (prevents triggering on scroll) */
  maxVertical?: number;
  /** Edge zone width in px — only triggers if touch starts within this zone */
  edgeZone?: number;
  /** Which edge: 'left' = left edge of screen, 'right' = right edge */
  edge: 'left' | 'right';
  /** Called when a valid swipe-open gesture is detected */
  onSwipeOpen: () => void;
  /** Called when a valid swipe-close gesture is detected */
  onSwipeClose: () => void;
  /** Whether the panel is currently open */
  isOpen: boolean;
  /** Only active below this breakpoint (px) */
  maxWidth?: number;
}

export function useEdgeSwipe({
  elementRef,
  minDistance = 60,
  maxVertical = 40,
  edgeZone = 40,
  edge,
  onSwipeOpen,
  onSwipeClose,
  isOpen,
  maxWidth = 768,
}: SwipeConfig) {
  const startX = useRef(0);
  const startY = useRef(0);
  const isEdgeTouch = useRef(false);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (window.innerWidth >= maxWidth) return;
      const touch = e.touches[0];
      startX.current = touch.clientX;
      startY.current = touch.clientY;

      if (edge === 'left') {
        isEdgeTouch.current = isOpen || touch.clientX <= edgeZone;
      } else {
        isEdgeTouch.current = isOpen || touch.clientX >= window.innerWidth - edgeZone;
      }
    },
    [edge, edgeZone, isOpen, maxWidth],
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!isEdgeTouch.current) return;
      if (window.innerWidth >= maxWidth) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - startX.current;
      const dy = Math.abs(touch.clientY - startY.current);

      if (Math.abs(dx) < minDistance || dy > maxVertical) return;

      if (edge === 'left') {
        if (dx > 0 && !isOpen) onSwipeOpen();
        if (dx < 0 && isOpen) onSwipeClose();
      } else {
        if (dx < 0 && !isOpen) onSwipeOpen();
        if (dx > 0 && isOpen) onSwipeClose();
      }
    },
    [edge, isOpen, minDistance, maxVertical, onSwipeOpen, onSwipeClose, maxWidth],
  );

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [elementRef, handleTouchStart, handleTouchEnd]);
}
