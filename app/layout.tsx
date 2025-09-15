import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/store/ReduxProvider";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Narrio",
  description: "Narrate your idea with AI voices.",
  icons: {
    icon: '/icons/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{
      layout: {socialButtonsVariant:'iconButton', logoImageUrl:'/icons/logo.svg'},
      variables : {colorBackground: '#15171c', colorPrimary: '#f97316', colorText: 'white', colorInputBackground: '#1b1f29', colorInputText:'white' },
      elements: {
      socialButtonsIconButton: "bg-white hover:bg-white", 
    },
      }}>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider> {children} </ReduxProvider>
        
      </body>
    </html>
    </ClerkProvider>
  );
}




