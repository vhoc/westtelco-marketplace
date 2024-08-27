import Image from "next/image";
import AuthButton from "@/components/auth/AuthButton";
import getConfig from "next/config";
import logoWt from '../../public/wt-logo-2024.png'
import { isUserValid } from "@/utils/auth";


export default async function TeamsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  await isUserValid()

  const { publicRuntimeConfig } = getConfig();

  return (
    <div className="flex-1 w-full flex flex-col items-center">
      <nav className="w-full flex justify-center h-16 border-b-1 border-b-default-200">
        <div className="w-full flex justify-between items-center p-3 text-sm px-[80px] bg-white">
          <div className="flex gap-4 items-center">
            <Image
              src={logoWt}
              width={113}
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

      <footer className="w-full border-t border-t-foreground/10 p-8 flex flex-col justify-center text-center items-center text-xs gap-4">
        <Image
          src={logoWt}
          width={113}
          height={17}
          alt="West Telco"
        />
        <div className="text-default-500">Build { `${ JSON.stringify(publicRuntimeConfig?.version.version) }` }</div>
      </footer>
    </div>
  );
}