import { HistoryEditor } from "slate-history";
import { ReactEditor, RenderElementProps } from "slate-react";
import { Descendant, BaseEditor, BaseRange, Range, Element } from "slate";

export type MentionElement = {
  type: "mention";
  character: string;
  children: CustomText[];
};

export type ParagraphElement = {
  type: "paragraph";
  align?: string;
  children: Descendant[];
};

export type BlockQuoteElement = {
  type: "block-quote";
  align?: string;
  children: Descendant[];
};

export type EditableVoidElement = {
  type: "editable-void";
  children: EmptyText[];
};

export type TitleElement = { type: "title"; children: Descendant[] };

export type CustomElementWithAlign = ParagraphElement | BlockQuoteElement;

type CustomElement =
  | TitleElement
  | MentionElement
  | ParagraphElement
  | BlockQuoteElement
  | EditableVoidElement;

export type CustomElementType = CustomElement["type"];

export type CustomText = {
  text: string;
  hr?: boolean;
  bold?: boolean;
  code?: boolean;
  list?: boolean;
  title?: boolean;
  italic?: boolean;
  underline?: boolean;
  underlined?: boolean;
  blockquote?: boolean;
  strikethrough?: boolean;
};

export type CustomTextKey = keyof Omit<CustomText, "text">;

export type EmptyText = {
  text: string;
};

export type RenderElementPropsFor<T> = RenderElementProps & {
  element: T;
};

export type CustomEditor = BaseEditor &
  ReactEditor &
  HistoryEditor & {
    nodeToDecorations?: Map<Element, Range[]>;
  };

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
    Range: BaseRange & {
      [key: string]: unknown;
    };
  }
}
