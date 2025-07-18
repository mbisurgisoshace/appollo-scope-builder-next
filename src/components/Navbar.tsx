import { memo } from "react";
import { UserButton } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function Navbar() {
  const params = useParams<{ roomId: string }>();

  const board = useQuery(api.boards.getBoard, {
    id: params.roomId as Id<"boards">,
  });

  console.log("Board:", board);

  return (
    <div className="w-full px-3 h-[46px] bg-white border-b-[0.5px] border-b-[#E4E5ED] absolute flex items-center justify-between z-50">
      <h1 className="text-2xl font-medium text-muted-foreground">
        {board?.name}
      </h1>
      <UserButton />
    </div>
  );
}

export default memo(Navbar);
