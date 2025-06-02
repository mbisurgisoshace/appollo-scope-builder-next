// "use client";

// import { ReactNode } from "react";
// import { ClerkProvider, useAuth } from "@clerk/nextjs";
// import { ConvexProviderWithClerk } from "convex/react-clerk";
// import { AuthLoading, Authenticated, ConvexReactClient } from "convex/react";

// const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// export function ConvexClientProvider({ children }: { children: ReactNode }) {
//   //   return <ConvexProvider client={convex}>{children}</ConvexProvider>;
//   return (
//     <ClerkProvider>
//       <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
//         <Authenticated>{children}</Authenticated>
//         <AuthLoading>
//           <div>Loading...</div>
//         </AuthLoading>
//       </ConvexProviderWithClerk>
//     </ClerkProvider>
//   );
// }
"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
