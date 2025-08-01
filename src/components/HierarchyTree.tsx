import { useState } from "react";
import { Tree, ControlledTreeEnvironment } from "react-complex-tree";

import "react-complex-tree/lib/style-modern.css";
import { useCanvasStore } from "../modules/state/CanvasStore";
import { traverseAllElements } from "../lib/utils";
import useBlock from "../modules/editor/useBlock";
import { useStorage } from "@liveblocks/react";

export default function HierarchyTree() {
  const { findBlock } = useBlock();
  //const tool = useCanvasStore((state) => state.tool);
  //   const items = useCanvasStore((state) => state.items);
  const items = useStorage((root) => root.items);
  const selectElement = useCanvasStore((state) => state.selectElement);

  const [selectedItems, setSelectedItems] = useState([]);
  const [focusedItem, setFocusedItem] = useState<string>();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const onSelectElement = (selectedItems: any) => {
    const block = findBlock(selectedItems[0], items?.map((item) => item) || []);
    if (!block) return;
    selectElement(block);
  };

  const treeElements: Record<string, any> = {};
  const allElements = traverseAllElements(items?.map((item) => item) || []);
  const root = {
    index: "root",
    isFolder: true,
    children: [
      ...(items?.map((item) => item) || []).map((element) => element.id),
    ],
    data: "Root item",
  };

  allElements.forEach((element) => {
    treeElements[element.id] = {
      index: element.id,
      isFolder: true,
      //@ts-ignore
      children: [...(element.children?.map((child) => child.id) || "")],
      data: element,
      label: element.blockType,
    };
  });

  const treeItems = {
    root,
    ...treeElements,
  };

  return (
    <ControlledTreeEnvironment
      items={treeItems}
      viewState={{
        ["tree-1"]: {
          focusedItem,
          expandedItems,
          selectedItems,
        },
      }}
      onSelectItems={onSelectElement}
      onFocusItem={(item) => setFocusedItem(item.index.toString())}
      onExpandItem={(item) =>
        setExpandedItems([...expandedItems, item.index.toString()])
      }
      onCollapseItem={(item) =>
        setExpandedItems(
          expandedItems.filter(
            (expandedItemIndex) => expandedItemIndex !== item.index
          )
        )
      }
      getItemTitle={(item) => item.label}
    >
      <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
    </ControlledTreeEnvironment>
  );
}
