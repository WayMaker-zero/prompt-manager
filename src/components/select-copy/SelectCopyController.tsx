import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useI18n } from '../../contexts/I18nContext';
import { useSettings } from '../../contexts/SettingsContext';
import { getSelectionRects } from '../../utils/selection/getSelectionRects';
import {
  getActiveCopyZone,
  isSelectionInCopyZone,
} from '../../utils/selection/isRangeInCopyZone';
import { hasMeaningfulText, serializeSelection } from '../../utils/selection/serializeSelection';
import {
  toZoneLocalRects,
  type ZoneLocalRect,
} from '../../utils/selection/toZoneLocalRects';
import SelectionHighlightOverlay from './SelectionHighlightOverlay';

const DEDUPE_MS = 800;

type HighlightState = {
  zone: HTMLElement;
  rects: ZoneLocalRect[];
};

/**
 * App-wide controller: when select-to-copy is on, highlight selection (in-zone)
 * and copy on mouseup / shift-selection keyup.
 */
export default function SelectCopyController() {
  const { selectToCopyEnabled } = useSettings();
  const { t } = useI18n();
  const [highlight, setHighlight] = useState<HighlightState | null>(null);
  const lastCopiedRef = useRef<{ text: string; at: number }>({ text: '', at: 0 });
  const rafRef = useRef<number | null>(null);
  const observedZoneRef = useRef<HTMLElement | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const clearHighlight = useCallback(() => {
    setHighlight(null);
  }, []);

  const refreshHighlight = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const selection = window.getSelection();
      if (!isSelectionInCopyZone(selection)) {
        setHighlight(null);
        return;
      }

      const zone = getActiveCopyZone(selection);
      if (!zone) {
        setHighlight(null);
        return;
      }

      const viewportRects = getSelectionRects(selection);
      if (viewportRects.length === 0) {
        setHighlight(null);
        return;
      }

      setHighlight({
        zone,
        rects: toZoneLocalRects(zone, viewportRects),
      });
    });
  }, []);

  const tryCopy = useCallback(async () => {
    const selection = window.getSelection();
    if (!isSelectionInCopyZone(selection)) return;

    const text = serializeSelection(selection);
    if (!hasMeaningfulText(text)) return;

    const now = Date.now();
    if (
      lastCopiedRef.current.text === text &&
      now - lastCopiedRef.current.at < DEDUPE_MS
    ) {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      lastCopiedRef.current = { text, at: now };
      toast.success(t.copiedSelection, { duration: 1800 });
    } catch {
      toast.error(t.copyFailed, { duration: 2000 });
    }
  }, [t.copiedSelection, t.copyFailed]);

  // Keep ResizeObserver attached to the active zone
  useEffect(() => {
    if (!selectToCopyEnabled) {
      resizeObserverRef.current?.disconnect();
      observedZoneRef.current = null;
      return;
    }

    const zone = highlight?.zone ?? null;
    if (zone === observedZoneRef.current) return;

    resizeObserverRef.current?.disconnect();
    observedZoneRef.current = zone;

    if (!zone) return;

    const ro = new ResizeObserver(() => {
      refreshHighlight();
    });
    ro.observe(zone);
    resizeObserverRef.current = ro;

    return () => {
      ro.disconnect();
      if (observedZoneRef.current === zone) {
        observedZoneRef.current = null;
      }
    };
  }, [selectToCopyEnabled, highlight?.zone, refreshHighlight]);

  useEffect(() => {
    if (!selectToCopyEnabled) {
      clearHighlight();
      return;
    }

    const onSelectionChange = () => {
      refreshHighlight();
    };

    const onMouseUp = (event: MouseEvent) => {
      if (event.button !== 0) return;
      requestAnimationFrame(() => {
        void tryCopy();
        refreshHighlight();
      });
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.shiftKey || event.key === 'Shift') {
        void tryCopy();
        refreshHighlight();
      }
    };

    const onScrollOrResize = () => {
      refreshHighlight();
    };

    const onSelect = () => {
      refreshHighlight();
    };

    document.addEventListener('selectionchange', onSelectionChange);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('select', onSelect, true);
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);

    refreshHighlight();

    return () => {
      document.removeEventListener('selectionchange', onSelectionChange);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('select', onSelect, true);
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      clearHighlight();
    };
  }, [selectToCopyEnabled, tryCopy, refreshHighlight, clearHighlight]);

  if (!selectToCopyEnabled || !highlight) return null;

  return (
    <SelectionHighlightOverlay zone={highlight.zone} rects={highlight.rects} />
  );
}
