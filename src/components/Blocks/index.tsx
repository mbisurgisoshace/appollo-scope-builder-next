import Grid from "./Grid";
import Image from "./Image";
import Table from "./Table";
import Square from "./Square";
import Circle from "./Circle";
import Interview from "./Interview";
import { CanvasBlock } from "@/types";
import Parallelogram from "./Parallelogram";

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

  if (canvasBlock.blockType === "circle") {
    return <Circle canvasBlock={canvasBlock} />;
  }

  if (canvasBlock.blockType === "square") {
    return <Square canvasBlock={canvasBlock} />;
  }

  if (canvasBlock.blockType === "interview") {
    return <Interview canvasBlock={canvasBlock} />;
  }

  if (canvasBlock.blockType === "parallelogram") {
    return <Parallelogram canvasBlock={canvasBlock} />;
  }

  return <div />;
}
