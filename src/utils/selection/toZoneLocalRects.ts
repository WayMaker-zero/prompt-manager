import type { ViewportRect } from './getSelectionRects';

export type ZoneLocalRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

/**
 * Convert viewport-space selection rects into coordinates relative to a copy zone
 * (content origin, including current scroll offset).
 * Highlights rendered inside the zone then share the zone's transforms.
 */
export function toZoneLocalRects(
  zone: HTMLElement,
  viewportRects: readonly ViewportRect[]
): ZoneLocalRect[] {
  const box = zone.getBoundingClientRect();
  const scrollTop = zone.scrollTop;
  const scrollLeft = zone.scrollLeft;

  return viewportRects
    .map((r) => ({
      top: r.top - box.top + scrollTop,
      left: r.left - box.left + scrollLeft,
      width: r.width,
      height: r.height,
    }))
    .filter((r) => r.width >= 0.5 && r.height >= 0.5);
}
