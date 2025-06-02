import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { Editor } from "react-draft-wysiwyg";
import { LiveList } from "@liveblocks/client";
import { useMutation } from "@liveblocks/react";
import { useEffect, useRef, useState } from "react";
import { ContentState, EditorState, convertToRaw } from "draft-js";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { CanvasBlock, InterviewBlock } from "@/types";
import useEditor from "../../modules/editor/useEditor";
import { DraggablePosition } from "../../modules/core/foundation";

export interface InterviewProps {
  canvasBlock: InterviewBlock;
}

export default function Interview({ canvasBlock }: InterviewProps) {
  const { tags } = useEditor();
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
  }, [canvasBlock.parsedContent]);

  // const { setNodeRef } = useDroppable({
  //   id: canvasBlock.id,
  // });

  const ref = useRef<HTMLHeadingElement>(null);

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

  const getSuggestions = () => {
    if (!tags) return [];

    return tags.map((tag) => ({
      text: tag.name.toUpperCase(),
      value: tag.name,
      url: tag.name,
    }));
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
        <Editor
          editorState={editorState}
          onEditorStateChange={onEditorStateChange}
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
      </div>
    </DraggablePosition>
  );
}
