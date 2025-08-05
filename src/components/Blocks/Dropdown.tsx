import { useRef } from "react";
import { DropdownBlock as IDropdownBlock } from "../../types";
import { DraggableBlock } from "../../modules/core/foundation";
import { ChevronDownIcon } from "lucide-react";

export interface DropdownProps {
  canvasBlock: IDropdownBlock;
}

export default function Dropdown({ canvasBlock }: DropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

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
      <div
        ref={ref}
        style={{
          width,
          height,
          minWidth: "min-content",
          minHeight: "min-content",
          // width: canvasBlock.width,
          // height: canvasBlock.height,
        }}
        className="bg-foreground-muted text-black border rounded-lg px-2 py-1 shadow transition flex items-center justify-between"
      >
        <span>Select</span>
        <ChevronDownIcon />
      </div>
    </DraggableBlock>
  );
}
