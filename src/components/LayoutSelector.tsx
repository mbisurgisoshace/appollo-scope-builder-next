import {
  Drawer,
  DrawerTitle,
  DrawerHeader,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "./ui/drawer";
import { useCanvasStore } from "../modules/state/CanvasStore";
import { useState } from "react";
import { Button } from "./ui/button";
import useEditor from "../modules/editor/useEditor";

function GridContainerIcon({
  layout,
  columns,
  selected,
  onSelect,
}: {
  layout: string;
  columns: number;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      style={{ gridTemplateColumns: layout }}
      className={`cursor-pointer grid size-20 border-[1.5px] rounded-md border-[#6A35FF] p-1 gap-1 ${
        selected ? "border-[2px]" : ""
      }`}
    >
      {Array.from({ length: columns }, (_, index) => (
        <div
          key={index}
          onClick={onSelect}
          className="h-full border border-gray-400 rounded-sm"
        />
      ))}
    </div>
  );
}

const LAYOUTS = [
  { layout: "1fr 1fr", columns: 2 },
  { layout: "1fr 2fr", columns: 2 },
  { layout: "1fr 1fr 1fr", columns: 3 },
  { layout: "1fr 1fr 2fr", columns: 3 },
  { layout: "1fr 1fr 1fr 1fr", columns: 4 },
  { layout: "1fr 1fr 1fr 1fr 1fr 1fr", columns: 6 },
];

export default function LayoutSelector() {
  const { addContainerBlock } = useEditor();
  const { newContainerSetup, setNewContainerSetup } = useCanvasStore();
  const [selectedLayout, setSelectedLayout] = useState<string | null>(null);

  return (
    <Drawer
      direction="right"
      open={!!newContainerSetup}
      onClose={() => {
        setNewContainerSetup();
        setSelectedLayout(null);
      }}
    >
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Create New Layout</DrawerTitle>
            <DrawerDescription>
              Set the column definition for your container.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0 grid grid-cols-3 gap-6 justify-items-center">
            {LAYOUTS.map((layout, index) => (
              <GridContainerIcon
                key={index}
                layout={layout.layout}
                columns={layout.columns}
                selected={selectedLayout === layout.layout}
                onSelect={() => {
                  setSelectedLayout(layout.layout);
                  setNewContainerSetup({
                    ...newContainerSetup!,
                    gridColumnLayout: layout.layout,
                  });
                }}
              />
            ))}
          </div>
          <DrawerFooter>
            <Button disabled={!selectedLayout} onClick={addContainerBlock}>
              Add Layout
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
