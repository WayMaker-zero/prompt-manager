import { getActiveCopyZoneControl } from './isRangeInCopyZone';

export type ViewportRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const MIRROR_ID = 'pm-select-copy-mirror';

function filterTinyRects(rects: ViewportRect[]): ViewportRect[] {
  return rects.filter((r) => r.width >= 0.5 && r.height >= 0.5);
}

function domRectListToViewport(list: DOMRectList | DOMRect[]): ViewportRect[] {
  const out: ViewportRect[] = [];
  for (let i = 0; i < list.length; i++) {
    const r = list[i];
    out.push({ top: r.top, left: r.left, width: r.width, height: r.height });
  }
  return filterTinyRects(out);
}

/**
 * Measure selection rects inside an input/textarea via an offscreen mirror.
 */
function getFormControlSelectionRects(control: HTMLInputElement | HTMLTextAreaElement): ViewportRect[] {
  const start = control.selectionStart;
  const end = control.selectionEnd;
  if (start == null || end == null || start === end) return [];

  const from = Math.min(start, end);
  const to = Math.max(start, end);
  const style = window.getComputedStyle(control);
  const controlRect = control.getBoundingClientRect();
  const isTextArea = control instanceof HTMLTextAreaElement;

  let mirror = document.getElementById(MIRROR_ID) as HTMLDivElement | null;
  if (!mirror) {
    mirror = document.createElement('div');
    mirror.id = MIRROR_ID;
    mirror.setAttribute('aria-hidden', 'true');
    document.body.appendChild(mirror);
  }

  mirror.style.cssText = [
    'position:fixed',
    'left:-99999px',
    'top:0',
    'visibility:hidden',
    'pointer-events:none',
    'overflow:hidden',
    `width:${control.clientWidth}px`,
    `font:${style.font}`,
    `font-size:${style.fontSize}`,
    `font-family:${style.fontFamily}`,
    `font-weight:${style.fontWeight}`,
    `font-style:${style.fontStyle}`,
    `letter-spacing:${style.letterSpacing}`,
    `line-height:${style.lineHeight}`,
    `text-transform:${style.textTransform}`,
    `text-indent:${style.textIndent}`,
    `padding:${style.paddingTop} ${style.paddingRight} ${style.paddingBottom} ${style.paddingLeft}`,
    `border:${style.border}`,
    `box-sizing:${style.boxSizing}`,
    isTextArea ? 'white-space:pre-wrap' : 'white-space:pre',
    'word-wrap:break-word',
  ].join(';');

  const value = control.value;
  mirror.replaceChildren();

  const before = document.createTextNode(value.slice(0, from));
  const mark = document.createElement('span');
  mark.textContent = value.slice(from, to) || '\u200b';
  const after = document.createTextNode(value.slice(to));
  mirror.append(before, mark, after);

  const markRects = mark.getClientRects();
  const mirrorRect = mirror.getBoundingClientRect();
  const out: ViewportRect[] = [];

  for (let i = 0; i < markRects.length; i++) {
    const r = markRects[i];
    const deltaTop = r.top - mirrorRect.top - (isTextArea ? control.scrollTop : 0);
    const deltaLeft = r.left - mirrorRect.left - (isTextArea ? control.scrollLeft : 0);

    out.push({
      top: controlRect.top + deltaTop,
      left: controlRect.left + deltaLeft,
      width: r.width,
      height: r.height,
    });
  }

  const clipTop = controlRect.top;
  const clipBottom = controlRect.bottom;
  const clipLeft = controlRect.left;
  const clipRight = controlRect.right;

  return filterTinyRects(
    out
      .map((r) => {
        const top = Math.max(r.top, clipTop);
        const left = Math.max(r.left, clipLeft);
        const bottom = Math.min(r.top + r.height, clipBottom);
        const right = Math.min(r.left + r.width, clipRight);
        return {
          top,
          left,
          width: Math.max(0, right - left),
          height: Math.max(0, bottom - top),
        };
      })
      .filter((r) => r.width > 0 && r.height > 0)
  );
}

/**
 * Viewport-relative rects for the current selection (DOM range or form control).
 */
export function getSelectionRects(selection: Selection | null): ViewportRect[] {
  const control = getActiveCopyZoneControl();
  if (control) {
    try {
      return getFormControlSelectionRects(control);
    } catch {
      return [];
    }
  }

  if (!selection || selection.isCollapsed || selection.rangeCount === 0) return [];

  try {
    const range = selection.getRangeAt(0);
    return domRectListToViewport(range.getClientRects());
  } catch {
    return [];
  }
}
