import { useStorage } from "@liveblocks/react";

import Block from ".";
import { Group as GroupType } from "@/types";
import { DraggableGroup } from "@/modules/core/foundation";

interface GroupProps {
  group: GroupType;
}

export default function Group({ group }: GroupProps) {
  const items = useStorage((root) => root.items);
  const blocks = items?.filter((item) => item.groupId === group.id) || [];

  return (
    <DraggableGroup id={group.id} top={group.top} left={group.left}>
      <div className="group relative">
        {blocks
          .toSorted((a, b) => a.stackOrder - b.stackOrder)
          .map((block, index) => (
            <Block canvasBlock={block} />
          ))}
      </div>
    </DraggableGroup>
  );
}
