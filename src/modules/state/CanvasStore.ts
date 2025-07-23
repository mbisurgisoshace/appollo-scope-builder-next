"use client";
import { create } from "zustand";

import {
  scaleWithAnchorPoint,
  cameraToScreenCoordinates,
} from "../core/camera-utils";

import { CanvasBlock } from "@/types";
import { CAMERA_ANGLE, RECT_H, RECT_W } from "../core/constants";

export interface CanvasState {
  shouldRender: boolean;
  newBlockTop: number;
  newBlockLeft: number;
  arrowStartNode: string | null;
  pixelRatio: number; // our resolution for dip calculations
  container: {
    //holds information related to our screen container
    width: number;
    height: number;
  };
  pointer: {
    x: number;
    y: number;
  };
  camera: {
    //holds camera state
    x: number;
    y: number;
    z: number;
  };
  elements: CanvasBlock[];
}
const getInitialCanvasState = (): CanvasState => {
  return {
    shouldRender: true,
    newBlockTop: 0,
    newBlockLeft: 0,
    arrowStartNode: null,
    pixelRatio: window.devicePixelRatio || 1,
    container: {
      width: 0,
      height: 0,
    },
    pointer: {
      x: 0,
      y: 0,
    },
    camera: {
      x: 0,
      y: 0,
      z: 0,
    },
    elements: [],
  };
};

let canvasData = getInitialCanvasState();

export default class CanvasStore {
  private static get data() {
    if (!canvasData)
      canvasData = {
        shouldRender: true,
        newBlockTop: 0,
        newBlockLeft: 0,
        arrowStartNode: null,
        pixelRatio: window.devicePixelRatio || 1,
        container: {
          width: 0,
          height: 0,
        },
        pointer: {
          x: 0,
          y: 0,
        },
        camera: {
          x: 0,
          y: 0,
          z: 0,
        },
        elements: [],
      };
    return canvasData;
  }

  static initialize(width: number, height: number, elements: CanvasBlock[]) {
    const containerWidth = width;
    const containerHeight = height;
    canvasData = getInitialCanvasState();
    canvasData.pixelRatio = window.devicePixelRatio || 1;
    canvasData.container.width = containerWidth;
    canvasData.container.height = containerHeight;
    canvasData.camera.x = 1.5 * RECT_W;
    canvasData.camera.y = 1.5 * RECT_H;
    canvasData.camera.z = containerWidth / (2 * Math.tan(CAMERA_ANGLE));
    canvasData.elements = elements;
  }
  public static get screen() {
    const { x, y, z } = this.camera;
    const aspect = this.aspect;
    const angle = CAMERA_ANGLE;
    return cameraToScreenCoordinates(x, y, z, angle, aspect);
  }
  public static get camera() {
    return this.data.camera;
  }
  public static get elements() {
    return this.data.elements;
  }
  public static get scale() {
    const { width: w, height: h } = CanvasStore.screen;
    const { width: cw, height: ch } = CanvasStore.container;
    return { x: cw / w, y: ch / h };
  }
  public static get shouldRender() {
    return canvasData.shouldRender;
  }
  public static set shouldRender(value: boolean) {
    canvasData.shouldRender = value;
  }

  private static get container() {
    return canvasData.container;
  }

  public static get pointer() {
    return canvasData.pointer;
  }

  private static get aspect() {
    return canvasData.container.width / canvasData.container.height;
  }

  private static isCameraInBounds(
    cameraX: number,
    cameraY: number,
    cameraZ: number
  ) {
    return true;
    console.log("Checking camera bounds", cameraX, cameraY, cameraZ);
    // const angle = radians(30);
    // const { x, y, width, height } = cameraToScreenCoordinates(
    //   cameraX,
    //   cameraY,
    //   cameraZ,
    //   angle,
    //   this.aspect
    // );
    // const isXInBounds = x >= 0 && x <= this.data.canvas.width;
    // const isYInBounds = y >= 0 && y <= this.data.canvas.height;
    // return isXInBounds && isYInBounds;
  }

  public static dragElement(id: any, deltaX: number, deltaY: number) {
    const elements = this.data.elements;
    const element = elements.find((item) => item.id === id);
    if (!element) return;
    element.left += deltaX / this.scale.x;
    element.top += deltaY / this.scale.y;
    this.shouldRender = true;
  }

  public static moveCamera(mx: number, my: number) {
    const scrollFactor = 1.5;
    const deltaX = mx * scrollFactor,
      deltaY = my * scrollFactor;
    const { x, y, z } = this.camera;
    if (this.isCameraInBounds(x + deltaX, y + deltaY, z)) {
      this.data.camera.x += deltaX;
      this.data.camera.y += deltaY;
      // move pointer by the same amount
      this.shouldRender = true;
      this.movePointer(deltaY, deltaY);
    }
  }

  public static getNewBlockCoords() {
    return { top: this.data.newBlockTop, left: this.data.newBlockLeft };
  }

  public static setNewBlockCoords(top: number, left: number) {
    this.data.newBlockTop = top;
    this.data.newBlockLeft = left;
    this.shouldRender = true;
  }

  public static getStartArrowNode() {
    return this.data.arrowStartNode;
  }

  public static setArrowStartNode(nodeId: string | null) {
    this.data.arrowStartNode = nodeId;
    this.shouldRender = true;
  }

  //@ts-ignore
  public static zoomCamera(deltaX: number, deltaY: number) {
    // Normal zoom is quite slow, we want to scale the amount quite a bit
    const zoomScaleFactor = 10;
    const deltaAmount = zoomScaleFactor * Math.max(deltaY);
    const { x: oldX, y: oldY, z: oldZ } = this.camera;
    const oldScale = { ...this.scale };

    const { width: containerWidth, height: containerHeight } = this.container;
    const { width, height } = cameraToScreenCoordinates(
      oldX,
      oldY,
      oldZ + deltaAmount,
      CAMERA_ANGLE,
      this.aspect
    );
    const newScaleX = containerWidth / width;
    const newScaleY = containerHeight / height;
    const { x: newX, y: newY } = scaleWithAnchorPoint(
      this.pointer.x,
      this.pointer.y,
      oldX,
      oldY,
      oldScale.x,
      oldScale.y,
      newScaleX,
      newScaleY
    );
    const newZ = oldZ + deltaAmount;
    this.shouldRender = true;
    if (this.isCameraInBounds(oldX, oldY, newZ)) {
      this.data.camera = {
        x: newX,
        y: newY,
        z: newZ,
      };
    }
  }

  // pointer position from top left of the screen
  public static movePointer(deltaX: number, deltaY: number) {
    const scale = this.scale;
    const { x: left, y: top } = this.screen;

    this.data.pointer.x = left + deltaX / scale.x;
    this.data.pointer.y = top + deltaY / scale.y;

    this.shouldRender = true;
  }
}

interface CanvasContextType {
  filterTags: string[];
  selectedIds: string[];
  unselectElement: () => void;
  selectedGroupId: string | null;
  scale: { x: number; y: number };
  selectedElement: CanvasBlock | null;
  selectGroup: (groupId: string) => void;
  setFilterTags: (tags: string[]) => void;
  setSelectedIds: (ids: string[]) => void;
  selectElement: (element: CanvasBlock) => void;
  setScale: (scale: { x: number; y: number }) => void;
}

export const useCanvasStore = create<CanvasContextType>((set) => ({
  filterTags: [],
  selectedIds: [],
  scale: { x: 1, y: 1 },
  selectedElement: null,
  selectedGroupId: null,
  setScale: (scale) => set({ scale }),
  setFilterTags: (tags) => set({ filterTags: tags }),
  setSelectedIds: (ids) => set({ selectedIds: ids }),
  unselectElement: () => set({ selectedElement: null }),
  selectGroup: (groupId) => set({ selectedGroupId: groupId }),
  selectElement: (element) => set({ selectedElement: element }),
}));
