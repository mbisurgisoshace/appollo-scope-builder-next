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
import {
  BringToFrontIcon,
  CopyIcon,
  SendToBackIcon,
  SettingsIcon,
  TagsIcon,
} from "lucide-react";

import useEditor from "../modules/editor/useEditor";

interface TagSelectorProps {
  blockId: string;
  blockTags: string[];
}

export default function TagSelector({ blockId, blockTags }: TagSelectorProps) {
  const { tags, tagBlock, duplicateBlock, sendToBack, bringToFront } =
    useEditor();
  return (
    <div className="absolute top-[-35px] right-3 z-[100]">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <SettingsIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="flex items-center"
            onClick={() => duplicateBlock(blockId)}
          >
            <CopyIcon size={18} />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center"
            onClick={() => sendToBack(blockId)}
          >
            <SendToBackIcon size={18} />
            Send to Back
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center"
            onClick={() => bringToFront(blockId)}
          >
            <BringToFrontIcon size={18} />
            Bring to Front
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center">
              <TagsIcon size={18} className="mr-2" />
              <span>Tags</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {tags?.map((tag) => (
                  <DropdownMenuItem
                    key={tag._id}
                    disabled={blockTags.includes(tag.name)}
                    onClick={() => tagBlock(blockId, tag.name)}
                  >
                    <span>{tag.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
