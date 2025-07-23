import { memo, useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CircleCheckIcon } from "lucide-react";

export function Navbar() {
  const params = useParams<{ roomId: string }>();
  const updateBoard = useMutation(api.boards.updateBoard);

  const board = useQuery(api.boards.getById, {
    id: params.roomId as Id<"boards">,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(board?.name || "");

  useEffect(() => {
    setName(board?.name || "");
  }, [board]);

  const onUpdateBoardName = async () => {
    if (!board) return;
    await updateBoard({ id: board._id, name });
    setIsEditing(false);
  };

  return (
    <div className="w-full px-3 h-[46px] bg-white border-b-[0.5px] border-b-[#E4E5ED] absolute flex items-center justify-between z-50">
      {!isEditing && (
        <h1
          className="text-2xl font-medium text-muted-foreground"
          onDoubleClick={() => setIsEditing(true)}
        >
          {board?.name}
        </h1>
      )}
      {isEditing && (
        <div className="flex items-center gap-2">
          <Input
            className="w-3xs"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button size={"icon"} variant={"ghost"} onClick={onUpdateBoardName}>
            <CircleCheckIcon />
          </Button>
        </div>
      )}
      <UserButton />
    </div>
  );
}

export default memo(Navbar);
