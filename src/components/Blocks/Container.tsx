import { useDroppable } from "@dnd-kit/core";

import Block from ".";
import { GridPlaceholder } from "../../modules/core/foundation";
import { useCanvasStore } from "../../modules/state/CanvasStore";
import { ContainerBlock as IContainer } from "../../types";

export interface ContainerProps {
  canvasBlock: IContainer;
}

export default function Container({ canvasBlock }: ContainerProps) {
  const selectedElement = useCanvasStore((state) => state.selectedElement);
  const { setNodeRef } = useDroppable({
    id: canvasBlock.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        width: "100%",
        height: canvasBlock.height,
        gridTemplateColumns: canvasBlock.layout,
        ...canvasBlock.style,
      }}
      className={`relative grid`}
    >
      {canvasBlock.children.map((child) => {
        return <Block key={child.id} canvasBlock={child} />;
      })}
      {
        <GridPlaceholder
          screenId={canvasBlock.id}
          columns={canvasBlock.layout}
        />
      }
      {selectedElement && selectedElement.id === canvasBlock.id && (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            //border: "25px solid #6A35FF",
          }}
          className=" cursor-grab"
        >
          <div className="w-full h-full border-[1.5px] border-[#6A35FF]" />
        </div>
      )}
    </div>
  );
}
