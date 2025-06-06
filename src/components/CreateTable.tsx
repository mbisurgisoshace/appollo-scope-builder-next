"use client";

import { PlusIcon } from "lucide-react";
import { useRef, useState } from "react";

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
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import useEditor from "../modules/editor/useEditor";
import CanvasStore from "@/modules/state/CanvasStore";

interface CreateGridProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTable({ isOpen, onClose }: CreateGridProps) {
  const { addTableBlock } = useEditor();

  const colsRef = useRef<HTMLInputElement>(null);
  const [cols, setCols] = useState<string[]>([]);

  const onCreateTable = () => {
    const colsDefinition = cols.map((col) => ({
      name: col,
      id: col.toLowerCase().replace(/\s+/g, "_"),
    }));

    const coords = CanvasStore.getNewBlockCoords();

    addTableBlock(colsDefinition, coords.top, coords.left);
    onClose();
  };

  const onAddColumn = () => {
    const colName = colsRef.current?.value.trim();
    if (!colName) return;
    if (cols.includes(colName)) return;
    setCols((prev) => [...prev, colName]);
    colsRef.current!.value = "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Table</DialogTitle>
          <DialogDescription>
            Add the columns headers for your table.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row items-center">
          <div className="flex flex-row items-center gap-2 mb-4">
            <Label className="min-w-max">Header Name</Label>
            <Input ref={colsRef} />
            <PlusIcon size={36} onClick={onAddColumn} />
          </div>
        </div>
        <div className="flex flex-row items-center gap-2 mb-4">
          {cols.map((col, index) => (
            <Badge key={index}>{col}</Badge>
          ))}
        </div>
        <DialogFooter>
          <Button
            variant={"outline"}
            onClick={onCreateTable}
            disabled={cols.length === 0}
          >
            Create
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
