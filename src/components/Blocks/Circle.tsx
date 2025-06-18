import { LiveList } from "@liveblocks/client";
import { useMutation } from "@liveblocks/react";

import ColorPicker from "../ColorPicker";
import { Textarea } from "../ui/textarea";
import useEditor from "@/modules/editor/useEditor";
import { CanvasBlock, CircleBlock as CircleBlockType } from "@/types";
import { DraggableResizablePosition } from "../../modules/core/foundation";

export interface CircleProps {
  canvasBlock: CircleBlockType;
}

export default function CircleBlock({ canvasBlock }: CircleProps) {
  const { editBlockStyle } = useEditor();
  const { id, width, height, text, style } = canvasBlock;

  const onTextChange = useMutation(({ storage }, value: string) => {
    const items = storage.get("items") as LiveList<CanvasBlock>;
    const block = items.find(
      (item) => item.id === canvasBlock.id
    ) as CircleBlockType;
    const blockIndex = items.findIndex((item) => item.id === canvasBlock.id);

    if (block) {
      block.text = value;
      items.set(blockIndex, block);
    }
  }, []);

  const calculatedPadding = Math.sqrt(2) * (width / 2) - width / 2;

  return (
    <DraggableResizablePosition
      id={canvasBlock.id}
      top={canvasBlock.top}
      left={canvasBlock.left}
      canvasBlock={canvasBlock}
      width={canvasBlock.width}
      height={canvasBlock.height}
      otherTools={
        <ColorPicker
          backgroundColor={style?.backgroundColor}
          onChangeColor={(value) =>
            editBlockStyle(id, "backgroundColor", value)
          }
        />
      }
    >
      <div
        style={{
          width: `${canvasBlock.width}px`,
          height: `${canvasBlock.height}px`,
          ...style,
        }}
        className="border border-gray-300 bg-white rounded-full shadow-sm flex items-center justify-center"
      >
        <Textarea
          value={text || ""}
          style={{ padding: `${calculatedPadding}px` }}
          onChange={(e) => onTextChange(e.target.value)}
          className="w-full h-full border-transparent shadow-none outline-none focus:ring-0 focus:border-transparent"
        />
      </div>
    </DraggableResizablePosition>
  );
}
