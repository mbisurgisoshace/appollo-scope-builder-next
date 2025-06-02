import { Resizable } from "react-resizable";
import { useDraggable } from "@dnd-kit/core";
import { type PropsWithChildren } from "react";
import { restrictToParentElement } from "@dnd-kit/modifiers";

import { inBounds } from "./math-utils";

import Tags from "@/components/Tags";
import { CanvasBlock } from "@/types";
import useEditor from "../editor/useEditor";
import TagSelector from "@/components/TagSelector";
import CanvasStore, { useCanvasStore } from "../state/CanvasStore";

export interface CanvasPosition extends React.HTMLProps<HTMLDivElement> {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
  canvasBlock: CanvasBlock;
}

export const DraggablePosition = ({
  id,
  top,
  left,
  width,
  height,
  children,
  canvasBlock,
  ...props
}: PropsWithChildren<CanvasPosition>) => {
  const scale = useCanvasStore((state) => state.scale);
  const selectElement = useCanvasStore((state) => state.selectElement);
  const selectedElement = useCanvasStore((state) => state.selectedElement);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const screen = CanvasStore.screen;

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
        // ref={setNodeRef}
        // {...listeners}
        // {...attributes}
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
          zIndex: selectedElement && selectedElement.id === id ? 100 : 0,
        }}
        // onPointerDown={(e) => {
        //   //selectElement(canvasBlock);
        //   console.log("e", e);
        //   if (listeners && listeners.onPointerDown) {
        //     listeners.onPointerDown(e);
        //     e.preventDefault();
        //     e.stopPropagation();
        //   }
        // }}
        onClick={() => {
          selectElement(canvasBlock);
        }}
        onDoubleClick={props.onDoubleClick}
      >
        <Tags tags={canvasBlock.tags} />
        {children}
        <TagSelector blockId={canvasBlock.id} blockTags={canvasBlock.tags} />
        {selectedElement && selectedElement.id === id && (
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
              //border: "25px solid #6A35FF",
            }}
            className="border-[5px] border-gray-100 cursor-grab"
            onPointerDown={(e) => {
              //selectElement(canvasBlock);
              console.log("e", e);

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
  } else return null;
};

export const DraggableResizablePosition = ({
  id,
  top,
  left,
  width,
  height,
  children,
  canvasBlock,
  ...props
}: PropsWithChildren<CanvasPosition>) => {
  const { resizeBlock } = useEditor();
  const scale = useCanvasStore((state) => state.scale);
  const selectElement = useCanvasStore((state) => state.selectElement);
  const selectedElement = useCanvasStore((state) => state.selectedElement);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const screen = CanvasStore.screen;

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
          <div
            style={{ zIndex: 100 }}
            className="w-4 h-4 border-[2px] border-[#6A35FF] absolute right-[-7px] bottom-[-7px] cursor-grab"
          />
        }
      >
        <div
          // ref={setNodeRef}
          // {...listeners}
          // {...attributes}
          id={id}
          className="absolute inline-block draggable"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            top: `${top - screen.y}px`,
            left: `${left - screen.x}px`,
            transform: transform
              ? `translate3d(${transform.x / scale.x}px, ${
                  transform.y / scale.y
                }px, 0)`
              : undefined,
            zIndex: selectedElement && selectedElement.id === id ? 100 : 0,
          }}
          // onPointerDown={(e) => {
          //   //selectElement(canvasBlock);
          //   console.log("e", e);
          //   if (listeners && listeners.onPointerDown) {
          //     listeners.onPointerDown(e);
          //     e.preventDefault();
          //     e.stopPropagation();
          //   }
          // }}
          onClick={() => {
            selectElement(canvasBlock);
          }}
          onDoubleClick={props.onDoubleClick}
        >
          <Tags tags={canvasBlock.tags} />
          {children}
          <TagSelector blockId={canvasBlock.id} blockTags={canvasBlock.tags} />
          {selectedElement && selectedElement.id === id && (
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
                //border: "25px solid #6A35FF",
              }}
              className="border-[5px] border-gray-100 cursor-grab"
              onPointerDown={(e) => {
                //selectElement(canvasBlock);
                console.log("e", e);

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
      </Resizable>
    );
  } else return null;
};

export const DraggableBlock = ({
  id,
  top,
  left,
  width,
  height,
  children,
}: PropsWithChildren<CanvasPosition>) => {
  const scale = useCanvasStore((state) => state.scale);
  //const selectElement = useCanvasStore((state) => state.selectElement);
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
        //...style,
        zIndex: 100,
        top: `${top}px`,
        left: `${left}px`,
        transform: transform
          ? `translate3d(${transform.x / scale.x}px, ${
              transform.y / scale.y
            }px, 0)`
          : undefined,
      }}
      onPointerDown={(e) => {
        //selectElement(canvasBlock);

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
