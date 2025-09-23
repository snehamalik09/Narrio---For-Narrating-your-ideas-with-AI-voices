"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navItems } from "@/constants";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";


const MobileNav = () => {
  const pathName = usePathname();
  const { user } = useUser();

  return (
    <div className="fixed bottom-0 left-0 h-[60px] w-full bg-black/80 backdrop-blur-lg border-t border-gray-800 z-[1000] md:hidden">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const href = item.name === "My Profile" ? `/profile/${user?.id}` : item.href;
          const isActive = pathName === href;

          
          return (
            <Link key={item.href} href={href} className="flex flex-col items-center group">
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: isActive ? 1.2 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="relative"
              >
                <Image
                  alt={item.name}
                  src={item.icon}
                  width={24}
                  height={24}
                  className={`${isActive ? "brightness-125" : "opacity-70 group-hover:opacity-100"}`}
                />
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-orange-500 rounded-full"
                  />
                )}
              </motion.div>
              <p
                className={`text-[10px] mt-1 transition-all ${
                  isActive ? "text-orange-500 font-semibold" : "text-gray-300 group-hover:text-white"
                }`}
              >
                {item.name}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNav;
