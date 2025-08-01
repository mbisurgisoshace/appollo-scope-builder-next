import { useDraggable } from "@dnd-kit/core";

import { Button } from "./ui/button";
import { useCanvasStore } from "../modules/state/CanvasStore";

// import list from "../assets/list.svg";
// import table from "../assets/table.svg";
// import button from "../assets/button.svg";
// import heading from "../assets/heading.svg";
// import container from "../assets/container.svg";
// import paragraph from "../assets/paragraph.svg";

import HierarchyTree from "./HierarchyTree";

export default function LeftSidebar() {
  const tool = useCanvasStore((state) => state.tool);

  //   const renderSidebar = () => {
  //     switch (tool) {
  //       case "ui-builder":
  //         return <UiBuilderSidebar />;
  //       //   case "db-builder":
  //       //     return <DbBuilderSidebar />;
  //       case "scope-builder":
  //         return <ScopeBuilderSidebar />;
  //       default:
  //         return null;
  //     }
  //   };

  return (
    <div
      style={{
        height: "calc(100vh - 46px)",
      }}
      className="w-64 absolute top-[46px] z-50 bg-white border-r-[0.5px] border-r-[#E4E5ED]"
    >
      {/* {renderSidebar()} */}
      <HierarchyTree />
    </div>
  );
}

function SidebarDraggable({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  return (
    <div
      id={id}
      {...listeners}
      {...attributes}
      ref={setNodeRef}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
    >
      {children}
    </div>
  );
}

/**
 * UI Builder Sidebar
 */

// const UI_POPULAR_BLOCKS = [
//   { id: "ui-paragraph", node: <img src={paragraph} alt="Paragraph" /> },
//   { id: "ui-header", node: <img src={heading} alt="Heading" /> },
//   { id: "ui-button", node: <img src={button} alt="Button" /> },
//   { id: "ui-list", node: <img src={list} alt="List" /> },
//   { id: "ui-table", node: <img src={table} alt="Table" /> },
//   { id: "ui-container", node: <img src={container} alt="Container" /> },
// ];

// function UiBuilderSidebar() {
//   return (
//     <>
//       <div className="flex items-center justify-between border-b-[0.5px] border-b-[#E4E5ED] py-4 pl-4 pr-3">
//         <h3 className="text-base text-[#111827] font-bold">Block Library</h3>
//         <Button
//           variant={"link"}
//           size={"sm"}
//           className="text-[10px] text-[#6A35FF]"
//         >
//           + Create Block
//         </Button>
//       </div>
//       <div className="p-4 flex gap-5 flex-col border-b-[0.5px] border-b-[#E4E5ED]">
//         <h3 className="text-xs text-[#111827] font-bold">Popular</h3>
//         <div className="grid grid-cols-3 gap-8">
//           {UI_POPULAR_BLOCKS.map((block) => (
//             <SidebarDraggable id={block.id} key={block.id}>
//               {block.node}
//             </SidebarDraggable>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }

/**
 * DB Builder Sidebar
 */

function DbBuilderSidebar() {
  return (
    <>
      <div className="flex items-center justify-between border-b-[0.5px] border-b-[#E4E5ED] py-4 pl-4 pr-3">
        <h3 className="text-base text-[#111827] font-bold">Db Builder</h3>
        <Button
          variant={"link"}
          size={"sm"}
          className="text-[10px] text-[#6A35FF]"
        >
          + Create Table
        </Button>
      </div>
    </>
  );
}

/**
 * Scope Builder Sidebar
 */

// const SCOPE_POPULAR_BLOCKS = [
//   { id: "scope-text", node: <img src={paragraph} alt="Text" /> },
//   { id: "scope-table", node: <img src={table} alt="Table" /> },
// ];

// function ScopeBuilderSidebar() {
//   return (
//     <>
//       <div className="flex items-center justify-between border-b-[0.5px] border-b-[#E4E5ED] py-4 pl-4 pr-3">
//         <h3 className="text-base text-[#111827] font-bold">Scope Builder</h3>
//         <Button
//           variant={"link"}
//           size={"sm"}
//           className="text-[10px] text-[#6A35FF]"
//         >
//           + Create Scope
//         </Button>
//       </div>
//       <div className="p-4 flex gap-5 flex-col border-b-[0.5px] border-b-[#E4E5ED]">
//         <h3 className="text-xs text-[#111827] font-bold">Popular</h3>
//         <div className="grid grid-cols-3 gap-8">
//           {SCOPE_POPULAR_BLOCKS.map((block) => (
//             <SidebarDraggable id={block.id} key={block.id}>
//               {block.node}
//             </SidebarDraggable>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }
