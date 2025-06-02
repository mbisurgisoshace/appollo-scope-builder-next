import { memo } from "react";
import { UserButton } from "@clerk/nextjs";

export function Navbar() {
  return (
    <div className="w-full px-3 h-[46px] bg-white border-b-[0.5px] border-b-[#E4E5ED] absolute flex items-center justify-between z-50">
      <h1 className="text-2xl font-medium text-muted-foreground">Appollo</h1>
      <UserButton />
    </div>
  );
}

export default memo(Navbar);
