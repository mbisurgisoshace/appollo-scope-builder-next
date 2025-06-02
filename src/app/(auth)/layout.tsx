import { LiveblocksProvider } from "@liveblocks/react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
