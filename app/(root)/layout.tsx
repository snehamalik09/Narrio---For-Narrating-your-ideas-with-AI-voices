import LeftSideBar from "@/components/LeftSideBar";
import RightSideBar from "@/components/RightSideBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='text-white flex flex-row'>
        <LeftSideBar/>
        {children}
        <RightSideBar/>
    </div>
  );
}
