import { memo } from "react";
import { useStorage } from "@liveblocks/react";

import Block from "@/components/Blocks";
import CanvasStore from "../state/CanvasStore";

const InfiniteCanvas = ({}: { frame: string }) => {
  const scale = CanvasStore.scale;
  const items = useStorage((root) => root.items);

  return (
    <div
      id="infinite-canvas"
      className="w-full h-full"
      style={{
        transform: `scale(${(scale.x, scale.y)})`,
        transformOrigin: "top left",
      }}
    >
      {/* @ts-ignore*/}
      {items?.map((item, index) => (
        <Block key={index} canvasBlock={item} />
      ))}
    </div>
  );
};

export default memo(InfiniteCanvas);
