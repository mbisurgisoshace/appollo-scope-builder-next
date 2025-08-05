import { useState } from "react";
import { Sketch } from "@uiw/react-color";

import { Label } from "./ui/label";
//import NumberInput from "./ui/NumberInput";
import { useCanvasStore } from "../modules/state/CanvasStore";
// import { Table, Screen, ContainerBlock, Tool } from "../modules/types";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "./ui/select";
import { WallpaperIcon, DatabaseIcon, LightbulbIcon } from "lucide-react";
import useBlock from "../modules/editor/useBlock";
import { ButtonBlock, CanvasBlock } from "@/types";
import useEditor from "@/modules/editor/useEditor";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export default function RightSidebar() {
  const selectedElement = useCanvasStore((state) => state.selectedElement);

  const renderSidebar = () => {
    switch (selectedElement?.blockType) {
      // case "table":
      //   return <TableSidebar tableBlock={selectedElement} />;
      // case "header":
      //   return <HeaderSidebar />;
      // case "screen":
      //   return <ScreenSidebar screenBlock={selectedElement} />;
      // case "container":
      //   return <ContainerSidebar containerBlock={selectedElement} />;
      // case "button":
      //   return <ButtonSidebar buttonBlock={selectedElement} />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        height: "calc(100vh - 46px)",
      }}
      className="w-64 absolute right-0 top-[46px] z-50 bg-white border-l-[0.5px] border-l-[#E4E5ED] box-border py-2"
    >
      {selectedElement && <GeneralSidebar block={selectedElement} />}
      {renderSidebar()}
    </div>
  );
}

/**
 * General Block Sidebar
 */

function GeneralSidebar({ block }: { block: CanvasBlock }) {
  const { editStyle } = useEditor();
  const { width, height } = block;

  return (
    <div className="flex flex-col w-full">
      <div className="w-full border-t-[1.5px] border-t-gray-300 p-2">
        <h3 className="font-semibold text-sm">Layout</h3>
        <div className="mt-2 flex flex-row items-center justify-between">
          <span className="text-muted-foreground text-sm">Width</span>
          <span className="flex items-center w-20">
            <Input
              min={0}
              type="number"
              className="w-16 text-right h-9 p-0 mr-1"
              value={width}
              onChange={(e) => {
                editStyle(block.id, "width", e.target.value);
              }}
            />
            px
          </span>
        </div>
        <div className="mt-2 flex flex-row items-center justify-between">
          <span className="text-muted-foreground text-sm">Height</span>
          <span className="flex items-center w-20">
            <Input
              min={0}
              type="number"
              className="w-16 text-right h-9 p-0 mr-1"
              value={height}
              onChange={(e) => {
                editStyle(block.id, "height", e.target.value);
              }}
            />
            px
          </span>
        </div>
      </div>

      <div className="w-full border-t-[1.5px] border-t-gray-300 p-2">
        <h3 className="font-semibold text-sm">Typography</h3>
        <div className="mt-2 flex flex-row items-center justify-between">
          <span className="text-muted-foreground text-sm">Font</span>
          <span className="flex items-center w-36">
            <Select
              value={block.style?.fontFamily || "Courier New"}
              onValueChange={(value) =>
                editStyle(block.id, "fontFamily", value)
              }
            >
              <SelectTrigger className="h-9 w-36">
                <SelectValue placeholder="" className="h-9 w-36" />
              </SelectTrigger>
              <SelectContent className="w-36">
                <SelectGroup>
                  <SelectItem value="Courier New">Courier New</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectItem value="Gill Sans">Gill Sans</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectItem value="Segoe UI">Segoe UI</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </span>
        </div>

        <div className="mt-2 flex flex-row items-center justify-between">
          <span className="text-muted-foreground text-sm">Weight</span>
          <span className="flex items-center w-20">
            <Select
              value={block.style?.fontWeight || "400"}
              onValueChange={(value) =>
                editStyle(block.id, "fontWeight", value)
              }
            >
              <SelectTrigger className="h-9 w-20">
                <SelectValue placeholder="" className="h-9 w-20" />
              </SelectTrigger>
              <SelectContent className="w-20">
                <SelectGroup>
                  <SelectItem value="300">300</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectItem value="400">400</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectItem value="700">700</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </span>
        </div>

        <div className="mt-2 flex flex-row items-center justify-between">
          <span className="text-muted-foreground text-sm">Size</span>
          <span className="flex items-center w-20">
            <Input
              min={0}
              type="number"
              className="w-16 text-right h-9p p-0 mr-1"
              value={block.style?.fontSize || 14}
              onChange={(e) => {
                editStyle(block.id, "fontSize", e.target.value);
              }}
            />
            px
          </span>
        </div>
      </div>

      <div className="w-full border-t-[1.5px] border-t-gray-300 p-2">
        <h3 className="font-semibold text-sm">Colors</h3>
        <div className="mt-2 flex flex-row items-center justify-between">
          <span className="text-muted-foreground text-sm">Font</span>
          <span className="flex items-center">
            <Popover>
              <PopoverTrigger asChild>
                <div
                  className="w-4 h-4 border-[1.5px] border-black rounded-xs"
                  style={{
                    backgroundColor: block.style?.color || "#000",
                  }}
                />
              </PopoverTrigger>
              <PopoverContent className="p-0 max-w-max">
                <Sketch
                  color={block.style?.color || "#000"}
                  onChange={(color) => editStyle(block.id, "color", color.hex)}
                />
              </PopoverContent>
            </Popover>
          </span>
        </div>

        <div className="mt-2 flex flex-row items-center justify-between">
          <span className="text-muted-foreground text-sm">Background</span>
          <span className="flex items-center">
            <Popover>
              <PopoverTrigger asChild>
                <div
                  className="w-4 h-4 border-[1.5px] border-black rounded-xs"
                  style={{
                    backgroundColor: block.style?.backgroundColor || "#000",
                  }}
                />
              </PopoverTrigger>
              <PopoverContent className="p-0 max-w-max">
                <Sketch
                  color={block.style?.backgroundColor || "#000"}
                  onChange={(color) =>
                    editStyle(block.id, "backgroundColor", color.hex)
                  }
                />
              </PopoverContent>
            </Popover>
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Button Block Sidebar
 */

function ButtonSidebar({ buttonBlock }: { buttonBlock: ButtonBlock }) {
  const { editStyle } = useEditor();
  const { width, height } = buttonBlock;

  return (
    <div className="flex flex-col w-full">
      <div className="w-full border-t-[1.5px] border-t-gray-300 p-2">
        <h3 className="font-semibold text-sm">Layout</h3>
        <div className="mt-2 flex flex-row items-center justify-between">
          <span className="text-muted-foreground text-sm">Width</span>
          <span className="flex items-center w-20">
            <Input
              min={0}
              type="number"
              className="w-16 text-right h-9 p-0 mr-1"
              value={width}
              onChange={(e) => {
                editStyle(buttonBlock.id, "width", e.target.value);
              }}
            />
            px
          </span>
        </div>
        <div className="mt-2 flex flex-row items-center justify-between">
          <span className="text-muted-foreground text-sm">Height</span>
          <span className="flex items-center w-20">
            <Input
              min={0}
              type="number"
              className="w-16 text-right h-9 p-0 mr-1"
              value={height}
              onChange={(e) => {
                editStyle(buttonBlock.id, "height", e.target.value);
              }}
            />
            px
          </span>
        </div>
      </div>

      <div className="w-full border-t-[1.5px] border-t-gray-300 p-2">
        <h3 className="font-semibold text-sm">Typography</h3>
        <div className="mt-2 flex flex-row items-center justify-between">
          <span className="text-muted-foreground text-sm">Font</span>
          <span className="flex items-center w-36">
            <Select
              value={buttonBlock.style?.fontFamily || "Courier New"}
              onValueChange={(value) =>
                editStyle(buttonBlock.id, "fontFamily", value)
              }
            >
              <SelectTrigger className="h-9 w-36">
                <SelectValue placeholder="" className="h-9 w-36" />
              </SelectTrigger>
              <SelectContent className="w-36">
                <SelectGroup>
                  <SelectItem value="Courier New">Courier New</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectItem value="Gill Sans">Gill Sans</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectItem value="Segoe UI">Segoe UI</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </span>
        </div>

        <div className="mt-2 flex flex-row items-center justify-between">
          <span className="text-muted-foreground text-sm">Weight</span>
          <span className="flex items-center w-20">
            <Select
              value={buttonBlock.style?.fontWeight || "400"}
              onValueChange={(value) =>
                editStyle(buttonBlock.id, "fontWeight", value)
              }
            >
              <SelectTrigger className="h-9 w-20">
                <SelectValue placeholder="" className="h-9 w-20" />
              </SelectTrigger>
              <SelectContent className="w-20">
                <SelectGroup>
                  <SelectItem value="300">300</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectItem value="400">400</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectItem value="700">700</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </span>
        </div>

        <div className="mt-2 flex flex-row items-center justify-between">
          <span className="text-muted-foreground text-sm">Size</span>
          <span className="flex items-center w-20">
            <Input
              min={0}
              type="number"
              className="w-16 text-right h-9p p-0 mr-1"
              value={buttonBlock.style?.fontSize || 14}
              onChange={(e) => {
                editStyle(buttonBlock.id, "fontSize", e.target.value);
              }}
            />
            px
          </span>
        </div>
      </div>

      <div className="w-full border-t-[1.5px] border-t-gray-300 p-2">
        <h3 className="font-semibold text-sm">Colors</h3>
        <div className="mt-2 flex flex-row items-center justify-between">
          <span className="text-muted-foreground text-sm">Font</span>
          <span className="flex items-center">
            <Popover>
              <PopoverTrigger asChild>
                <div
                  className="w-4 h-4 border-[1.5px] border-black rounded-xs"
                  style={{
                    backgroundColor: buttonBlock.style?.color || "#000",
                  }}
                />
              </PopoverTrigger>
              <PopoverContent className="p-0 max-w-max">
                <Sketch
                  color={buttonBlock.style?.color || "#000"}
                  onChange={(color) =>
                    editStyle(buttonBlock.id, "color", color.hex)
                  }
                />
              </PopoverContent>
            </Popover>
          </span>
        </div>

        <div className="mt-2 flex flex-row items-center justify-between">
          <span className="text-muted-foreground text-sm">Background</span>
          <span className="flex items-center">
            <Popover>
              <PopoverTrigger asChild>
                <div
                  className="w-4 h-4 border-[1.5px] border-black rounded-xs"
                  style={{
                    backgroundColor:
                      buttonBlock.style?.backgroundColor || "#000",
                  }}
                />
              </PopoverTrigger>
              <PopoverContent className="p-0 max-w-max">
                <Sketch
                  color={buttonBlock.style?.backgroundColor || "#000"}
                  onChange={(color) =>
                    editStyle(buttonBlock.id, "backgroundColor", color.hex)
                  }
                />
              </PopoverContent>
            </Popover>
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Table Block Sidebar
 */

type TableTab = "structure" | "style" | "data";

const TABLE_SIDEBAR_TABS: { id: TableTab; title: string }[] = [
  {
    id: "structure",
    title: "Structure",
  },
  {
    id: "style",
    title: "Style",
  },
  {
    id: "data",
    title: "Data",
  },
];
