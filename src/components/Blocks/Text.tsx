import {
  Fragment,
  KeyboardEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useMeasure from "react-use-measure";
import { LiveList } from "@liveblocks/client";
import { useMutation } from "@liveblocks/react";
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  RenderLeafProps,
  useSelected,
  useFocused,
  ReactEditor,
} from "slate-react";
import {
  Range,
  createEditor,
  Descendant,
  Editor,
  Element as SlateElement,
  Transforms,
} from "slate";

import ColorPicker from "../ColorPicker";
import { Textarea } from "../ui/textarea";
import useEditor from "@/modules/editor/useEditor";
import { CanvasBlock, TextBlock as TextBlockType } from "@/types";
import {
  DraggablePosition,
  DraggableResizablePosition,
} from "../../modules/core/foundation";

import { CustomEditor, MentionElement, RenderElementPropsFor } from "./text.d";
import ReactDOM from "react-dom";

export interface TextProps {
  canvasBlock: TextBlockType;
}

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph." }],
  },
];

export default function TextBlock({ canvasBlock }: TextProps) {
  const [ref, bounds] = useMeasure();
  const { id, text, style } = canvasBlock;
  const { editBlockStyle, tags } = useEditor();
  const refEditor = useRef<HTMLDivElement | null>(null);

  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [target, setTarget] = useState<Range | null>(null);
  const [initialValue, setInitialValue] = useState<Descendant[]>([]);
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );

  const editor = useMemo(
    () => withMentions(withReact(createEditor())) as CustomEditor,
    []
  );

  const chars = tags!
    .map((tag) => tag.name)
    .filter((c) => c.toLowerCase().startsWith(search.toLowerCase()))
    .slice(0, 10);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (target && chars.length > 0) {
        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            const prevIndex = index >= chars.length - 1 ? 0 : index + 1;
            setIndex(prevIndex);
            break;
          case "ArrowUp":
            event.preventDefault();
            const nextIndex = index <= 0 ? chars.length - 1 : index - 1;
            setIndex(nextIndex);
            break;
          case "Tab":
          case "Enter":
            event.preventDefault();
            Transforms.select(editor, target);
            insertMention(editor, chars[index]);
            setTarget(null);
            break;
          case "Escape":
            event.preventDefault();
            setTarget(null);
            break;
        }
      }
    },
    [chars, editor, index, target]
  );

  useEffect(() => {
    if (canvasBlock.parsedContent) {
      setInitialValue(JSON.parse(canvasBlock.parsedContent));
    } else {
      setInitialValue([
        {
          type: "paragraph",
          children: [{ text: "Add text here." }],
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (target && chars.length > 0 && refEditor.current) {
      const el = refEditor.current;
      const domRange = ReactEditor.toDOMRange(editor, target);
      const rect = domRange.getBoundingClientRect();
      el.style.top = `${rect.top + window.pageYOffset + 24}px`;
      el.style.left = `${rect.left + window.pageXOffset}px`;
    }
  }, [chars.length, editor, index, search, target]);

  const onEditorStateChange = useMutation(({ storage }, value: string) => {
    const items = storage.get("items") as LiveList<CanvasBlock>;
    const block = items.find((item) => item.id === canvasBlock.id);
    const blockIndex = items.findIndex((item) => item.id === canvasBlock.id);

    if (block) {
      block.parsedContent = value;
      items.set(blockIndex, block);
    }
  }, []);

  const { width, height } = bounds;

  return (
    <DraggablePosition
      id={canvasBlock.id}
      top={canvasBlock.top}
      left={canvasBlock.left}
      canvasBlock={canvasBlock}
      width={width}
      height={height}
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
      <div ref={ref}>
        {initialValue.length > 0 && (
          <Slate
            editor={editor}
            initialValue={initialValue}
            onChange={(value) => {
              const { selection } = editor;

              if (selection && Range.isCollapsed(selection)) {
                const [start] = Range.edges(selection);
                const wordBefore = Editor.before(editor, start, {
                  unit: "word",
                });
                const before = wordBefore && Editor.before(editor, wordBefore);
                const beforeRange =
                  before && Editor.range(editor, before, start);
                const beforeText =
                  beforeRange && Editor.string(editor, beforeRange);
                const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/);
                const after = Editor.after(editor, start);
                const afterRange = Editor.range(editor, start, after);
                const afterText = Editor.string(editor, afterRange);
                const afterMatch = afterText.match(/^(\s|$)/);

                if (beforeMatch && afterMatch) {
                  setTarget(beforeRange);
                  setSearch(beforeMatch[1]);
                  setIndex(0);
                  return;
                }
              }

              setTarget(null);
              const content = JSON.stringify(value);
              onEditorStateChange(content);
            }}
          >
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              onKeyDown={onKeyDown}
              //placeholder="Enter some text..."
            />
            {target && chars.length > 0 && (
              <Portal>
                <div
                  ref={refEditor}
                  style={{
                    top: "-9999px",
                    left: "-9999px",
                    position: "absolute",
                    zIndex: 1,
                    padding: "3px",
                    background: "white",
                    borderRadius: "4px",
                    boxShadow: "0 1px 5px rgba(0,0,0,.2)",
                  }}
                  data-cy="mentions-portal"
                >
                  {chars.map((char, i) => (
                    <div
                      key={char}
                      onClick={() => {
                        Transforms.select(editor, target);
                        insertMention(editor, char);
                        setTarget(null);
                      }}
                      style={{
                        padding: "1px 3px",
                        borderRadius: "3px",
                        cursor: "pointer",
                        background: i === index ? "#B4D5FF" : "transparent",
                      }}
                    >
                      {char}
                    </div>
                  ))}
                </div>
              </Portal>
            )}
          </Slate>
        )}
      </div>
    </DraggablePosition>
  );
}

const withMentions = (editor: CustomEditor) => {
  const { isInline, isVoid, markableVoid } = editor;

  editor.isInline = (element: SlateElement) => {
    return element.type === "mention" ? true : isInline(element);
  };

  editor.isVoid = (element: SlateElement) => {
    return element.type === "mention" ? true : isVoid(element);
  };

  editor.markableVoid = (element: SlateElement) => {
    return element.type === "mention" || markableVoid(element);
  };

  return editor;
};

const insertMention = (editor: CustomEditor, character: string) => {
  const mention: MentionElement = {
    type: "mention",
    character,
    children: [{ text: "" }],
  };
  Transforms.insertNodes(editor, mention);
  Transforms.move(editor);
};

// Borrow Leaf renderer from the Rich Text example.
// In a real project you would get this via `withRichText(editor)` or similar.
const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const Element = (props: RenderElementProps) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case "mention":
      return (
        <Mention
          attributes={attributes}
          children={children}
          element={element}
        />
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Mention = ({
  attributes,
  children,
  element,
}: RenderElementPropsFor<MentionElement>) => {
  const selected = useSelected();
  const focused = useFocused();
  const style: React.CSSProperties = {
    padding: "3px 3px 2px",
    margin: "0 1px",
    verticalAlign: "baseline",
    display: "inline-block",
    borderRadius: "4px",
    backgroundColor: "#eee",
    fontSize: "0.9em",
    boxShadow: selected && focused ? "0 0 0 2px #B4D5FF" : "none",
  };
  // See if our empty text child has any styling marks applied and apply those
  if (element.children[0].bold) {
    style.fontWeight = "bold";
  }
  if (element.children[0].italic) {
    style.fontStyle = "italic";
  }
  return (
    <span
      {...attributes}
      contentEditable={false}
      data-cy={`mention-${element.character.replace(" ", "-")}`}
      style={style}
    >
      <div contentEditable={false}>
        <Fragment>
          {children}@{element.character}
        </Fragment>
      </div>
    </span>
  );
};

export const Portal = ({ children }: { children?: ReactNode }) => {
  return typeof document === "object"
    ? ReactDOM.createPortal(children, document.body)
    : null;
};
