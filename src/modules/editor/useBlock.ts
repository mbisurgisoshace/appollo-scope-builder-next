import { v4 as uuidv4 } from "uuid";

import {
  GridBlock,
  BlockType,
  TableBlock,
  ImageBlock,
  CanvasBlock,
  CircleBlock,
  SquareBlock,
  ColDefinition,
  InterviewBlock,
  ParallelogramBlock,
} from "@/types";

export default function useBlock() {
  const createBlock = (blockType: BlockType): CanvasBlock => {
    if (blockType === "ui-circle") return createCircleBlock();
    if (blockType === "ui-square") return createSquareBlock();
    if (blockType === "ui-interview") return createInterviewBlock();
    if (blockType === "ui-parallelogram") return createParallelogramBlock();

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

      if (foundElement) {
        return foundElement;
      }
    }
  };

  function createTableBlock(colsDefinition: ColDefinition[]): TableBlock {
    return {
      id: `table-${uuidv4()}`,
      top: 0,
      left: 0,
      tags: [],
      width: 500,
      height: 500,
      blockType: "table",
      colsDefinition,
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
      blockType: "square",
    };
  }

  function createInterviewBlock(): InterviewBlock {
    return {
      id: `interview-${uuidv4()}`,
      top: 500,
      tags: [],
      left: 500,
      width: 750,
      height: 250,
      blockType: "interview",
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
    createGridBLock,
    createTableBlock,
    createImageBlock,
  };
}
