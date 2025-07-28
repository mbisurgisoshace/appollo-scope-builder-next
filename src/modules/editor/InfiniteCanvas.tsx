import { memo, useRef } from "react";
import Xarrow from "react-xarrows";
import { useStorage } from "@liveblocks/react";

import Block from "@/components/Blocks";
import CanvasStore, { useCanvasStore } from "../state/CanvasStore";
import { useSelectionBox } from "../core/useSelectionBox";
import Group from "@/components/Blocks/Group";
import useEditor from "./useEditor";

const InfiniteCanvas = ({}: { frame: string }) => {
  const scale = CanvasStore.scale;
  const screen = CanvasStore.screen;
  const items = useStorage((root) => root.items);
  const groups = useStorage((root) => root.groups);
  const arrows = useStorage((root) => root.arrows);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const filterTags = useCanvasStore((state) => state.filterTags);
  const setSelectedIds = useCanvasStore((state) => state.setSelectedIds);

  const startArrowNode = CanvasStore.getStartArrowNode();

  const top = CanvasStore.pointer.y - screen.y;
  const left = CanvasStore.pointer.x - screen.x;

  const getRects = () => {
    const rects: Record<string, DOMRect> = {};
    items?.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) rects[item.id] = el.getBoundingClientRect();
    });
    return rects;
  };

  // const { selectionBox } = useSelectionBox({
  //   //@ts-ignore
  //   containerRef,
  //   getElementRects: getRects,
  //   onSelect: setSelectedIds,
  // });

  return (
    <div
      ref={containerRef}
      id="infinite-canvas"
      className="w-full h-full"
      style={{
        transform: `scale(${(scale.x, scale.y)})`,
        transformOrigin: "top left",
      }}
    >
      {/* {groups?.map((group) => (
        <Block key={group.id} canvasBlock={group} />
      ))} */}
      {items
        ?.filter((b) => {
          if (filterTags.length === 0) return true;
          return filterTags.some((tag) => b.tags?.includes(tag));
        })
        //.filter((b) => !b.groupId)
        .toSorted((a, b) => a.stackOrder - b.stackOrder)
        .map((item, index) => (
          <Block key={index} canvasBlock={item} />
        ))}
      {arrows?.map((arrow) => (
        <Xarrow
          showHead
          path="smooth"
          key={arrow.id}
          start={arrow.start}
          end={arrow.end}
          strokeWidth={2}
        />
      ))}
      {startArrowNode && (
        <>
          <Xarrow start={startArrowNode} end="mouse-preview" />
          <div
            id="mouse-preview"
            style={{
              top,
              left,
              position: "absolute",
              // left: CanvasStore.pointer.x,
              // top: CanvasStore.pointer.y,
              width: 1,
              height: 1,
              pointerEvents: "none",
            }}
          />
        </>
      )}
      {/* {selectionBox && (
        <div
          className="absolute border border-blue-400 bg-blue-200/20 pointer-events-none z-50"
          style={selectionBox}
        />
      )} */}
    </div>
  );
};

export default memo(InfiniteCanvas);
