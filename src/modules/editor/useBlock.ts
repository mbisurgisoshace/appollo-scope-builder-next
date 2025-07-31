import { v4 as uuidv4 } from "uuid";

import {
  GridBlock,
  BlockType,
  TableBlock,
  ImageBlock,
  TextBlock,
  CanvasBlock,
  CircleBlock,
  SquareBlock,
  ScreenBlock,
  ColDefinition,
  InterviewBlock,
  ParallelogramBlock,
  ContainerBlock,
  HeaderBlock,
} from "@/types";

export default function useBlock() {
  const createBlock = (
    blockType: BlockType,
    containerId?: string,
    style?: Record<string, any>
  ): CanvasBlock => {
    if (blockType === "ui-screen") return createScreen();
    if (blockType === "ui-text") return createTextBlock();
    if (blockType === "ui-circle") return createCircleBlock();
    if (blockType === "ui-square") return createSquareBlock();
    if (blockType === "ui-interview") return createInterviewBlock();
    if (blockType === "ui-parallelogram") return createParallelogramBlock();
    if (blockType === "ui-header")
      return createHeaderBlock(containerId!, style);

    throw new Error("Invalid block type");
  };

  const findBlock = <T extends CanvasBlock>(
    elementId: string,
    elements: CanvasBlock[]
  ): T | undefined => {
    let foundElement: T | undefined;

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];

      if (element.id === elementId) {
        return element as T;
      }

      if ((element as ContainerBlock).children) {
        foundElement = findBlock(
          elementId,
          (element as ContainerBlock).children
        );
      } else {
        foundElement = findBlock(elementId, []);
      }

      if (foundElement) {
        return foundElement;
      }
    }
  };

  const findTopLevelBlock = <T extends CanvasBlock>(
    elementId: string,
    elements: CanvasBlock[]
  ): CanvasBlock | null => {
    console.log("elements:", elements);

    function searchTopLevelBlock(
      nodes: CanvasBlock[],
      parent: CanvasBlock | null
    ): CanvasBlock | null {
      for (const node of nodes) {
        if (node.id === elementId) {
          // If parent is null, it's already top-most
          return parent ?? node;
        }

        //@ts-ignore
        if (node.children?.length) {
          //@ts-ignore
          const found = searchTopLevelBlock(node.children, parent ?? node);

          if (found) return found;
        }
      }
      return null;
    }

    return searchTopLevelBlock(elements, null);
  };

  function createScreen(): ScreenBlock {
    return {
      id: `screen-${uuidv4()}`,
      name: "New Screen",
      top: 0,
      left: 0,
      tags: [],
      width: 375,
      height: 812,
      stackOrder: 0,
      blockType: "screen",
      children: [],
    };
  }

  function createHeaderBlock(
    containerId: string,
    style?: Record<string, any>
  ): HeaderBlock {
    return {
      style,
      id: `block-${uuidv4()}`,
      top: 0,
      left: 0,
      width: 0,
      tags: [],
      height: 0,
      containerId,
      stackOrder: 0,
      text: "Header",
      blockType: "header",
    };
  }

  function createTableBlock(colsDefinition: ColDefinition[]): TableBlock {
    return {
      id: `table-${uuidv4()}`,
      top: 0,
      left: 0,
      tags: [],
      width: 500,
      height: 500,
      stackOrder: 0,
      colsDefinition,
      blockType: "table",
      data: createTableData(colsDefinition),
    };
  }

  function createGridBLock(rows: number, cols: number): GridBlock {
    return {
      id: `grid-${uuidv4()}`,
      rows,
      cols,
      top: 0,
      left: 0,
      tags: [],
      width: 500,
      height: 500,
      stackOrder: 0,
      blockType: "grid",
      data: createGridData(rows, cols),
    };
  }

  function createImageBlock(storageId: string): ImageBlock {
    return {
      id: `image-${uuidv4()}`,
      top: 0,
      left: 0,
      tags: [],
      storageId,
      width: 250,
      height: 250,
      stackOrder: 0,
      blockType: "image",
    };
  }

  function createCircleBlock(): CircleBlock {
    return {
      id: `circle-${uuidv4()}`,
      top: 0,
      left: 0,
      tags: [],
      text: "",
      width: 250,
      height: 250,
      stackOrder: 0,
      blockType: "circle",
    };
  }

  function createSquareBlock(): SquareBlock {
    return {
      id: `square-${uuidv4()}`,
      top: 0,
      left: 0,
      tags: [],
      text: "",
      width: 250,
      height: 250,
      stackOrder: 0,
      blockType: "square",
    };
  }

  function createInterviewBlock(): InterviewBlock {
    return {
      id: `interview-${uuidv4()}`,
      top: 500,
      tags: [],
      left: 500,
      width: 980,
      height: 250,
      stackOrder: 0,
      blockType: "interview",
    };
  }

  function createTextBlock(): TextBlock {
    return {
      id: `text-${uuidv4()}`,
      top: 0,
      left: 0,
      tags: [],
      text: "Text",
      width: 250,
      height: 45,
      stackOrder: 0,
      blockType: "text",
    };
  }

  function createParallelogramBlock(): ParallelogramBlock {
    return {
      id: `parallelogram-${uuidv4()}`,
      top: 0,
      left: 0,
      tags: [],
      text: "",
      width: 250,
      height: 250,
      stackOrder: 0,
      blockType: "parallelogram",
    };
  }

  function createTableData(colDefinition: ColDefinition[]) {
    const demoRow1: any = {};
    const demoRow2: any = {};
    colDefinition.forEach((col) => {
      demoRow1[col.id] = "";
      demoRow2[col.id] = "";
    });

    return [demoRow1, demoRow2];
  }

  function createGridData(rows: number, cols: number): string[][] {
    const data: string[][] = [];
    for (let i = 0; i < rows; i++) {
      const row: string[] = [];
      for (let j = 0; j < cols; j++) {
        row.push("");
      }
      data.push(row);
    }
    return data;
  }

  return {
    findBlock,
    createBlock,
    createScreen,
    createGridBLock,
    createTableBlock,
    createImageBlock,
    findTopLevelBlock,
  };
}
