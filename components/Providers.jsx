"use client";

import { SessionProvider } from "next-auth/react";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { CommentsProvider } from "@/context/CommentsContext";
import { TweetsProvider } from "@/context/TweetsContext";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <TweetsProvider>
        <FavoritesProvider>
          <CommentsProvider>{children}</CommentsProvider>
        </FavoritesProvider>
      </TweetsProvider>
    </SessionProvider>
  );
}
