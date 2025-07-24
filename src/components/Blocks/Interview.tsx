"use client";

import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import useMeasure from "react-use-measure";
import { Editor } from "react-draft-wysiwyg";
import { LiveList } from "@liveblocks/client";
import { useMutation } from "@liveblocks/react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon,
  PlusIcon,
  SquarePenIcon,
} from "lucide-react";
import { ContentState, EditorState, convertToRaw } from "draft-js";

import image1 from "../Blocks/Images/image1.png";
import image2 from "../Blocks/Images/image2.png";
import john from "../Blocks/Images/anastasia.png";
import { InterviewBlock, CanvasBlock } from "@/types";
import anastasia from "../Blocks/Images/anastasia.png";
import { DraggablePosition } from "@/modules/core/foundation";

import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import useEditor from "@/modules/editor/useEditor";
import { Button } from "../ui/button";
import { useCanvasStore } from "@/modules/state/CanvasStore";

type Employee = {
  name: string;
  position: string;
  image: StaticImageData;
};
export interface InterviewProps {
  canvasBlock: InterviewBlock;
}

const EMPLOYEES = [
  {
    name: "Anastasia Wellington",
    position: "Project manager",
    image: anastasia,
  },
  {
    name: "John Doe",
    position: "Software Engineer",
    image: john,
  },
];

export default function Interview({ canvasBlock }: InterviewProps) {
  const { tags } = useEditor();
  const [ref, bounds] = useMeasure();
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    if (canvasBlock.parsedContent) {
      const blocksFromHtml = htmlToDraft(canvasBlock.parsedContent);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(
        contentBlocks,
        entityMap
      );
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }
  }, []);

  const onEditorStateChange = useMutation(
    ({ storage }, editorState: EditorState) => {
      setEditorState(editorState);
      const items = storage.get("items") as LiveList<CanvasBlock>;
      const block = items.find((item) => item.id === canvasBlock.id);
      const blockIndex = items.findIndex((item) => item.id === canvasBlock.id);

      if (block) {
        const contentState = editorState.getCurrentContent();
        const rawContentState = convertToRaw(contentState);
        const markup = draftToHtml(rawContentState, {
          separator: "",
          trigger: "#",
        });

        block.parsedContent = markup;
        items.set(blockIndex, block);
      }
    },
    []
  );

  const getSuggestions = () => {
    if (!tags) return [];

    return tags.map((tag) => ({
      text: tag.name.toUpperCase(),
      value: tag.name,
      url: tag.name,
    }));
  };

  const { width, height } = bounds;

  return (
    <DraggablePosition
      width={width}
      height={height}
      id={canvasBlock.id}
      top={canvasBlock.top}
      left={canvasBlock.left}
      canvasBlock={canvasBlock}
    >
      <div ref={ref}>
        <Tab title="Interview" />

        <div
          style={{
            width: canvasBlock.width,
            minHeight: "min-content",
          }}
          className="bg-[#EEF4FB] border-2 box-content border-white rounded-2xl rounded-tr-none p-8 w-full h-full shadow-xl rounded-tl-none"
        >
          <div className="flex flex-row rounded-2xl bg-white rounded-bl-2xl">
            <EmployeeCard employee={EMPLOYEES[0]} />

            <EditorSection
              id={canvasBlock.id}
              isEditMode={isEditMode}
              onToggleMode={() => setIsEditMode(!isEditMode)}
            >
              <Editor
                editorState={editorState}
                toolbarHidden={!isEditMode}
                onEditorStateChange={(editorState) => {
                  if (isEditMode) {
                    onEditorStateChange(editorState);
                  }
                }}
                wrapperStyle={{
                  zIndex: 100,
                  //   minWidth: 400,
                  //   width: inputWidth,
                  //   height: inputHeight,
                  position: "relative",
                  backgroundColor: "white",
                  //   minHeight: "min-content",
                }}
                editorStyle={{
                  overflow: "visible",
                }}
                hashtag={{
                  separator: "",
                  trigger: "#",
                }}
                mention={{
                  separator: " ",
                  trigger: "@",
                  suggestions: getSuggestions(),
                }}
                toolbar={{
                  options: [
                    "inline",
                    "blockType",
                    "fontSize",
                    "fontFamily",
                    "list",
                    "textAlign",
                  ],
                  inline: {
                    options: ["bold", "italic", "underline"],
                  },
                }}
                toolbarStyle={{ zIndex: 100, position: "relative" }}
              />
            </EditorSection>
          </div>

          <Attachements />
        </div>
      </div>
    </DraggablePosition>
  );
}

function Tab({ title }: { title: string }) {
  return (
    <div className="tab-wrapper">
      <div className="tab bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-500 font-semibold px-5 py-2">
        {title}
      </div>
    </div>
  );
}

function EmployeeCard({ employee }: { employee: Employee }) {
  return (
    <div className="px-7 py-5 border-r-[0.5px] border-r-[#E4E5ED] relative rounded-bl-2xl flex flex-col items-center">
      <Image
        width={100}
        height={100}
        objectFit="cover"
        alt={employee.name}
        src={employee.image}
        className="rounded-[6px] mb-2"
      />
      <span className="font-medium text-xs text-[#2B2B2C]">
        {employee.name.split(" ")[0]}
      </span>
      <span className="font-medium text-xs text-[#2B2B2C]">
        {employee.name.split(" ")[1]}
      </span>
      <span className="font-medium text-[10px] mt-1.5 opacity-70 text-[#000000]">
        {employee.position}
      </span>
    </div>
  );
}

function EditorSection({
  id,
  children,
  isEditMode,
  onToggleMode,
}: {
  id: string;
  isEditMode: boolean;
  onToggleMode: () => void;
  children: React.ReactNode;
}) {
  const selectedElement = useCanvasStore((state) => state.selectedElement);

  const isSelected = selectedElement && selectedElement.id === id;

  const showViewModeIcon = isSelected && isEditMode;
  const showEditModeIcon = isSelected && !isEditMode;

  return (
    <div className="p-6 flex-1">
      <div className="flex items-center justify-between  mb-4">
        <h3 className="font-semibold text-lg text-[#2B2B2C]">
          Problem Stories
        </h3>
        {showViewModeIcon && (
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={onToggleMode}
            className="cursor-pointer z-[500]"
          >
            <EyeIcon size={18} />
          </Button>
        )}
        {showEditModeIcon && (
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={onToggleMode}
            className="cursor-pointer z-[500]"
          >
            <SquarePenIcon size={18} />
          </Button>
        )}
        {!showViewModeIcon && !showEditModeIcon && <div className="h-9 w-9" />}
      </div>
      {children}
    </div>
  );
}

function Attachements() {
  const [showAttachments, setShowAttachments] = useState(false);

  return (
    <>
      <AnimatePresence initial={false}>
        {showAttachments ? (
          <motion.div
            className="mt-5"
            key="attachments"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="font-semibold text-[#2B2B2C] text-sm opacity-50">
              Attachements
            </span>

            <div className="mt-4 grid grid-cols-4 gap-8 justify-between">
              <div className="flex rounded-lg flex-col items-center justify-center text-[#4683F5] bg-white w-40 h-40">
                <PlusIcon />
                <span className="text-sm font-medium">Add files</span>
              </div>

              <div className="flex rounded-lg flex-col  bg-white w-40 h-40 p-2.5">
                <Image height={92} width={140} src={image1} alt="Attachment" />
                <span className="text-xs font-medium text-[#2B2B2C] mt-2.5">
                  Image 1.png
                </span>
                <span className="font-medium text-[10px] text-[#2B2B2C]  opacity-70">
                  2,2Mb
                </span>
              </div>

              <div className="flex rounded-lg flex-col  bg-white w-40 h-40 p-2.5">
                <Image height={92} width={140} src={image2} alt="Attachment" />
                <span className="text-xs font-medium text-[#2B2B2C] mt-2.5">
                  Image 1.png
                </span>
                <span className="font-medium text-[10px] text-[#2B2B2C]  opacity-70">
                  2,2Mb
                </span>
              </div>

              <div className="flex rounded-lg flex-col  bg-white w-40 h-40 p-2.5">
                <Image height={92} width={140} src={image1} alt="Attachment" />
                <span className="text-xs font-medium text-[#2B2B2C] mt-2.5">
                  Image 1.png
                </span>
                <span className="font-medium text-[10px] text-[#2B2B2C]  opacity-70">
                  2,2Mb
                </span>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="bg-white rounded-4xl w-8 h-5 flex ml-auto mr-auto items-center justify-center mt-4">
        <Button
          size={"icon"}
          variant={"ghost"}
          className="cursor-pointer z-[500]"
          onClick={() => setShowAttachments(!showAttachments)}
        >
          {showAttachments ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Button>
      </div>
    </>
  );
}
