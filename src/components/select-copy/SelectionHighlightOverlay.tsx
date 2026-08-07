import { createPortal } from 'react-dom';
import type { ViewportRect } from '../../utils/selection/getSelectionRects';

interface SelectionHighlightOverlayProps {
  rects: readonly ViewportRect[];
}

/**
 * Custom selection highlight layer (plan B). Does not affect resting content styles.
 */
export default function SelectionHighlightOverlay({ rects }: SelectionHighlightOverlayProps) {
  if (rects.length === 0 || typeof document === 'undefined') return null;

  return createPortal(
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[200]"
      data-select-copy-overlay=""
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
    document.body
  );
}
