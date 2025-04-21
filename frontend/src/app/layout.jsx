// layout.jsx
'use client'

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Provider } from "react-redux";
import store, { persistor } from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";
import SocketProvider from "../components/ui/SocketProvider";
import ProtectedRoutes from "../components/ui/ProtectedRoutes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <SocketProvider />
            <ProtectedRoutes>
              {children}
            </ProtectedRoutes>
            <Toaster />
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}

