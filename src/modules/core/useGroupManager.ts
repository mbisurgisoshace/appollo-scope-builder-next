import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useStorage, useMutation } from "@liveblocks/react";

import { CanvasBlock, Group, GroupBlock } from "@/types";
import { LiveList } from "@liveblocks/client";
import CanvasStore from "../state/CanvasStore";

export function useGroupManager(
  initialGroups: Group[] = [],
  initialBlocks: CanvasBlock[] = []
) {
  const blocks = useStorage((root) => root.items);
  const groups = useStorage((root) => root.groups);
  //   const [_, setGroups] = useState<Group[]>(initialGroups);
  //   const [_, setBlocks] = useState<CanvasBlock[]>(initialBlocks);

  //   const groupBlocks = (selectedIds: string[]) => {
  //     if (selectedIds.length < 2) return;
  //     const selected = blocks?.filter((b) => selectedIds.includes(b.id)) || [];
  //     const minX = Math.min(...selected.map((b) => b.left));
  //     const minY = Math.min(...selected.map((b) => b.top));
  //     const newGroupId = `group-${uuidv4()}`;

  //     const updatedBlocks = blocks?.map((b) =>
  //       selectedIds.includes(b.id)
  //         ? { ...b, groupId: newGroupId, left: b.left - minX, top: b.top - minY }
  //         : b
  //     ) || [];

  //     const newGroup: Group = {
  //       id: newGroupId,
  //       blockIds: selectedIds,
  //       left: minX,
  //       top: minY,
  //     };

  //     setBlocks(updatedBlocks);
  //     setGroups((prev) => [...prev, newGroup]);
  //   };

  const groupBlocks = useMutation(({ storage }, selectedIds: string[]) => {
    if (selectedIds.length < 2) return;
    const screen = CanvasStore.screen;
    const items = storage.get("items") as LiveList<CanvasBlock>;

    const selected = items?.filter((b) => selectedIds.includes(b.id)) || [];

    const minX = Math.min(...selected.map((b) => b.left));
    const minY = Math.min(...selected.map((b) => b.top));
    const maxX = Math.max(...selected.map((b) => b.left + b.width));
    const maxY = Math.max(...selected.map((b) => b.top + b.height));

    const newGroupId = `group-${uuidv4()}`;

    const updatedBlocks =
      items?.map((b) =>
        selectedIds.includes(b.id)
          ? {
              ...b,
              groupId: newGroupId,
              //left: b.left - minX,
              //top: b.top - minY,
            }
          : b
      ) || [];

    const newGroup: GroupBlock = {
      tags: [],
      top: minY,
      left: minX,
      stackOrder: 0,
      id: newGroupId,
      blockType: "group",
      blockIds: selectedIds,
      width: maxX - screen.width,
      height: maxY - screen.height,
    };

    console.log("selected", selected);
    console.log("newGroup", newGroup);
    console.log("Screen", CanvasStore.screen);

    return;

    updatedBlocks.forEach((b) => {
      const blockIndex = items.findIndex((item) => item.id === b.id);
      if (blockIndex !== -1) {
        items.set(blockIndex, b);
      }
    });

    storage.get("groups").push(newGroup);
  }, []);

  const ungroup = (groupId: string) => {
    const group = groups?.find((g) => g.id === groupId);
    if (!group) return;

    const updatedBlocks =
      blocks?.map((b) => {
        if (b.groupId === groupId) {
          return {
            ...b,
            groupId: undefined,
            left: b.left + group.left,
            top: b.top + group.top,
          };
        }
        return b;
      }) || [];

    // setBlocks(updatedBlocks);
    // setGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  const moveGroup = useMutation(
    ({ storage }, groupId: string, deltaX: number, deltaY: number) => {
      // const groups = storage.get("groups") as LiveList<Group>;
      // const group = groups.find((g) => g.id === groupId);
      // if (!group) return;
      // const groupIndex = groups.findIndex((g) => g.id === groupId);
      // group.left += deltaX;
      // group.top += deltaY;
      // console.log("Moving group", groupId, deltaX, deltaY);
      // groups.set(groupIndex, group);
    },
    []
  );

  return {
    groups,
    blocks,
    ungroup,
    //setBlocks,
    //setGroups,
    moveGroup,
    groupBlocks,
  };
}
