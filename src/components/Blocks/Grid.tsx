import {
  ArrowUpFromLineIcon,
  ArrowLeftFromLineIcon,
  ArrowDownFromLineIcon,
  ArrowRightFromLineIcon,
} from "lucide-react";
import { useRef } from "react";
import { LiveList } from "@liveblocks/client";
import { useMutation } from "@liveblocks/react";

import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuContent,
  ContextMenuTrigger,
} from "../ui/context-menu";

import { CanvasBlock, GridBlock } from "@/types";
import { DraggablePosition } from "../../modules/core/foundation";

export interface GridProps {
  canvasBlock: GridBlock;
}

export default function Grid({ canvasBlock }: GridProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  const onCellValueChange = useMutation(
    ({ storage }, rowIndex: number, colIndex: number, value: string) => {
      const items = storage.get("items") as LiveList<CanvasBlock>;
      const block = items.find(
        (item) => item.id === canvasBlock.id
      ) as GridBlock;
      const blockIndex = items.findIndex((item) => item.id === canvasBlock.id);

      if (block) {
        block.data[rowIndex][colIndex] = value;
        items.set(blockIndex, block);
      }
    },
    []
  );

  const onInsertRow = useMutation(
    ({ storage }, rowIndex: number, position: "above" | "below") => {
      const items = storage.get("items") as LiveList<CanvasBlock>;
      const block = items.find(
        (item) => item.id === canvasBlock.id
      ) as GridBlock;
      const blockIndex = items.findIndex((item) => item.id === canvasBlock.id);

      if (block) {
        const newRow = Array(block.cols).fill("");
        const insertAt = position === "above" ? rowIndex : rowIndex + 1;
        block.data.splice(insertAt, 0, newRow);
        block.rows += 1;
        items.set(blockIndex, block);
      }
    },
    []
  );

  const onInsertCol = useMutation(
    ({ storage }, colIndex: number, position: "left" | "right") => {
      const items = storage.get("items") as LiveList<CanvasBlock>;
      const block = items.find(
        (item) => item.id === canvasBlock.id
      ) as GridBlock;
      const blockIndex = items.findIndex((item) => item.id === canvasBlock.id);

      if (block) {
        const insertAt = position === "left" ? colIndex : colIndex + 1;
        for (let i = 0; i < block.rows; i++) {
          block.data[i].splice(insertAt, 0, "");
        }
        block.cols += 1;
        items.set(blockIndex, block);
      }
    },
    []
  );

  const getDimensions = (): { width: number; height: number } => {
    const { width, height } = canvasBlock;

    if (ref.current) {
      return {
        width: Math.max(ref.current.offsetWidth, width),
        height: Math.max(ref.current.offsetHeight, height),
      };
    }

    return { width, height };
  };

  const { width, height } = getDimensions();

  return (
    <DraggablePosition
      id={canvasBlock.id}
      top={canvasBlock.top}
      left={canvasBlock.left}
      canvasBlock={canvasBlock}
      // width={canvasBlock.width}
      // height={canvasBlock.height}
      width={width}
      height={height}
    >
      <div
        ref={ref}
        style={{
          minWidth: "min-content",
          minHeight: "min-content",
          width,
          height,
          // width: canvasBlock.width,
          // height: canvasBlock.height,
        }}
        onResize={(e) => console.log("e", e)}
        className={`bg-white rounded-xl shadow-2xl relative`}
      >
        {canvasBlock.data.map((row, rowIndex) => {
          return (
            <div
              key={`row-${rowIndex}`}
              className="flex flex-row items-center justify-center"
              style={{ height: `${height / canvasBlock.rows}px` }}
            >
              {row.map((cell, colIndex) => {
                return (
                  <div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className="flex-1 border border-gray-300 p-2 text-center"
                    style={{
                      width: `200px`,
                      height: "100%",
                    }}
                  >
                    <ContextMenu>
                      <ContextMenuTrigger>
                        <textarea
                          value={cell}
                          className="border-none w-full h-full outline-none"
                          onChange={(e) =>
                            onCellValueChange(
                              rowIndex,
                              colIndex,
                              e.target.value
                            )
                          }
                        />
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem
                          onClick={() => onInsertRow(rowIndex, "above")}
                        >
                          <ArrowUpFromLineIcon />
                          Insert Row Above
                        </ContextMenuItem>
                        <ContextMenuItem
                          onClick={() => onInsertRow(rowIndex, "below")}
                        >
                          <ArrowDownFromLineIcon />
                          Insert Row Below
                        </ContextMenuItem>
                        <ContextMenuItem
                          onClick={() => onInsertCol(colIndex, "left")}
                        >
                          <ArrowLeftFromLineIcon />
                          Insert Column Left
                        </ContextMenuItem>
                        <ContextMenuItem
                          onClick={() => onInsertCol(colIndex, "right")}
                        >
                          <ArrowRightFromLineIcon />
                          Insert Column Right
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </DraggablePosition>
  );
}
