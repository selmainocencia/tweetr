import "./globals.css";
import { Suspense } from "react";
import Providers from "@/components/Providers";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";

export const metadata = {
  title: "Tweetr — Your Rights, Your Voice",
  description:
    "Tweet + Rights = Tweetr. The platform for fundamental rights advocacy.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white font-sans min-h-screen">
        <Providers>
          <div className="min-h-screen flex justify-center">
            <div className="flex w-full max-w-7xl">
              <Suspense
                fallback={<div className="w-16 xl:w-72 flex-shrink-0" />}
              >
                <LeftSidebar />
              </Suspense>
              <main className="flex-1 min-w-0 border-x border-zinc-900 min-h-screen max-w-2xl">
                <Suspense fallback={null}>{children}</Suspense>
              </main>
              <Suspense
                fallback={
                  <div className="w-80 flex-shrink-0 hidden lg:block" />
                }
              >
                <RightSidebar />
              </Suspense>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
