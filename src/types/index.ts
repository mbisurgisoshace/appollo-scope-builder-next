import type { JsonObject } from "@liveblocks/client";

export type BlockType =
  | "ui-grid"
  | "ui-text"
  | "ui-group"
  | "ui-image"
  | "ui-table"
  | "ui-circle"
  | "ui-square"
  | "ui-interview"
  | "ui-parallelogram";

export type ColDefinition = { id: string; name: string };

export type Arrow = {
  id: string;
  end: string;
  start: string;
};

export interface Group extends JsonObject {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
  blockIds: string[];
}

export interface Block extends JsonObject {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
  tags: string[];
  groupId?: string;
  stackOrder: number;
  style?: Record<string, any>;
}

export interface TextBlock extends Block {
  blockType: "text";
  parsedContent?: string;
}

export interface CircleBlock extends Block {
  blockType: "circle";
  text: string;
}

export interface SquareBlock extends Block {
  blockType: "square";
  text: string;
}
export interface ImageBlock extends Block {
  blockType: "image";
  storageId: string;
}
export interface InterviewBlock extends Block {
  blockType: "interview";
  parsedContent?: string;
}

export interface GridBlock extends Block {
  blockType: "grid";
  rows: number;
  cols: number;
  data: string[][];
}

export interface TableBlock extends Block {
  blockType: "table";
  data: any[];
  colsDefinition: ColDefinition[];
}

export interface ParallelogramBlock extends Block {
  blockType: "parallelogram";
  text: string;
}

export interface GroupBlock extends Block {
  blockType: "group";
  blockIds: string[];
}

export type CanvasBlock =
  | GridBlock
  | TextBlock
  | ImageBlock
  | TableBlock
  | GroupBlock
  | CircleBlock
  | SquareBlock
  | InterviewBlock
  | ParallelogramBlock;
