"use client";

import { GroupIcon } from "lucide-react";

import { Button } from "./ui/button";
import { useCanvasStore } from "@/modules/state/CanvasStore";
import { useGroupManager } from "@/modules/core/useGroupManager";

export default function GroupingTools() {
  const { groupBlocks } = useGroupManager();
  const selectedIds = useCanvasStore((state) => state.selectedIds);

  {
    return selectedIds.length > 0 ? (
      <div>
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => groupBlocks(selectedIds)}
          className="flex flex-col items-center h-12"
        >
          <GroupIcon />
          <span>Group</span>
        </Button>
      </div>
    ) : null;
  }
}
