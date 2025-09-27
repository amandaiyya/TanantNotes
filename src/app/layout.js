import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import '@fontsource/poppins';
import { Toaster } from "react-hot-toast";
import UserContextProvider from "@/context/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TenantNotes",
  description: "A Multi Tenant Notes app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <UserContextProvider>
            <div className="w-screen h-screen flex flex-col">
              <Navbar />
              <div className="flex-1 overflow-y-auto border border-sky-100">
                {children}
              </div>
              <Footer />
            </div>
          </UserContextProvider>

          <Toaster position="bottom-right" toastOptions={{className: 'text-sm sm:text-base'}}/>
      </body>
    </html>
  );
}
