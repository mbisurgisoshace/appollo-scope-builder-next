"use client";

import { GroupIcon, UngroupIcon } from "lucide-react";

import { Button } from "./ui/button";
import { useCanvasStore } from "@/modules/state/CanvasStore";
import { useGroupManager } from "@/modules/core/useGroupManager";

export default function GroupingTools() {
  const { groupBlocks, ungroup } = useGroupManager();
  const selectedIds = useCanvasStore((state) => state.selectedIds);
  const selectedElement = useCanvasStore((state) => state.selectedElement);

  const isGroupSelected = selectedElement?.blockType === "group";

  return (
    <div>
      {selectedIds.length > 1 && (
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => groupBlocks(selectedIds)}
          className="flex flex-col items-center h-12"
        >
          <GroupIcon />
          <span>Group</span>
        </Button>
      )}
      {isGroupSelected && (
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => ungroup(selectedElement.id)}
          className="flex flex-col items-center h-12"
        >
          <UngroupIcon />
          <span>Ungroup</span>
        </Button>
      )}
    </div>
  );
}
