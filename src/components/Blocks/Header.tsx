import { useRef } from "react";
import { HeaderBlock as IHeader } from "../../types";
import { DraggableBlock } from "../../modules/core/foundation";

export interface HeaderProps {
  canvasBlock: IHeader;
}

export default function Header({ canvasBlock }: HeaderProps) {
  const ref = useRef<HTMLHeadingElement>(null);

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
      <h3
        ref={ref}
        style={{
          width,
          height,
          minWidth: "min-content",
          minHeight: "min-content",
          ...canvasBlock.style,
          // width: canvasBlock.width,
          // height: canvasBlock.height,
        }}
      >
        {canvasBlock.text}
      </h3>
    </DraggableBlock>
  );
}
