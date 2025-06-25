import { useStorage } from "@liveblocks/react";

import Block from ".";
import { GroupBlock } from "@/types";
import { DraggableGroup, DraggablePosition } from "@/modules/core/foundation";

interface GroupProps {
  canvasBlock: GroupBlock;
}

export default function Group({ canvasBlock }: GroupProps) {
  const items = useStorage((root) => root.items);

  const blocks =
    items
      ?.filter((item) => item.groupId === canvasBlock.id)
      .map((block) => ({
        ...block,
        top: block.top - canvasBlock.top,
        left: block.left - canvasBlock.left,
      })) || [];

  return (
    <DraggablePosition
      id={canvasBlock.id}
      top={canvasBlock.top}
      left={canvasBlock.left}
      canvasBlock={canvasBlock}
      width={canvasBlock.width}
      height={canvasBlock.height}
    >
      <div
        className="group relative"
        style={{ width: canvasBlock.width, height: canvasBlock.height }}
      >
        {blocks
          .toSorted((a, b) => a.stackOrder - b.stackOrder)
          .map((block, index) => {
            return <Block canvasBlock={block} key={block.id} />;
          })}
      </div>
    </DraggablePosition>
  );
}
