"use client";

import { useRef } from "react";
import { useMutation } from "convex/react";
import { ImageUpIcon } from "lucide-react";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { api } from "../../convex/_generated/api";
import useEditor from "../modules/editor/useEditor";
import CanvasStore from "@/modules/state/CanvasStore";

interface UploadImageProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadImage({ isOpen, onClose }: UploadImageProps) {
  const { addImageBlock } = useEditor();
  const inputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.upload.generateUploadUrl);

  const onHandleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files![0];

    if (!file) return;

    const postUrl = await generateUploadUrl();

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file!.type },
      body: file,
    });

    const { storageId } = await result.json();

    const coords = CanvasStore.getNewBlockCoords();

    addImageBlock(storageId, coords.top, coords.left);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
          <DialogDescription>
            Upload the image that you want to add to the canvas.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center">
          <Button
            asChild
            variant="outline"
            className="w-[100px] h-[100px]"
            onClick={() => inputRef.current?.click()}
          >
            <ImageUpIcon />
          </Button>
          <input
            hidden
            type="file"
            ref={inputRef}
            accept="image/*"
            onChange={onHandleFileChange}
          />
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
