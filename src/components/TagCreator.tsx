"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { PlusIcon, TagsIcon } from "lucide-react";
import {
  Command,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from "./ui/command";
import { Button } from "./ui/button";
import { api } from "../../convex/_generated/api";
import useEditor from "../modules/editor/useEditor";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useCanvasStore } from "@/modules/state/CanvasStore";

export default function TagCreator() {
  const { tags } = useEditor();
  const mutation = useMutation(api.tags.createTask);
  const filterTags = useCanvasStore((state) => state.filterTags);
  const setFilterTags = useCanvasStore((state) => state.setFilterTags);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const addTag = async () => {
    if (!search.trim()) return;

    await mutation({ name: search });

    setSearch("");
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          role="combobox"
          variant="outline"
          aria-expanded={open}
          className="h-[48px] flex flex-col items-center border-none shadow-none"
        >
          <TagsIcon />
          <span>Tags</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Filter by Tags</DropdownMenuLabel>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Apply Filter</DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="p-0">
            <Command>
              <CommandInput placeholder="Search tags..." className="h-9" />
              <CommandList>
                <CommandGroup>
                  {tags?.map((tag) => (
                    <CommandItem
                      key={tag._id}
                      value={tag.name}
                      onSelect={() => {
                        if (filterTags.includes(tag.name)) {
                          setFilterTags(
                            filterTags.filter((t) => t !== tag.name)
                          );
                        } else {
                          setFilterTags([...filterTags, tag.name]);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{tag.name}</span>
                        {filterTags.includes(tag.name) && (
                          <span className="ml-2 text-xs text-green-500">✓</span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <Command>
          <CommandInput
            value={search}
            placeholder="Search"
            onValueChange={(value) => setSearch(value)}
          />
          <CommandList>
            <CommandEmpty>
              <div className="flex items-center justify-center">
                <Button
                  variant="link"
                  onClick={() => addTag()}
                  className="flex flex-col items-center cursor-pointer"
                >
                  <PlusIcon />
                  Add Tag
                </Button>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {tags?.map((tag) => (
                <CommandItem
                  key={tag._id}
                  value={tag.name}
                  onSelect={() => {
                    setOpen(false);
                  }}
                >
                  {tag.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
