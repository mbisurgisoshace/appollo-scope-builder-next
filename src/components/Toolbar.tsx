import {
  TypeIcon,
  ImageIcon,
  TableIcon,
  Grid3X3Icon,
  SquareIcon,
  CircleIcon,
  UserPenIcon,
} from "lucide-react";
import { useDraggable } from "@dnd-kit/core";

import TagCreator from "./TagCreator";
import GroupingTools from "./GroupingTools";

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
    <div className="absolute bottom-12 left-1/2 translate-x-[-50%] border gap-15 py-2 px-5 bg-white z-50 flex items-center">
      <ToolbarDraggable id="ui-text">
        <div className="flex flex-col items-center">
          <TypeIcon />
          <span>Text</span>
        </div>
      </ToolbarDraggable>
      <ToolbarDraggable id="ui-interview">
        <div className="flex flex-col items-center">
          <UserPenIcon />
          <span>Interview</span>
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
      <ToolbarDraggable id="ui-square">
        <div className="flex flex-col items-center">
          <SquareIcon />
          <span>Square</span>
        </div>
      </ToolbarDraggable>
      <ToolbarDraggable id="ui-circle">
        <div className="flex flex-col items-center">
          <CircleIcon />
          <span>Circle</span>
        </div>
      </ToolbarDraggable>
      <ToolbarDraggable id="ui-parallelogram">
        <div className="flex flex-col items-center">
          <CircleIcon />
          <span>Parallelogram</span>
        </div>
      </ToolbarDraggable>
      <ToolbarDraggable id="ui-image">
        <div className="flex flex-col items-center">
          <ImageIcon />
          <span>Image</span>
        </div>
      </ToolbarDraggable>
      <TagCreator />
      <GroupingTools />
    </div>
  );
}
