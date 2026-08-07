const ZONE_SELECTOR = '[data-select-copy-zone]';

function resolveElement(node: Node | null): Element | null {
  if (!node) return null;
  return node.nodeType === Node.ELEMENT_NODE
    ? (node as Element)
    : node.parentElement;
}

export function findCopyZone(node: Node | null): HTMLElement | null {
  const el = resolveElement(node);
  if (!el) return null;
  return el.closest(ZONE_SELECTOR) as HTMLElement | null;
}

function isTextControl(el: Element | null): el is HTMLInputElement | HTMLTextAreaElement {
  if (!el) return false;
  if (el instanceof HTMLTextAreaElement) return true;
  if (el instanceof HTMLInputElement) {
    const type = (el.type || 'text').toLowerCase();
    return type === 'text' || type === 'search' || type === '';
  }
  return false;
}

/** Active text control with a non-empty caret range, inside a copy zone. */
export function getActiveCopyZoneControl(): HTMLInputElement | HTMLTextAreaElement | null {
  const active = document.activeElement;
  if (!isTextControl(active)) return null;
  if (!findCopyZone(active)) return null;
  const start = active.selectionStart;
  const end = active.selectionEnd;
  if (start == null || end == null || start === end) return null;
  return active;
}

/**
 * Valid when there is a non-collapsed selection whose both ends share one copy zone,
 * or a non-empty selection inside a zone-bound form control.
 */
export function isSelectionInCopyZone(selection: Selection | null): boolean {
  if (getActiveCopyZoneControl()) return true;

  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    return false;
  }

  const anchorZone = findCopyZone(selection.anchorNode);
  const focusZone = findCopyZone(selection.focusNode);
  if (!anchorZone || !focusZone) return false;
  return anchorZone === focusZone;
}

export function getActiveCopyZone(selection: Selection | null): HTMLElement | null {
  const control = getActiveCopyZoneControl();
  if (control) return findCopyZone(control);

  if (!isSelectionInCopyZone(selection) || !selection) return null;
  return findCopyZone(selection.anchorNode);
}
