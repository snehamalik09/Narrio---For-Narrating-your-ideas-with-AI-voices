import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative h-screen w-full">
      <div className='text-white absolute size-full'>
        <Image src='/images/bg-img.png' alt="bg" fill className="size-full" />
        {children}
      </div>
    </main>
  );
}
