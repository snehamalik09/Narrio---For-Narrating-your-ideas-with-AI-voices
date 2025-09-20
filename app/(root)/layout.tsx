import LeftSideBar from "@/components/LeftSideBar";
import MobileNav from "@/components/MobileNav";
import RightSideBar from "@/components/RightSideBar";
import Image from "next/image";
import { Toaster } from "@/components/ui/sonner"
import GlobalPlayer from "@/components/GlobalPlayer";
import Link from "next/link";
import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
} from '@clerk/nextjs'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=' relative text-white flex flex-col'>
      <main className='relative flex'>
        <LeftSideBar />
        <section className=" flex flex-col min-h-screen flex-1 px-4 sm:px-14">
          <div className="mx-auto flex flex-col w-full max-w-5xl px-5 py-7 max-sm:px-4">
            <div className="lg:hidden flex items-center justify-between h-16">
              <Link href="/">
              <Image src='/icons/logo.svg' alt="menu logo" width={30} height={30} />
              </Link>
              <div className="xl:hidden">
                  <SignedOut>
                    <SignInButton>
                      <button className='text-12 font-bold bg-orange-500 text-white px-6 py-1 cursor-pointer rounded-lg'>
                        Sign In
                      </button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
              </div>

              <MobileNav />
            </div>
            <div className="flex flex-col md:!pb-[16vh] !pb-[16vh] ">
              <Toaster position='top-center' richColors theme='light' />
              {children}
            </div>
          </div>

        </section>

        <RightSideBar />
        <GlobalPlayer />
      </main>
    </div>
  );
}
