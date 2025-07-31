import { ChevronDownIcon } from "lucide-react";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "./ui/dropdown-menu";
import { useCanvasStore } from "@/modules/state/CanvasStore";

export default function ToolSwitcher() {
  const tool = useCanvasStore((state) => state.tool);
  const setTool = useCanvasStore((state) => state.setTool);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="w-40 flex items-center justify-between"
      >
        <Button
          size="sm"
          variant={"outline"}
          className="flex items-center gap-2"
        >
          {tool === "ui-builder" ? "UI Builder" : "Scope Builder"}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40 w-40 ">
        <DropdownMenuLabel className="text-muted-foreground text-xs">
          Tools
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setTool("ui-builder")}>
          UI Builder
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTool("scope-builder")}>
          Scope Builder
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
