import Text from "./Text";
import Grid from "./Grid";
import Image from "./Image";
import Group from "./Group";
import Table from "./Table";
import Screen from "./Screen";
import Square from "./Square";
import Circle from "./Circle";
import Header from "./Header";
import Interview from "./Interview";
import Parallelogram from "./Parallelogram";

import { CanvasBlock } from "@/types";
import Container from "./Container";

export interface BlockProps {
  canvasBlock: CanvasBlock;
}

export default function Block({ canvasBlock }: BlockProps) {
  if (canvasBlock.blockType === "grid") {
    return <Grid canvasBlock={canvasBlock} />;
  }

  if (canvasBlock.blockType === "text") {
    return <Text canvasBlock={canvasBlock} />;
  }

  if (canvasBlock.blockType === "header") {
    return <Header canvasBlock={canvasBlock} />;
  }

  if (canvasBlock.blockType === "screen") {
    return <Screen canvasBlock={canvasBlock} />;
  }

  if (canvasBlock.blockType === "group") {
    return <Group canvasBlock={canvasBlock} />;
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

  if (canvasBlock.blockType === "container") {
    return <Container canvasBlock={canvasBlock} />;
  }

  if (canvasBlock.blockType === "parallelogram") {
    return <Parallelogram canvasBlock={canvasBlock} />;
  }

  return <div />;
}
