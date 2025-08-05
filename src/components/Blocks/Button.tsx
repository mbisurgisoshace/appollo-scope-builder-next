import { useRef } from "react";
import { ButtonBlock as IButton } from "../../types";
import { DraggableBlock } from "../../modules/core/foundation";

export interface ButtonProps {
  canvasBlock: IButton;
}

export default function Button({ canvasBlock }: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const { width, height, style } = canvasBlock;

  console.log("style:", style);

  return (
    <DraggableBlock
      width={width}
      height={height}
      id={canvasBlock.id}
      top={canvasBlock.top}
      left={canvasBlock.left}
      canvasBlock={canvasBlock}
      style={canvasBlock.style}
      // width={canvasBlock.width}
      // height={canvasBlock.height}
    >
      <button
        ref={ref}
        style={{
          width,
          height,
          ...style,
          //minWidth: "min-content",
          //minHeight: "min-content",
          // width: canvasBlock.width,
          // height: canvasBlock.height,
        }}
        className="rounded-lg px-2 py-1 shadow transition"
      >
        {canvasBlock.text}
      </button>
    </DraggableBlock>
  );
}
