import { LiveList } from "@liveblocks/client";
import { useMutation } from "@liveblocks/react";

import { Textarea } from "../ui/textarea";
import { CanvasBlock, SquareBlock as SquareBlockType } from "@/types";
import { DraggableResizablePosition } from "../../modules/core/foundation";

export interface SquareProps {
  canvasBlock: SquareBlockType;
}

export default function SquareBlock({ canvasBlock }: SquareProps) {
  const { width, height, text } = canvasBlock;

  const onTextChange = useMutation(({ storage }, value: string) => {
    const items = storage.get("items") as LiveList<CanvasBlock>;
    const block = items.find(
      (item) => item.id === canvasBlock.id
    ) as SquareBlockType;
    const blockIndex = items.findIndex((item) => item.id === canvasBlock.id);

    if (block) {
      block.text = value;
      items.set(blockIndex, block);
    }
  }, []);

  return (
    <DraggableResizablePosition
      id={canvasBlock.id}
      top={canvasBlock.top}
      left={canvasBlock.left}
      canvasBlock={canvasBlock}
      width={canvasBlock.width}
      height={canvasBlock.height}
    >
      <div
        style={{
          width: `${canvasBlock.width}px`,
          height: `${canvasBlock.height}px`,
        }}
        className="border border-gray-300 bg-white rounded-lg shadow-sm flex items-center justify-center"
      >
        <Textarea
          value={text || ""}
          onChange={(e) => onTextChange(e.target.value)}
          className="w-full h-full border-none outline-none"
        />
      </div>
    </DraggableResizablePosition>
  );
}
