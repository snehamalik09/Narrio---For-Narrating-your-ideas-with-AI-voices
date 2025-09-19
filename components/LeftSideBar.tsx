'use client';
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navItems } from "@/constants";
import { useUser } from "@clerk/nextjs";
import MobileNav from "./MobileNav";

const LeftSideBar = () => {
  const pathName = usePathname();
  const { user } = useUser();

  return (
    <section className="text-white bg-black-1 min-h-screen">
      {/* <MobileNav/> */}
      <nav className="left_sidebar gap-7">
        <Link href="/" className="flex gap-2 md:gap-4 text-2xl pl-[10px]">
          <Image alt="logo" src="/icons/logo.svg" width={23} height={27} />
          <h1>Narrio</h1>
        </Link>

        <div className="flex flex-col gap-2 md:gap-4">
          {navItems.map((item) => {
            if (item.name === "My Profile" && !user) return null;

            const href = item.name === "My Profile" ? `/profile/${user?.id}` : item.href;

            return (
              <Link
                key={item.href}
                href={href}
                className={`flex justify-center md:justify-start gap-2 md:gap-4 p-2 
          ${pathName === item.href ? 'bg-nav-focus border-r-4 border-orange-600 text-18' : ''}`}
              >
                <Image alt={item.name} src={item.icon} width={23} height={27} />
                <p>{item.name}</p>
              </Link>
            );
          })}
        </div>


      </nav>


    </section>
  );
};

export default LeftSideBar;
