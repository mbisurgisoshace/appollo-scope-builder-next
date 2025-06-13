"use client";

import {
  RoomProvider,
  LiveblocksProvider,
  ClientSideSuspense,
} from "@liveblocks/react";
import { LiveList } from "@liveblocks/client";

import { Editor } from "@/modules/editor";

interface RoomProps {
  roomId: string;
}

export default function Room({ roomId }: RoomProps) {
  return (
    <LiveblocksProvider authEndpoint={"/api/liveblocks-auth"}>
      <RoomProvider
        id={roomId}
        initialStorage={{
          items: new LiveList([]),
          arrows: new LiveList([]),
        }}
      >
        <ClientSideSuspense
          fallback={
            <div className="w-full h-screen flex items-center justify-center">
              Loading...
            </div>
          }
        >
          {() => <Editor />}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
