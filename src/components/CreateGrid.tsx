"use client";

import { useRef } from "react";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import useEditor from "../modules/editor/useEditor";

interface CreateGridProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateGrid({ isOpen, onClose }: CreateGridProps) {
  const { addGridBlock } = useEditor();

  const rowsRef = useRef<HTMLInputElement>(null);
  const colsRef = useRef<HTMLInputElement>(null);

  const onCreateGrid = async () => {
    const rows = parseInt(rowsRef.current?.value || "0", 10);
    const cols = parseInt(colsRef.current?.value || "0", 10);

    if (rows > 0 && cols > 0) {
      addGridBlock(rows, cols);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Grid</DialogTitle>
          <DialogDescription>
            Select the number of columns and rows for the grid you want to
            create.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row items-center justify-center gap-4">
          <div className="flex flex-col gap-2">
            <Label>Rows</Label>
            <Input type="number" ref={rowsRef} defaultValue={1} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Columns</Label>
            <Input type="number" ref={colsRef} defaultValue={1} />
          </div>
        </div>
        <DialogFooter>
          <Button variant={"outline"} onClick={onCreateGrid}>
            Create
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
