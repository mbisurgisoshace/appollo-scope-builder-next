import { memo } from "react";
import Xarrow from "react-xarrows";
import { useStorage } from "@liveblocks/react";

import Block from "@/components/Blocks";
import CanvasStore from "../state/CanvasStore";

const InfiniteCanvas = ({}: { frame: string }) => {
  const scale = CanvasStore.scale;
  const screen = CanvasStore.screen;
  const items = useStorage((root) => root.items);
  const arrows = useStorage((root) => root.arrows);

  const startArrowNode = CanvasStore.getStartArrowNode();

  const top = CanvasStore.pointer.y - screen.y;
  const left = CanvasStore.pointer.x - screen.x;

  return (
    <div
      id="infinite-canvas"
      className="w-full h-full"
      style={{
        transform: `scale(${(scale.x, scale.y)})`,
        transformOrigin: "top left",
      }}
    >
      {items
        ?.toSorted((a, b) => a.stackOrder - b.stackOrder)
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
    </div>
  );
};

export default memo(InfiniteCanvas);
