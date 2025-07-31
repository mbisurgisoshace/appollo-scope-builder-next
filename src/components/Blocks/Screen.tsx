import { useDndContext, useDroppable } from "@dnd-kit/core";

import Block from ".";
import { ScreenBlock as IScreen } from "../../types";
import { DraggablePosition } from "../../modules/core/foundation";

export interface ScreenProps {
  canvasBlock: IScreen;
}

export default function Screen({ canvasBlock }: ScreenProps) {
  const { setNodeRef } = useDroppable({
    id: canvasBlock.id,
  });

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
        ref={setNodeRef}
        style={{
          width: canvasBlock.width,
          height: canvasBlock.height,
        }}
        className={`bg-white rounded-xl shadow-2xl relative`}
      >
        <h3 className="font-bold text-xs text-[#111827] opacity-40 absolute left-0 -top-7">
          {canvasBlock.name}
        </h3>
        {canvasBlock.children.map((child) => {
          return <Block key={child.id} canvasBlock={child} />;
        })}
      </div>
    </DraggablePosition>
  );
}
