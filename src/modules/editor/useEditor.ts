"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useQuery } from "convex/react";
import { useMutation, useStorage } from "@liveblocks/react";

import useBlock from "./useBlock";
import { LiveList } from "@liveblocks/client";
import { api } from "../../../convex/_generated/api";
import {
  Arrow,
  BlockType,
  CanvasBlock,
  ChildBlock,
  ColDefinition,
  ContainerBlock,
} from "@/types";
import CanvasStore, { useCanvasStore } from "../state/CanvasStore";
import { useGroupManager } from "../core/useGroupManager";

export default function useEditor() {
  const tags = useQuery(api.tags.get);

  const { moveGroup } = useGroupManager();
  const {
    findBlock,
    createBlock,
    createScreen,
    createGridBLock,
    createImageBlock,
    createTableBlock,
    findTopLevelBlock,
  } = useBlock();
  const items = useStorage((root) => root.items);
  const scale = useCanvasStore((state) => state.scale);
  const setNewContainerSetup = useCanvasStore(
    (state) => state.setNewContainerSetup
  );
  const newContainerSetup = useCanvasStore((state) => state.newContainerSetup);

  const [active, setActive] = useState<any>(null);
  const [arrows, setArrows] = useState<any[]>([]);
  const [isGridOpen, setIsGridOpen] = useState(false);
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [isUploadImageOpen, setIsUploadImageOpen] = useState(false);

  const handleDragEnd = (event: any) => {
    setActive(null);

    const { id } = event.active;
    const { x, y } = event.delta;
    const overId = event.over?.id;
    const screen = CanvasStore.screen;
    const { clientX, clientY } = event.activatorEvent;

    console.log("id:", id);
    console.log("overId:", overId);

    //const overId = event.over?.id;
    // const toolItems = items.get(tool) || [];
    // const item = toolItems.find((item) => item.id === id);
    const top = clientY + y + screen.y;
    const left = clientX + x + screen.x;

    const item = items?.find((item) => item.id === id);

    CanvasStore.setNewBlockCoords(top, left);

    if (id === "ui-screen") {
      const newScreen = createBlock(id);
      newScreen.top = top;
      newScreen.left = left;
      newScreen.stackOrder = getNextStackOrder();
      addBlock(newScreen);
      return;
    }

    if (
      id.includes("ui-container") &&
      (overId?.includes("screen") || overId?.includes("container"))
    ) {
      onBlockContainerDropped(overId);
      return;
    }

    if (
      !id.includes("block") &&
      !id.includes("screen") &&
      //!id.includes("ui") &&
      overId?.includes("container")
    ) {
      addBlockToContainer(overId, id);
      return;
    }

    if (id.includes("block") && overId.includes("container")) {
      moveBlock(id, overId);
      return;
    }

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
      newItem.stackOrder = getNextStackOrder();
      addBlock(newItem);
    }

    if (id.includes("group")) {
      moveGroup(id, x / scale.x, y / scale.y);
      return;
    }

    if (!item) {
      return;
    }

    translateBlock(item.id, x / scale.x, y / scale.y);
  };

  const onBlockContainerDropped = (overId: string) => {
    setNewContainerSetup({
      overId,
      gridColumnLayout: "",
    });
  };

  const addBlock = useMutation(({ storage }, block: CanvasBlock) => {
    const items = storage.get("items") as LiveList<CanvasBlock>;
    items.push(block);
  }, []);

  const addBlockToContainer = useMutation(
    ({ storage }, id: string, blockType: BlockType) => {
      const [containerId, columnNumber] = id.split("$");
      const items = storage.get("items") as LiveList<CanvasBlock>;

      const container = findBlock<ContainerBlock>(containerId, items.toArray());

      if (!container) return;

      const newBlock = createBlock(
        blockType,
        containerId,
        setBlockPosition(columnNumber)
      );

      container.children.push(newBlock);

      const topLevelBlock = findTopLevelBlock(container.id, items.toArray());
      console.log("topLevelBlock", topLevelBlock);
      if (!topLevelBlock) return;

      const topLevelBlockIndex = items.findIndex(
        (item) => item.id === topLevelBlock.id
      );
      items.set(topLevelBlockIndex, topLevelBlock);
    },
    []
  );

  const addImageBlock = useMutation(
    ({ storage }, storageId: string, top: number, left: number) => {
      const imageBlock = createImageBlock(storageId);
      imageBlock.top = top;
      imageBlock.left = left;
      imageBlock.stackOrder = getNextStackOrder();
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
      gridBlock.stackOrder = getNextStackOrder();
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
      tableBlock.stackOrder = getNextStackOrder();
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

  const sendToBack = useMutation(({ storage }, blockId: string) => {
    const items = storage.get("items") as LiveList<CanvasBlock>;
    const minOrder = Math.min(...items.map((e) => e.stackOrder)) || 0;
    const block = items.find((item) => item.id === blockId);
    const blockIndex = items.findIndex((item) => item.id === blockId);
    if (block) {
      block.stackOrder = minOrder - 1;
      items.set(blockIndex, block);
    }
  }, []);

  const bringToFront = useMutation(({ storage }, blockId: string) => {
    const items = storage.get("items") as LiveList<CanvasBlock>;
    const maxOrder = Math.max(...items.map((e) => e.stackOrder)) || 0;
    const block = items.find((item) => item.id === blockId);
    const blockIndex = items.findIndex((item) => item.id === blockId);
    if (block) {
      block.stackOrder = maxOrder + 1;
      items.set(blockIndex, block);
    }
  }, []);

  const editBlockStyle = useMutation(
    ({ storage }, blockId: string, styleProp: string, styleValue: string) => {
      const items = storage.get("items") as LiveList<CanvasBlock>;
      const block = items.find((item) => item.id === blockId);
      const blockIndex = items.findIndex((item) => item.id === blockId);
      if (block) {
        block.style = {
          ...block.style,
          [styleProp as string]: styleValue,
        };
        items.set(blockIndex, block);
      }
    },
    []
  );

  const editStyle = useMutation(
    ({ storage }, blockId: string, styleProp: string, styleValue: string) => {
      const items = storage.get("items") as LiveList<CanvasBlock>;

      const block = findBlock(blockId, items.toArray());

      if (block) {
        if (styleProp === "width" || styleProp === "height") {
          const value = parseInt(styleValue, 10);
          block[styleProp as "width" | "height"] = isNaN(value) ? 0 : value;
        } else if (["fontSize", "weight"].includes(styleProp)) {
          const value = parseInt(styleValue, 10);
          block.style = {
            ...block.style,
            [styleProp as string]: isNaN(value) ? 14 : value,
          };
        } else {
          block.style = {
            ...block.style,
            [styleProp as string]: styleValue,
          };
        }

        const topLevelBlock = findTopLevelBlock(block.id, items.toArray());

        if (!topLevelBlock) return;

        const topLevelBlockIndex = items.findIndex(
          (item) => item.id === topLevelBlock.id
        );

        items.set(topLevelBlockIndex, topLevelBlock);
      }
    },
    []
  );

  const addContainerBlock = useMutation(
    ({ storage }, blockId: string) => {
      if (!newContainerSetup) return;
      const items = storage.get("items") as LiveList<CanvasBlock>;
      const { overId, gridColumnLayout } = newContainerSetup;
      const [containerId, columnNumber] = overId.split("$");

      let newContainerBlock: ContainerBlock;
      const overBlockId = overId.includes("screen") ? overId : containerId;

      if (overId.includes("screen")) {
        newContainerBlock = {
          top: 0,
          left: 0,
          width: 0,
          tags: [],
          style: {},
          height: 250,
          children: [],
          blockType: "container",
          layout: gridColumnLayout,
          id: `container-${uuidv4()}`,
          stackOrder: getNextStackOrder(),
        };
      } else {
        newContainerBlock = {
          top: 0,
          left: 0,
          tags: [],
          width: 0,
          height: 250,
          children: [],
          blockType: "container",
          layout: gridColumnLayout,
          id: `container-${uuidv4()}`,
          stackOrder: getNextStackOrder(),
          style: setBlockPosition(columnNumber),
        };
      }

      const overBlock = findBlock<ContainerBlock>(overBlockId, items.toArray());
      if (!overBlock) return;
      overBlock.children.push(newContainerBlock);
      const topLevelBlock = findTopLevelBlock(overBlockId, items.toArray());

      if (!topLevelBlock) return;
      const topLevelBlockIndex = items.findIndex(
        (item) => item.id === topLevelBlock.id
      );
      items.set(topLevelBlockIndex, topLevelBlock);
      setNewContainerSetup();
    },
    [newContainerSetup]
  );

  const moveBlock = useMutation(
    ({ storage }, blockId: string, overId: string) => {
      const items = storage.get("items") as LiveList<CanvasBlock>;
      const [containerId, columnNumber] = overId.split("$");

      //@ts-ignore
      const block = findBlock<ChildBlock>(blockId, items.toArray());
      const newContainer = findBlock<ContainerBlock>(
        containerId,
        items.toArray()
      );

      if (!block || !newContainer) return;

      const currentContainer = findBlock<ContainerBlock>(
        block.containerId,
        items.toArray()
      );

      if (!currentContainer) return;

      if (currentContainer.id !== newContainer.id) {
        currentContainer.children = currentContainer.children.filter(
          (child) => child.id !== block.id
        );
        //@ts-ignore
        newContainer.children.push(block);
        block.containerId = newContainer.id;
      }

      block.style = {
        ...block.style,
        ...setBlockPosition(columnNumber),
      };

      const topLevelBlock = findTopLevelBlock(blockId, items.toArray());

      if (!topLevelBlock) return;
      const topLevelBlockIndex = items.findIndex(
        (item) => item.id === topLevelBlock.id
      );

      items.set(topLevelBlockIndex, topLevelBlock);
    },
    []
  );

  const setBlockPosition = (columns?: string): Record<string, any> => {
    if (!columns) return {};
    const columnNumber = parseInt(columns, 10);

    return {
      gridColumn: `${columnNumber} / span 1`,
    };
  };

  const deleteBlock = useMutation(({ storage }, blockId: string) => {
    const items = storage.get("items") as LiveList<CanvasBlock>;
    const block = items.find((item) => item.id === blockId);
    if (!block) return;
    const blockIndex = items.findIndex((item) => item.id === blockId);
    items.delete(blockIndex);
  }, []);

  const getNextStackOrder = (): number => {
    if (items && items.length === 0) return 0;
    return Math.max(...items!.map((el) => el.stackOrder)) + 1;
  };

  return {
    tags,
    items,
    active,
    arrows,
    tagBlock,
    editStyle,
    setActive,
    isGridOpen,
    sendToBack,
    filterTags,
    isTableOpen,
    resizeBlock,
    deleteBlock,
    bringToFront,
    addGridBlock,
    setFilterTags,
    addTableBlock,
    setIsGridOpen,
    handleDragEnd,
    addImageBlock,
    setIsTableOpen,
    duplicateBlock,
    editBlockStyle,
    addContainerBlock,
    startDrawingArrow,
    isUploadImageOpen,
    setIsUploadImageOpen,
  };
}
