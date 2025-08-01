import { DndContext } from "@dnd-kit/core";

import useEditor from "./useEditor";
import CanvasRoot from "./CanvasRoot";
import CanvasStore from "../state/CanvasStore";

import Navbar from "@/components/Navbar";
import Toolbar from "@/components/Toolbar";
import CreateGrid from "@/components/CreateGrid";
import CreateTable from "@/components/CreateTable";
import UploadImage from "@/components/UploadImage";
import { useEffect } from "react";

const Editor = () => {
  const {
    setActive,
    isGridOpen,
    isTableOpen,
    handleDragEnd,
    setIsGridOpen,
    setIsTableOpen,
    isUploadImageOpen,
    setIsUploadImageOpen,
  } = useEditor();

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        CanvasStore.setArrowStartNode(null);
      }
    });
  }, []);

  return (
    <div className="w-full h-full relative bg-[#E1E9F2]">
      <DndContext
        id="editor"
        onDragMove={(e) => {
          // updateXarrow();
          CanvasStore.shouldRender = true;
        }}
        onDragEnd={handleDragEnd}
        onDragStart={(e) => {
          const { active } = e;
          setActive(active);
        }}
      >
        <Navbar />
        <Toolbar />
        <CanvasRoot />
        {/* <LeftSidebar /> */}
        {isGridOpen && (
          <CreateGrid
            isOpen={isGridOpen}
            onClose={() => setIsGridOpen(false)}
          />
        )}
        {isTableOpen && (
          <CreateTable
            isOpen={isTableOpen}
            onClose={() => setIsTableOpen(false)}
          />
        )}
        {isUploadImageOpen && (
          <UploadImage
            isOpen={isUploadImageOpen}
            onClose={() => setIsUploadImageOpen(false)}
          />
        )}
      </DndContext>
    </div>
  );
};

export default Editor;
