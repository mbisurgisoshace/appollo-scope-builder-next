import type { JsonObject } from "@liveblocks/client";

export type ColDefinition = { id: string; name: string };
export type BlockType = "ui-interview" | "ui-image" | "ui-table" | "ui-grid";

export interface Block extends JsonObject {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
  tags: string[];
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

export type CanvasBlock = InterviewBlock | ImageBlock | GridBlock | TableBlock;
