import { LiveList } from "@liveblocks/client";
import { useMutation } from "@liveblocks/react";

import {
  CanvasBlock,
  ParallelogramBlock as ParallelogramBlockType,
} from "@/types";
import ColorPicker from "../ColorPicker";
import { Textarea } from "../ui/textarea";
import useEditor from "@/modules/editor/useEditor";
import { DraggableResizablePosition } from "../../modules/core/foundation";

import "./index.css";

export interface ParallelogramProps {
  canvasBlock: ParallelogramBlockType;
}

export default function ParallelogramBlock({
  canvasBlock,
}: ParallelogramProps) {
  const { editBlockStyle } = useEditor();
  const { id, width, height, text, style } = canvasBlock;

  const onTextChange = useMutation(({ storage }, value: string) => {
    const items = storage.get("items") as LiveList<CanvasBlock>;
    const block = items.find(
      (item) => item.id === canvasBlock.id
    ) as ParallelogramBlockType;
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
      selectedBoxSizeAdjustment={{ width: 85, height: 0 }}
    >
      <div
        style={{
          width: `${canvasBlock.width}px`,
          height: `${canvasBlock.height}px`,
          ...style,
        }}
        className="parallelogram border border-gray-300 bg-white rounded-lg shadow-sm flex items-center justify-center"
      >
        <Textarea
          value={text || ""}
          onChange={(e) => onTextChange(e.target.value)}
          className="w-full h-full border-none outline-none"
        />
      </div>
      <ColorPicker
        backgroundColor={style?.backgroundColor}
        onChangeColor={(value) => editBlockStyle(id, "backgroundColor", value)}
      />
    </DraggableResizablePosition>
  );
}
