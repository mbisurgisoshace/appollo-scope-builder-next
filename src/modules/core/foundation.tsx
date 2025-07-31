import { Resizable } from "react-resizable";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { useMemo, type PropsWithChildren } from "react";
import { restrictToParentElement } from "@dnd-kit/modifiers";

import { inBounds } from "./math-utils";

import Tags from "@/components/Tags";
import { CanvasBlock, Group } from "@/types";
import useEditor from "../editor/useEditor";
import TagSelector from "@/components/TagSelector";
import CanvasStore, { useCanvasStore } from "../state/CanvasStore";
import {
  CircleChevronDownIcon,
  CircleChevronLeftIcon,
  CircleChevronRightIcon,
  CircleChevronUpIcon,
} from "lucide-react";

export interface CanvasPosition extends React.HTMLProps<HTMLDivElement> {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
  canvasBlock: CanvasBlock;
  otherTools?: React.ReactNode;
  selectedBoxSizeAdjustment?: { width: number; height: number };
}

const arrowsDirections = [
  "arrow-up",
  "arrow-down",
  "arrow-left",
  "arrow-right",
];

export const DraggablePosition = ({
  id,
  top,
  left,
  width,
  height,
  children,
  otherTools,
  canvasBlock,
  ...props
}: PropsWithChildren<CanvasPosition>) => {
  const { startDrawingArrow } = useEditor();
  const scale = useCanvasStore((state) => state.scale);
  const selectedIds = useCanvasStore((state) => state.selectedIds);
  const selectElement = useCanvasStore((state) => state.selectElement);
  const selectedElement = useCanvasStore((state) => state.selectedElement);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const screen = CanvasStore.screen;

  const isSelected =
    (selectedElement && selectedElement.id === id) || selectedIds.includes(id);

  if (
    inBounds(
      { left, top, height, width },
      {
        left: screen.x,
        top: screen.y,
        width: screen.width,
        height: screen.height,
      }
    )
  ) {
    return (
      <div
        id={id}
        className="absolute inline-block draggable"
        style={{
          top: `${top - screen.y}px`,
          left: `${left - screen.x}px`,
          transform: transform
            ? `translate3d(${transform.x / scale.x}px, ${
                transform.y / scale.y
              }px, 0)`
            : undefined,
          zIndex: isSelected ? 100 : 0,
        }}
        onClick={() => {
          selectElement(canvasBlock);
        }}
        onDoubleClick={props.onDoubleClick}
      >
        <Tags tags={canvasBlock.tags} />
        {children}
        {isSelected && (
          <TagSelector blockId={canvasBlock.id} blockTags={canvasBlock.tags} />
        )}
        {isSelected && otherTools}
        {isSelected && (
          <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={{
              top: -8,
              left: -8,
              width: width + 16,
              height: height + 16,
              position: "absolute",
            }}
            onDoubleClick={(e) => startDrawingArrow(id)}
            className="border-[5px] border-gray-100 cursor-grab"
            onPointerDown={(e) => {
              if (
                listeners &&
                listeners.onPointerDown &&
                !canvasBlock.groupId
              ) {
                listeners.onPointerDown(e);
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          >
            <div className="w-full h-full border-[1.5px] border-[#6A35FF]" />
          </div>
        )}
      </div>
    );
  } else return null;
};

export const DraggableResizablePosition = ({
  id,
  top,
  left,
  width,
  height,
  children,
  otherTools,
  canvasBlock,
  selectedBoxSizeAdjustment,
  ...props
}: PropsWithChildren<CanvasPosition>) => {
  const scale = useCanvasStore((state) => state.scale);
  const { resizeBlock, startDrawingArrow } = useEditor();
  const selectedIds = useCanvasStore((state) => state.selectedIds);
  const selectElement = useCanvasStore((state) => state.selectElement);
  const selectedElement = useCanvasStore((state) => state.selectedElement);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const screen = CanvasStore.screen;

  const selectedBoxAdjustedWidth = selectedBoxSizeAdjustment?.width || 0;
  const selectedBoxAdjustedHeight = selectedBoxSizeAdjustment?.height || 0;

  const isSelected =
    (selectedElement && selectedElement.id === id) || selectedIds.includes(id);

  if (canvasBlock.groupId) {
    return (
      <Resizable
        width={width}
        height={height}
        onResize={(_, data) => {
          resizeBlock(canvasBlock.id, data.size.width, data.size.height);
        }}
        handle={
          isSelected && (
            <div
              id="resize-handle"
              style={{ zIndex: 100, right: -7 - selectedBoxAdjustedWidth / 2 }}
              className="w-4 h-4 border-[2px] bg-white border-[#6A35FF] absolute bottom-[-7px] cursor-grab"
            />
          )
        }
      >
        <div
          id={id}
          className="absolute inline-block draggable"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            top: `${top - (canvasBlock.groupId ? 0 : screen.y)}px`,
            left: `${left - (canvasBlock.groupId ? 0 : screen.x)}px`,
            transform: transform
              ? `translate3d(${transform.x / scale.x}px, ${
                  transform.y / scale.y
                }px, 0)`
              : undefined,
            zIndex: isSelected ? 100 : undefined,
          }}
          onClick={() => {
            selectElement(canvasBlock);
          }}
          onDoubleClick={props.onDoubleClick}
        >
          <Tags tags={canvasBlock.tags} />
          {children}
          {isSelected && (
            <TagSelector
              blockId={canvasBlock.id}
              blockTags={canvasBlock.tags}
            />
          )}
          {isSelected && otherTools}
          {isSelected && (
            <div
              ref={setNodeRef}
              {...listeners}
              {...attributes}
              style={{
                top: -8,
                left: -8 - selectedBoxAdjustedWidth / 2,
                position: "absolute",
                width: width + 16 + selectedBoxAdjustedWidth,
                height: height + 16 + selectedBoxAdjustedHeight,
                //border: "25px solid #6A35FF",
              }}
              onDoubleClick={(e) => startDrawingArrow(id)}
              className="border-[5px] border-gray-100 cursor-grab"
              onPointerDown={(e) => {
                if (
                  listeners &&
                  listeners.onPointerDown &&
                  !canvasBlock.groupId
                ) {
                  listeners.onPointerDown(e);
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              <div className="w-full h-full border-[1.5px] border-[#6A35FF]" />
              <CircleChevronUpIcon
                id="arrow-up"
                className="absolute left-1/2 -top-8  -translate-x-1/2"
              />
              <CircleChevronLeftIcon
                id="arrow-left"
                className="absolute top-1/2 -left-7 -translate-y-1/2"
              />
              <CircleChevronDownIcon
                id="arrow-down"
                className="absolute left-1/2 -bottom-8  -translate-x-1/2"
              />
              <CircleChevronRightIcon
                id="arrow-right"
                className="absolute top-1/2 -right-7 -translate-y-1/2"
              />
            </div>
          )}
        </div>
      </Resizable>
    );
  }

  if (
    inBounds(
      { left, top, height, width },
      {
        left: screen.x,
        top: screen.y,
        width: screen.width,
        height: screen.height,
      }
    )
  ) {
    return (
      <Resizable
        width={width}
        height={height}
        onResize={(_, data) => {
          resizeBlock(canvasBlock.id, data.size.width, data.size.height);
        }}
        handle={
          isSelected && (
            <div
              id="resize-handle"
              style={{ zIndex: 100, right: -7 - selectedBoxAdjustedWidth / 2 }}
              className="w-4 h-4 border-[2px] bg-white border-[#6A35FF] absolute bottom-[-7px] cursor-grab"
            />
          )
        }
      >
        <div
          id={id}
          className="absolute inline-block draggable"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            top: `${top - (canvasBlock.groupId ? 0 : screen.y)}px`,
            left: `${left - (canvasBlock.groupId ? 0 : screen.x)}px`,
            transform: transform
              ? `translate3d(${transform.x / scale.x}px, ${
                  transform.y / scale.y
                }px, 0)`
              : undefined,
            zIndex: isSelected ? 100 : undefined,
          }}
          onClick={() => {
            selectElement(canvasBlock);
          }}
          onDoubleClick={props.onDoubleClick}
        >
          <Tags tags={canvasBlock.tags} />
          {children}
          {isSelected && (
            <TagSelector
              blockId={canvasBlock.id}
              blockTags={canvasBlock.tags}
            />
          )}
          {isSelected && otherTools}
          {isSelected && (
            <div
              ref={setNodeRef}
              {...listeners}
              {...attributes}
              style={{
                top: -8,
                left: -8 - selectedBoxAdjustedWidth / 2,
                position: "absolute",
                width: width + 16 + selectedBoxAdjustedWidth,
                height: height + 16 + selectedBoxAdjustedHeight,
                //border: "25px solid #6A35FF",
              }}
              onDoubleClick={(e) => startDrawingArrow(id)}
              className="border-[5px] border-gray-100 cursor-grab"
              onPointerDown={(e) => {
                if (listeners && listeners.onPointerDown) {
                  listeners.onPointerDown(e);
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              <div className="w-full h-full border-[1.5px] border-[#6A35FF]" />
              <CircleChevronUpIcon
                id="arrow-up"
                className="absolute left-1/2 -top-8  -translate-x-1/2"
              />
              <CircleChevronLeftIcon
                id="arrow-left"
                className="absolute top-1/2 -left-7 -translate-y-1/2"
              />
              <CircleChevronDownIcon
                id="arrow-down"
                className="absolute left-1/2 -bottom-8  -translate-x-1/2"
              />
              <CircleChevronRightIcon
                id="arrow-right"
                className="absolute top-1/2 -right-7 -translate-y-1/2"
              />
            </div>
          )}
        </div>
      </Resizable>
    );
  } else return null;
};

type DraggableGroupProps = Omit<Group, "blockIds">;

export const DraggableGroup = ({
  id,
  top,
  left,
  width,
  height,
  children,
}: PropsWithChildren<{
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
}>) => {
  const scale = useCanvasStore((state) => state.scale);
  const selectGroup = useCanvasStore((state) => state.selectGroup);
  const selectedGroup = useCanvasStore((state) => state.selectedGroupId);

  const screen = CanvasStore.screen;

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: {
      modifiers: [restrictToParentElement],
    },
  });

  const selectedBoxAdjustedWidth = 0;
  const selectedBoxAdjustedHeight = 0;

  const isSelected = selectedGroup && selectedGroup === id;

  if (
    inBounds(
      { left, top, height: 0, width: 0 },
      {
        left: CanvasStore.screen.x,
        top: CanvasStore.screen.y,
        width: CanvasStore.screen.width,
        height: CanvasStore.screen.height,
      }
    )
  )
    return (
      <div
        id={id}
        {...listeners}
        {...attributes}
        ref={setNodeRef}
        className="absolute"
        style={{
          zIndex: 100,
          width: `${width}px`,
          height: `${height}px`,
          top: `${top - screen.y}px`,
          left: `${left - screen.x}px`,
          transform: transform
            ? `translate3d(${transform.x / scale.x}px, ${
                transform.y / scale.y
              }px, 0)`
            : undefined,
        }}
        onClick={() => {
          selectGroup(id);
        }}
      >
        {children}
        {isSelected && (
          <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={{
              top: -8,
              left: -8,
              width: width + 16,
              height: height + 16,
              position: "absolute",
            }}
            className="border-[5px] border-gray-100 cursor-grab"
            onPointerDown={(e) => {
              if (listeners && listeners.onPointerDown) {
                listeners.onPointerDown(e);
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          >
            <div className="w-full h-full border-[1.5px] border-[#6A35FF]" />
          </div>
        )}
      </div>
    );
  else return null;
};

export const DraggableBlock = ({
  id,
  top,
  left,
  style,
  width,
  height,
  children,
}: PropsWithChildren<CanvasPosition>) => {
  const scale = useCanvasStore((state) => state.scale);
  const selectedElement = useCanvasStore((state) => state.selectedElement);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: {
      modifiers: [restrictToParentElement],
    },
  });

  return (
    <div
      id={id}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="absolute"
      style={{
        zIndex: 100,
        top: `${top}px`,
        left: `${left}px`,
        transform: transform
          ? `translate3d(${transform.x / scale.x}px, ${
              transform.y / scale.y
            }px, 0)`
          : undefined,
        ...style,
      }}
      onPointerDown={(e) => {
        if (listeners && listeners.onPointerDown) {
          listeners.onPointerDown(e);
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      {children}
      {selectedElement && selectedElement.id === id && (
        <div
          style={{
            top: -8,
            left: -8,
            width: width + 16,
            height: height + 16,
            position: "absolute",
            border: "1.5px solid #6A35FF",
          }}
        />
      )}
    </div>
  );
};

export const GridPlaceholder = ({
  columns,
  screenId,
}: {
  columns: string;
  screenId: string;
}) => {
  const generateGridArray = useMemo(() => {
    return Array(columns.split(" ").length)
      .fill("Placeholder")
      .map((_, index) => `${screenId}$${index + 1}`);
  }, [screenId, columns]);

  return (
    <div
      className="absolute grid gap-1 w-full h-full bg-transparent z-50"
      style={{
        gridTemplateRows: "auto",
        gridTemplateColumns: columns,
      }}
    >
      {generateGridArray.map((id) => (
        <GridPlaceholderItem id={id} key={id} />
      ))}
    </div>
  );
};

export const GridPlaceholderItem = ({ id }: { id: string }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      id={id}
      ref={setNodeRef}
      data-column-id={id}
      className={`${isOver ? "bg-red-200" : ""}`}
    />
  );
};
