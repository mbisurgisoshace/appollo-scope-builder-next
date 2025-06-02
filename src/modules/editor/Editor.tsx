import { DndContext } from "@dnd-kit/core";

import useEditor from "./useEditor";
import CanvasRoot from "./CanvasRoot";
import CanvasStore from "../state/CanvasStore";

import Navbar from "@/components/Navbar";
import Toolbar from "@/components/Toolbar";
import CreateGrid from "@/components/CreateGrid";
import CreateTable from "@/components/CreateTable";
import UploadImage from "@/components/UploadImage";

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

  return (
    <div className="w-full h-full relative">
      <DndContext
        id="editor"
        onDragMove={() => {
          // updateXarrow();
          CanvasStore.shouldRender = true;
        }}
        onDragEnd={handleDragEnd}
        onDragStart={(data) => {
          const { active } = data;
          setActive(active);
        }}
        // modifiers={
        //   active && active.data.current ? active.data.current.modifiers : []
        // }
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
