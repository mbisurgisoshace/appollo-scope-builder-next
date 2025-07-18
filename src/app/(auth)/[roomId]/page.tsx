import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

import Room from "@/components/Room";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;

  // const board = await fetchQuery(api.boards.getBoard, {
  //   id: roomId as Id<"boards">,
  // });

  return <Room roomId={roomId} />;
}
