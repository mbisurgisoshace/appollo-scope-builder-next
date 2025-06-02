"use client";

import useSize from "@react-hook/size";
import { PointerEvent, useEffect, useRef, WheelEvent } from "react";

import InfiniteCanvas from "./InfiniteCanvas";
import useRenderLoop from "../../modules/core/RenderLoop";
import CanvasStore, { useCanvasStore } from "../../modules/state/CanvasStore";

const CanvasRoot = () => {
  const setScale = useCanvasStore((state) => state.setScale);
  const unselectElement = useCanvasStore((state) => state.unselectElement);

  const canvas = useRef<HTMLDivElement>(null);
  //@ts-ignore
  const [width, height] = useSize(canvas);
  useEffect(() => {
    if (width === 0 || height === 0) return;
    CanvasStore.initialize(width, height, []);
  }, [width, height]);
  const frame = useRenderLoop(60);

  const wheelListener = (e: WheelEvent) => {
    const friction = 1;
    const event = e as WheelEvent;
    const deltaX = event.deltaX * friction;
    const deltaY = event.deltaY * friction;
    if (!event.ctrlKey) {
      CanvasStore.moveCamera(deltaX, deltaY);
    } else {
      CanvasStore.zoomCamera(deltaX, deltaY);
    }

    setScale({ x: CanvasStore.scale.x, y: CanvasStore.scale.y });
  };

  const pointerListener = (event: PointerEvent) => {
    CanvasStore.movePointer(event.clientX, event.clientY);
  };

  return (
    <div className="w-full h-full">
      <div
        ref={canvas}
        className="w-full h-full relative overflow-hidden overscroll-none"
        onWheel={wheelListener}
        onPointerMove={pointerListener}
        onPointerDown={unselectElement}
      >
        <InfiniteCanvas frame={frame} />
      </div>
    </div>
  );
};

export default CanvasRoot;
