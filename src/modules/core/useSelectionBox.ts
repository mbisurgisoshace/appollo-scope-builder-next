import { useEffect, useState, useCallback } from "react";

interface Point {
  x: number;
  y: number;
}

interface SelectionBox {
  start: Point;
  end: Point;
}

interface UseSelectionBoxProps {
  containerRef: React.RefObject<HTMLDivElement>;
  getElementRects: () => Record<string, DOMRect>; // Each element's position
  onSelect: (selectedIds: string[]) => void;
}

export function useSelectionBox({
  containerRef,
  getElementRects,
  onSelect,
}: UseSelectionBoxProps) {
  const [box, setBox] = useState<SelectionBox | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const onMouseDown = useCallback(
    (e: MouseEvent) => {
      if (e.button !== 0) return;
      if ((e.target as HTMLElement).id === "resize-handle") return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const start = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      setBox({ start, end: start });
      setIsDragging(true);
    },
    [containerRef]
  );

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !box) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      setBox(
        (prev) =>
          prev && {
            ...prev,
            end: {
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            },
          }
      );
    },
    [isDragging, box, containerRef]
  );

  const onMouseUp = useCallback(() => {
    if (!isDragging || !box) return;

    const { start, end } = box;
    const selectionRect = {
      left: Math.min(start.x, end.x),
      top: Math.min(start.y, end.y),
      right: Math.max(start.x, end.x),
      bottom: Math.max(start.y, end.y),
    };

    const elementRects = getElementRects();

    const selected = Object.entries(elementRects)
      .filter(
        ([, rect]) =>
          rect.right > selectionRect.left &&
          rect.left < selectionRect.right &&
          rect.bottom > selectionRect.top &&
          rect.top < selectionRect.bottom
      )
      .map(([id]) => id);

    onSelect(selected);
    setBox(null);
    setIsDragging(false);
  }, [box, isDragging, getElementRects, onSelect]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseDown, onMouseMove, onMouseUp, containerRef]);

  const selectionStyle = box
    ? {
        left: Math.min(box.start.x, box.end.x),
        top: Math.min(box.start.y, box.end.y),
        width: Math.abs(box.end.x - box.start.x),
        height: Math.abs(box.end.y - box.start.y),
      }
    : null;

  return { selectionBox: selectionStyle };
}
