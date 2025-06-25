import { useStorage } from "@liveblocks/react";

import Block from ".";
import { GroupBlock } from "@/types";
import { DraggableGroup, DraggablePosition } from "@/modules/core/foundation";

interface GroupProps {
  canvasBlock: GroupBlock;
}

export default function Group({ canvasBlock }: GroupProps) {
  const items = useStorage((root) => root.items);
  const blocks = items?.filter((item) => item.groupId === canvasBlock.id) || [];

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
          .map((block, index) => (
            <Block canvasBlock={block} key={block.id} />
          ))}
      </div>
    </DraggablePosition>
    // <DraggableGroup
    //   id={group.id}
    //   top={group.top}
    //   left={group.left}
    //   width={group.width}
    //   height={group.height}
    // >
    //   <div className="group relative">
    //     {blocks
    //       .toSorted((a, b) => a.stackOrder - b.stackOrder)
    //       .map((block, index) => (
    //         <Block canvasBlock={block} key={block.id} />
    //       ))}
    //   </div>
    // </DraggableGroup>
  );
}
