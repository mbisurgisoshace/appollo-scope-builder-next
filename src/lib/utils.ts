import { CanvasBlock } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const traverseAllElements = (elements: CanvasBlock[]) => {
  const allElements: CanvasBlock[] = [];

  elements.forEach((element) => {
    allElements.push(element);

    //@ts-ignore
    if (element.children && element.children.length > 0) {
      //@ts-ignore
      allElements.push(...traverseAllElements(element.children));
    }
  });

  return allElements;
};
