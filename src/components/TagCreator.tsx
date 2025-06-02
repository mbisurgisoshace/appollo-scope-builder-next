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

export default function TagCreator() {
  const { tags } = useEditor();
  const mutation = useMutation(api.tags.createTask);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const addTag = async () => {
    if (!search.trim()) return;

    await mutation({ name: search });

    setSearch("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          variant="outline"
          aria-expanded={open}
          className="h-[48px] flex flex-col items-center border-none shadow-none"
        >
          <TagsIcon />
          <span>Tags</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
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
      </PopoverContent>
    </Popover>
  );
}
