import Grid from "./Grid";
import Image from "./Image";
import Table from "./Table";
import Interview from "./Interview";
import { CanvasBlock } from "@/types";

export interface BlockProps {
  canvasBlock: CanvasBlock;
}

export default function Block({ canvasBlock }: BlockProps) {
  if (canvasBlock.blockType === "grid") {
    return <Grid canvasBlock={canvasBlock} />;
  }

  if (canvasBlock.blockType === "table") {
    return <Table canvasBlock={canvasBlock} />;
  }

  if (canvasBlock.blockType === "image") {
    return <Image canvasBlock={canvasBlock} />;
  }

  if (canvasBlock.blockType === "interview") {
    return <Interview canvasBlock={canvasBlock} />;
  }

  return <div />;
}
