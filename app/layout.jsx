import "./globals.css";
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
              <LeftSidebar />

              <main className="flex-1 min-w-0 border-x border-zinc-900 min-h-screen max-w-2xl">
                {children}
              </main>

              <RightSidebar />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
