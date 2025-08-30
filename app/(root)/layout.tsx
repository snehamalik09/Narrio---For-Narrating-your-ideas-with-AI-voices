import LeftSideBar from "@/components/LeftSideBar";
import MobileNav from "@/components/MobileNav";
import RightSideBar from "@/components/RightSideBar";
import Image from "next/image";
import { Toaster } from "@/components/ui/sonner"


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=' relative text-white flex flex-col'>
      <main className='relative flex'>
        <LeftSideBar/>
        <section className=" flex flex-col min-h-screen flex-1 px-4 sm:px-14">
          <div className="mx-auto flex flex-col w-full max-w-5xl px-5 py-7 max-sm:px-4">
            <div className="md:hidden flex items-center jsutify-between h-16">
              <Image src='/icons.logo.svg' alt="menu logo" width={30} height={30} />
              <MobileNav/>
            </div>
            <div className="flex flex-col">
              <Toaster position='top-center' richColors theme='light' />
              {children}
            </div>
          </div>
          
        </section>
        
        <RightSideBar/>
        </main>
    </div>
  );
}
