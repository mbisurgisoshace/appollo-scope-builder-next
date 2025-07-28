import { useRef, useState } from "react";
import useMeasure from "react-use-measure";
import { LiveList } from "@liveblocks/client";
import { useMutation } from "@liveblocks/react";

import ColorPicker from "../ColorPicker";
import { Textarea } from "../ui/textarea";
import useEditor from "@/modules/editor/useEditor";
import { CanvasBlock, TextBlock as TextBlockType } from "@/types";
import { DraggableResizablePosition } from "../../modules/core/foundation";

export interface TextProps {
  canvasBlock: TextBlockType;
}

const USERS = ["Alejandro", "Bruno", "Camila", "Delfina", "Ezequiel"];

export default function TextBlock({ canvasBlock }: TextProps) {
  const [ref, bounds] = useMeasure();
  const { editBlockStyle } = useEditor();
  const { id, text, style } = canvasBlock;
  const editorRef = useRef<HTMLDivElement>(null);
  const [mentionQuery, setMentionQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const onTextChange = useMutation(({ storage }, value: string) => {
    const items = storage.get("items") as LiveList<CanvasBlock>;
    const block = items.find(
      (item) => item.id === canvasBlock.id
    ) as TextBlockType;
    const blockIndex = items.findIndex((item) => item.id === canvasBlock.id);

    if (block) {
      block.text = value;
      items.set(blockIndex, block);
    }
  }, []);

  const getCaretContext = () => {
    const sel = window.getSelection();
    if (!sel || !sel.anchorNode || !sel.isCollapsed) return null;
    const node = sel.anchorNode;
    const offset = sel.anchorOffset;
    return { node, offset };
  };

  const findLastAtMatch = (text: string, caretPos: number) => {
    const sub = text.slice(0, caretPos);
    const match = sub.match(/@([a-zA-Z0-9_]*)$/);
    if (match) {
      return {
        text: match[1],
        start: sub.lastIndexOf("@"),
        end: caretPos,
      };
    }
    return null;
  };

  const handleInput = () => {
    const sel = window.getSelection();
    if (!sel || !sel.anchorNode || !editorRef.current?.contains(sel.anchorNode))
      return;

    const context = getCaretContext();
    if (!context || context.node.nodeType !== Node.TEXT_NODE) {
      setShowSuggestions(false);
      return;
    }

    const text = context.node.textContent || "";
    const caret = context.offset;
    const match = findLastAtMatch(text, caret);

    if (match) {
      const filtered = USERS.filter((u) =>
        u.toLowerCase().startsWith(match.text.toLowerCase())
      );
      setSuggestions(filtered);
      setMentionQuery(match.text);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const insertMention = (name: string) => {
    const sel = window.getSelection();
    if (!sel || !sel.anchorNode || !editorRef.current?.contains(sel.anchorNode))
      return;

    const context = getCaretContext();
    if (!context || context.node.nodeType !== Node.TEXT_NODE) return;

    const { node, offset } = context;
    const text = node.textContent || "";
    const match = findLastAtMatch(text, offset);
    if (!match) return;

    // Split the text before/after the mention trigger
    const before = text.slice(0, match.start);
    const after = text.slice(match.end);

    const parent = node.parentNode!;
    const mentionNode = document.createElement("span");
    mentionNode.className = "mention";
    mentionNode.textContent = `@${name}`;
    mentionNode.contentEditable = "false";

    const space = document.createTextNode(" ");
    const afterNode = document.createTextNode(after);

    // Replace the original text node
    parent.removeChild(node);
    if (before) parent.appendChild(document.createTextNode(before));
    parent.appendChild(mentionNode);
    parent.appendChild(space);
    parent.appendChild(afterNode);

    // Place caret after inserted mention
    const range = document.createRange();
    range.setStartAfter(space);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);

    // Reset state
    setSuggestions([]);
    setMentionQuery("");
    setShowSuggestions(false);
  };

  const { width, height } = bounds;

  return (
    <DraggableResizablePosition
      id={canvasBlock.id}
      top={canvasBlock.top}
      left={canvasBlock.left}
      canvasBlock={canvasBlock}
      width={canvasBlock.width}
      height={canvasBlock.height}
      //   width={width}
      //   height={height}
      otherTools={
        <ColorPicker
          backgroundColor={style?.backgroundColor}
          onChangeColor={(value) =>
            editBlockStyle(id, "backgroundColor", value)
          }
        />
      }
    >
      <div style={{ position: "relative", width: canvasBlock.width }}>
        <div
          ref={editorRef}
          contentEditable
          className="editor"
          onInput={handleInput}
          //placeholder="Type something and use @ to mention someone"
          suppressContentEditableWarning
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestion-list">
            {suggestions.map((user) => (
              <li key={user} onClick={() => insertMention(user)}>
                @{user}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* <div
        style={{
          width: `${canvasBlock.width}px`,
          height: `${canvasBlock.height}px`,
          ...style,
        }}
        className="flex items-center justify-center"
      > */}
      {/* <div
        ref={ref}
        style={{ width: canvasBlock.width, height: canvasBlock.height }}
        className="box-content"
      >
        <Textarea
          value={text || ""}
          //style={{ padding: `${calculatedPadding}px` }}
          onChange={(e) => onTextChange(e.target.value)}
          className="w-full h-full border-transparent ring-0 visited:ring-transparent shadow-none focus:ring-transparent focus:outline-none outline-none focus:ring-0 focus:border-transparent"
        />
      </div> */}
      {/* </div> */}
    </DraggableResizablePosition>
  );
}
