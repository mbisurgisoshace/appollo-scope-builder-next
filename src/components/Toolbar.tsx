import { TypeIcon, ImageIcon, TableIcon, Grid3X3Icon } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";

import TagCreator from "./TagCreator";

function ToolbarDraggable({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  return (
    <div
      id={id}
      {...listeners}
      {...attributes}
      ref={setNodeRef}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
    >
      {children}
    </div>
  );
}

export default function Toolbar() {
  return (
    <div className="absolute bottom-12 left-1/2 translate-x-[-50%] border flex gap-15 py-2 px-5 bg-white z-50">
      <ToolbarDraggable id="ui-interview">
        <div className="flex flex-col items-center">
          <TypeIcon />
          <span>Text</span>
        </div>
      </ToolbarDraggable>
      <ToolbarDraggable id="ui-grid">
        <div className="flex flex-col items-center">
          <Grid3X3Icon />
          <span>Grid</span>
        </div>
      </ToolbarDraggable>
      <ToolbarDraggable id="ui-table">
        <div className="flex flex-col items-center">
          <TableIcon />
          <span>Table</span>
        </div>
      </ToolbarDraggable>
      <ToolbarDraggable id="ui-image">
        <div className="flex flex-col items-center">
          <ImageIcon />
          <span>Image</span>
        </div>
      </ToolbarDraggable>
      {/* <div className="flex flex-col items-center">
        <TagsIcon />
        <span>Tags</span>
      </div> */}
      <TagCreator />
    </div>
  );
}
