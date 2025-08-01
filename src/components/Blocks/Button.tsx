import { useRef } from "react";
import { ButtonBlock as IButton } from "../../types";
import { DraggableBlock } from "../../modules/core/foundation";

export interface ButtonProps {
  canvasBlock: IButton;
}

export default function Button({ canvasBlock }: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const getDimensions = (): { width: number; height: number } => {
    const { width, height, style } = canvasBlock;

    if (ref.current) {
      return {
        width: Math.max(ref.current.offsetWidth, width),
        height: Math.max(ref.current.offsetHeight, height),
      };
    }

    return { width, height };
  };

  const { width, height } = getDimensions();

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
          minWidth: "min-content",
          minHeight: "min-content",
          // width: canvasBlock.width,
          // height: canvasBlock.height,
        }}
        className="bg-blue-500 text-white rounded-lg px-2 py-1 shadow hover:bg-blue-600 transition"
      >
        {canvasBlock.text}
      </button>
    </DraggableBlock>
  );
}
