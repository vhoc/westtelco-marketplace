import Image from "next/image";
import AuthButton from "@/components/auth/AuthButton";

export default function TeamsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex-1 w-full flex flex-col items-center">
      <nav className="w-full flex justify-center h-16 border-b-1 border-b-default-200">
        <div className="w-full flex justify-between items-center p-3 text-sm px-[80px] bg-white">
          <div className="flex gap-4 items-center">
            <Image
              src={"https://www.westtelco.com.mx/wp-content/uploads/2022/01/West-Telco-Logo-Marca-Registrada-23.png"}
              width={109}
              height={17}
              alt="West Telco"
            />
            <h1 className="text-lg text-[#00336A] border-l-1 border-[#D9D9D9] pl-[15px]"> Dropbox License Manager</h1>
          </div>
          <AuthButton />
        </div>
      </nav>

      <div className="animate-in w-full flex-1 flex flex-col gap-20 opacity-1 text-black">
        <main className="flex-1 w-full flex flex-col items-center">
          { children }
        </main>
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <Image
          src={"https://www.westtelco.com.mx/wp-content/uploads/2022/01/West-Telco-Logo-Marca-Registrada-23.png"}
          width={170}
          height={30}
          alt="West Telco"
        />
      </footer>
    </div>
  );
}