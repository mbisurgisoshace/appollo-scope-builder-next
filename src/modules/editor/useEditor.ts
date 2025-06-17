"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useQuery } from "convex/react";
import { useMutation, useStorage } from "@liveblocks/react";

import useBlock from "./useBlock";
import { LiveList } from "@liveblocks/client";
import { api } from "../../../convex/_generated/api";
import { Arrow, CanvasBlock, ColDefinition } from "@/types";
import CanvasStore, { useCanvasStore } from "../state/CanvasStore";

export default function useEditor() {
  const tags = useQuery(api.tags.get);

  const { createBlock, createGridBLock, createImageBlock, createTableBlock } =
    useBlock();
  const items = useStorage((root) => root.items);
  const scale = useCanvasStore((state) => state.scale);

  const [active, setActive] = useState<any>(null);
  const [arrows, setArrows] = useState<any[]>([]);
  const [isGridOpen, setIsGridOpen] = useState(false);
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [isUploadImageOpen, setIsUploadImageOpen] = useState(false);

  const handleDragEnd = (event: any) => {
    setActive(null);

    const { id } = event.active;
    const { x, y } = event.delta;
    const screen = CanvasStore.screen;
    const { clientX, clientY } = event.activatorEvent;
    //const overId = event.over?.id;
    // const toolItems = items.get(tool) || [];
    // const item = toolItems.find((item) => item.id === id);
    const top = clientY + y + screen.y;
    const left = clientX + x + screen.x;

    const item = items?.find((item) => item.id === id);

    CanvasStore.setNewBlockCoords(top, left);

    if (id === "ui-grid") {
      setIsGridOpen(true);
      return;
    }

    if (id === "ui-table") {
      setIsTableOpen(true);
      return;
    }

    if (id === "ui-image") {
      setIsUploadImageOpen(true);
      return;
    }

    if (id.includes("ui")) {
      const newItem = createBlock(id);
      newItem.top = top;
      newItem.left = left;
      addBlock(newItem);
    }

    if (!item) {
      return;
    }

    translateBlock(item.id, x / scale.x, y / scale.y);
  };

  const addBlock = useMutation(({ storage }, block: CanvasBlock) => {
    const items = storage.get("items") as LiveList<CanvasBlock>;
    items.push(block);
  }, []);

  const addImageBlock = useMutation(
    ({ storage }, storageId: string, top: number, left: number) => {
      const imageBlock = createImageBlock(storageId);
      imageBlock.top = top;
      imageBlock.left = left;
      const items = storage.get("items") as LiveList<CanvasBlock>;
      items.push(imageBlock);
      CanvasStore.setNewBlockCoords(0, 0);
    },
    []
  );

  const addGridBlock = useMutation(
    ({ storage }, rows: number, cols: number, top: number, left: number) => {
      const gridBlock = createGridBLock(rows, cols);
      gridBlock.top = top;
      gridBlock.left = left;
      const items = storage.get("items") as LiveList<CanvasBlock>;
      items.push(gridBlock);
      CanvasStore.setNewBlockCoords(0, 0);
    },
    []
  );

  const addTableBlock = useMutation(
    (
      { storage },
      colDefinitions: ColDefinition[],
      top: number,
      left: number
    ) => {
      const tableBlock = createTableBlock(colDefinitions);
      tableBlock.top = top;
      tableBlock.left = left;
      const items = storage.get("items") as LiveList<CanvasBlock>;
      items.push(tableBlock);
      CanvasStore.setNewBlockCoords(0, 0);
    },
    []
  );

  const resizeBlock = useMutation(
    ({ storage }, blockId: string, width: number, height: number) => {
      const items = storage.get("items") as LiveList<CanvasBlock>;
      const block = items.find((item) => item.id === blockId);
      const blockIndex = items.findIndex((item) => item.id === blockId);

      if (block) {
        block.width = width;
        block.height = height;
        items.set(blockIndex, block);
      }
    },
    []
  );

  const translateBlock = useMutation(
    ({ storage }, blockId: string, newX: number, newY: number) => {
      const items = storage.get("items") as LiveList<CanvasBlock>;
      const block = items.find((item) => item.id === blockId);
      const blockIndex = items.findIndex((item) => item.id === blockId);

      if (block) {
        block.left += newX;
        block.top += newY;
        items.set(blockIndex, block);
      }
    },
    []
  );

  const tagBlock = useMutation(({ storage }, blockId: string, tag: string) => {
    const items = storage.get("items") as LiveList<CanvasBlock>;
    const block = items.find((item) => item.id === blockId);
    const blockIndex = items.findIndex((item) => item.id === blockId);

    if (block) {
      block.tags = [...block.tags, tag];
      items.set(blockIndex, block);
    }
  }, []);

  const duplicateBlock = useMutation(({ storage }, blockId: string) => {
    const items = storage.get("items") as LiveList<CanvasBlock>;
    const block = items.find((item) => item.id === blockId);
    if (!block) return;
    const newBlock = {
      ...block,
      id: uuidv4(),
      top: block.top - 30,
      left: block.left - 30,
    };
    items.push(newBlock);
  }, []);

  // const startDrawingArrow = (startBlockId: string) => {
  //   if (!CanvasStore.getStartArrowNode()) {
  //     CanvasStore.setArrowStartNode(startBlockId);
  //   } else if (CanvasStore.getStartArrowNode() !== startBlockId) {
  //     const newArrow = {
  //       id: uuidv4(),
  //       start: CanvasStore.getStartArrowNode(),
  //       end: startBlockId,
  //     };
  //     setArrows((prev) => [...prev, newArrow]);
  //     CanvasStore.setArrowStartNode(null);
  //   }
  // };

  const startDrawingArrow = useMutation(({ storage }, startBlockId: string) => {
    if (!CanvasStore.getStartArrowNode()) {
      CanvasStore.setArrowStartNode(startBlockId);
    } else if (CanvasStore.getStartArrowNode() !== startBlockId) {
      const newArrow = {
        id: uuidv4(),
        start: CanvasStore.getStartArrowNode()!,
        end: startBlockId,
      };
      const arrows = storage.get("arrows") as LiveList<Arrow>;
      arrows.push(newArrow);
      CanvasStore.setArrowStartNode(null);
    }
  }, []);

  return {
    tags,
    items,
    active,
    arrows,
    tagBlock,
    setActive,
    isGridOpen,
    isTableOpen,
    resizeBlock,
    addGridBlock,
    addTableBlock,
    setIsGridOpen,
    handleDragEnd,
    addImageBlock,
    setIsTableOpen,
    duplicateBlock,
    startDrawingArrow,
    isUploadImageOpen,
    setIsUploadImageOpen,
  };
}
