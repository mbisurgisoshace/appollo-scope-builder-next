"use client";

import { DraggablePosition } from "@/modules/core/foundation";
import { InterviewBlock } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export interface InterviewProps {
  canvasBlock: InterviewBlock;
}

export default function Interview({ canvasBlock }: InterviewProps) {
  return (
    <DraggablePosition
      id={canvasBlock.id}
      top={canvasBlock.top}
      left={canvasBlock.left}
      canvasBlock={canvasBlock}
      width={canvasBlock.width}
      height={canvasBlock.height}
      //   width={width}
      //   height={height}
    >
      <div className="overflow-hidden relative w-56 border-white border-2 rounded-2xl rounded-bl-none rounded-br-none">
        <div
          style={{
            background:
              "linear-gradient(90deg, #6376F1 0%, rgba(99, 118, 241, 0) 100%)",
            opacity: 0.18,
          }}
          className="absolute w-full h-full top-0 left-0"
        />
        <div className="px-10 py-2 font-semibold text-[#6376F2] text-2xl">
          Interview
        </div>
      </div>
      <div
        className="bg-[#EEF4FB] border-2 border-white rounded-2xl rounded-tr-none p-8 w-full h-full shadow-xl rounded-tl-none"
        style={{
          width: canvasBlock.width,
          height: canvasBlock.height,
        }}
      >
        test
      </div>
    </DraggablePosition>
  );
}
//#EEF4FB
