import { createPortal } from 'react-dom';
import type { ZoneLocalRect } from '../../utils/selection/toZoneLocalRects';

interface SelectionHighlightOverlayProps {
  zone: HTMLElement;
  rects: readonly ZoneLocalRect[];
}

/**
 * Selection highlight painted inside the active copy zone so it shares
 * the zone's (and ancestors') CSS transforms / layout movement.
 */
export default function SelectionHighlightOverlay({
  zone,
  rects,
}: SelectionHighlightOverlayProps) {
  if (rects.length === 0) return null;

  return createPortal(
    <div
      aria-hidden
      data-select-copy-overlay=""
      className="pointer-events-none absolute left-0 top-0 z-[5] h-0 w-0 overflow-visible"
    >
      {rects.map((rect, index) => (
        <div
          key={`${rect.top}-${rect.left}-${rect.width}-${rect.height}-${index}`}
          className="absolute rounded-sm bg-brand-500/40 dark:bg-brand-400/35"
          style={{
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          }}
        />
      ))}
    </div>,
    zone
  );
}
