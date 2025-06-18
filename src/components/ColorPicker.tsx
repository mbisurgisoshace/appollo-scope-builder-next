import {
  DropdownMenu,
  DropdownMenuSub,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "./ui/dropdown-menu";
import { PaintBucketIcon } from "lucide-react";
import { HexColorPicker } from "react-colorful";

import useEditor from "../modules/editor/useEditor";

interface ColorPickerProps {
  backgroundColor?: string;
  onChangeColor: (color: string) => void;
}

export default function ColorPicker({
  onChangeColor,
  backgroundColor = "#ffffff",
}: ColorPickerProps) {
  return (
    <div className="absolute top-[-35px] right-12 z-[100]">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <PaintBucketIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <HexColorPicker color={backgroundColor} onChange={onChangeColor} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
