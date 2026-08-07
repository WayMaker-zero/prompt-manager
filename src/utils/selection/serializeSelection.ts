import { stripVariableBraces } from './stripVariableBraces';
import {
  findCopyZone,
  getActiveCopyZoneControl,
  isSelectionInCopyZone,
} from './isRangeInCopyZone';

function variableDisplayValue(input: HTMLInputElement): string {
  if (input.value.length > 0) return input.value;
  return input.dataset.varName || input.placeholder || '';
}

function serializeFormControl(control: HTMLInputElement | HTMLTextAreaElement): string {
  const start = control.selectionStart ?? 0;
  const end = control.selectionEnd ?? 0;
  const sliced = control.value.slice(Math.min(start, end), Math.max(start, end));
  if (control instanceof HTMLInputElement && control.dataset.selectCopyPart === 'var') {
    return sliced;
  }
  return stripVariableBraces(sliced);
}

function rangesIntersect(a: Range, b: Range): boolean {
  return (
    a.compareBoundaryPoints(Range.END_TO_START, b) < 0 &&
    a.compareBoundaryPoints(Range.START_TO_END, b) > 0
  );
}

function extractTextNodeSlice(node: Text, range: Range): string {
  const nodeRange = document.createRange();
  nodeRange.selectNodeContents(node);
  if (!rangesIntersect(range, nodeRange)) return '';

  let startOffset = 0;
  let endOffset = node.data.length;

  if (range.startContainer === node) {
    startOffset = range.startOffset;
  } else if (range.compareBoundaryPoints(Range.START_TO_START, nodeRange) > 0) {
    // selection starts inside this node but container isn't node — uncommon
    startOffset = 0;
  } else {
    startOffset = 0;
  }

  if (range.endContainer === node) {
    endOffset = range.endOffset;
  } else if (range.compareBoundaryPoints(Range.END_TO_END, nodeRange) < 0) {
    endOffset = node.data.length;
  } else {
    endOffset = node.data.length;
  }

  // Full containment
  if (
    range.compareBoundaryPoints(Range.START_TO_START, nodeRange) <= 0 &&
    range.compareBoundaryPoints(Range.END_TO_END, nodeRange) >= 0
  ) {
    return node.data;
  }

  if (range.startContainer === node && range.endContainer === node) {
    return node.data.slice(range.startOffset, range.endOffset);
  }
  if (range.startContainer === node) {
    return node.data.slice(range.startOffset);
  }
  if (range.endContainer === node) {
    return node.data.slice(0, range.endOffset);
  }

  return node.data.slice(startOffset, endOffset);
}

function walk(node: Node, range: Range, chunks: string[]): void {
  if (node.nodeType === Node.TEXT_NODE) {
    const parent = node.parentElement;
    if (parent && (parent.tagName === 'INPUT' || parent.tagName === 'TEXTAREA')) {
      return;
    }
    const slice = extractTextNodeSlice(node as Text, range);
    if (slice) chunks.push(slice);
    return;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return;
  const el = node as HTMLElement;

  if (el instanceof HTMLInputElement && el.dataset.selectCopyPart === 'var') {
    const elRange = document.createRange();
    try {
      elRange.selectNode(el);
      if (rangesIntersect(range, elRange)) {
        chunks.push(variableDisplayValue(el));
      }
    } catch {
      // selectNode can fail if detached
    }
    return;
  }

  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    return;
  }

  const children = el.childNodes;
  for (let i = 0; i < children.length; i++) {
    walk(children[i], range, chunks);
  }
}

function serializeDomRange(range: Range, zone: HTMLElement): string {
  const chunks: string[] = [];
  walk(zone, range, chunks);
  return stripVariableBraces(chunks.join(''));
}

/**
 * Clipboard plain text for the current selection inside a copy zone.
 */
export function serializeSelection(selection: Selection | null): string | null {
  const control = getActiveCopyZoneControl();
  if (control) {
    return serializeFormControl(control);
  }

  if (!selection || !isSelectionInCopyZone(selection)) return null;

  if (selection.rangeCount === 0) return null;
  const range = selection.getRangeAt(0);
  const zone = findCopyZone(selection.anchorNode);
  if (!zone) return null;

  const hasVarInput = zone.querySelector('input[data-select-copy-part="var"]') != null;
  if (hasVarInput) {
    return serializeDomRange(range, zone);
  }

  return stripVariableBraces(selection.toString());
}

/** True when text is non-empty and not only whitespace. */
export function hasMeaningfulText(text: string | null | undefined): text is string {
  if (text == null) return false;
  return !/^\s*$/.test(text);
}
