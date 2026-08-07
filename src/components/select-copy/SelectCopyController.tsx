import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useI18n } from '../../contexts/I18nContext';
import { useSettings } from '../../contexts/SettingsContext';
import { getSelectionRects, type ViewportRect } from '../../utils/selection/getSelectionRects';
import { isSelectionInCopyZone } from '../../utils/selection/isRangeInCopyZone';
import { hasMeaningfulText, serializeSelection } from '../../utils/selection/serializeSelection';
import SelectionHighlightOverlay from './SelectionHighlightOverlay';

const DEDUPE_MS = 800;

/**
 * App-wide controller: when select-to-copy is on, highlight selection and
 * copy on mouseup / shift-selection keyup.
 */
export default function SelectCopyController() {
  const { selectToCopyEnabled } = useSettings();
  const { t } = useI18n();
  const [rects, setRects] = useState<ViewportRect[]>([]);
  const lastCopiedRef = useRef<{ text: string; at: number }>({ text: '', at: 0 });
  const rafRef = useRef<number | null>(null);

  const refreshRects = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const selection = window.getSelection();
      if (!isSelectionInCopyZone(selection)) {
        setRects([]);
        return;
      }
      setRects(getSelectionRects(selection));
    });
  }, []);

  const clearRects = useCallback(() => {
    setRects([]);
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

  useEffect(() => {
    if (!selectToCopyEnabled) {
      clearRects();
      return;
    }

    const onSelectionChange = () => {
      refreshRects();
    };

    const onMouseUp = (event: MouseEvent) => {
      if (event.button !== 0) return;
      // Defer so the browser finalizes the selection
      requestAnimationFrame(() => {
        void tryCopy();
        refreshRects();
      });
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.shiftKey || event.key === 'Shift') {
        void tryCopy();
        refreshRects();
      }
    };

    const onScrollOrResize = () => {
      refreshRects();
    };

    const onSelect = () => {
      refreshRects();
    };

    document.addEventListener('selectionchange', onSelectionChange);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('select', onSelect, true);
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);

    refreshRects();

    return () => {
      document.removeEventListener('selectionchange', onSelectionChange);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('select', onSelect, true);
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      clearRects();
    };
  }, [selectToCopyEnabled, tryCopy, refreshRects, clearRects]);

  if (!selectToCopyEnabled) return null;

  return <SelectionHighlightOverlay rects={rects} />;
}
