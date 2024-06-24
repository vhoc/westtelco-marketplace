import Header from "@/components/Header";
import Image from "next/image";
import AuthButton from "@/components/auth/AuthButton";

export default function Home() {


  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <div className="flex gap-4 items-center">
            <Image
              src={"https://www.westtelco.com.mx/wp-content/uploads/2022/01/West-Telco-Logo-Marca-Registrada-23.png"}
              width={170}
              height={30}
              alt="West Telco"
            />
            <h1 className="text-xl"> Marketplace</h1>
          </div>
          <AuthButton />
        </div>
      </nav>

      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
        <Header />
        <main className="flex-1 flex flex-col gap-6">
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
