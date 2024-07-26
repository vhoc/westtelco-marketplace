import { SubmitButton } from "./submit-button";
import { login } from "./actions";
import { Input } from "@nextui-org/react";
import Image from "next/image";
import getConfig from "next/config";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {

  // const t = useTranslations('Dashboard')
  const { publicRuntimeConfig } = getConfig();

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-start gap-2 bg-[#f4f4f5]">
      {/* <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Regresar
      </Link> */}

      <div className="flex flex-col items-center p-[48px] text-black bg-white min-w-[496px] border-1 border-default-200 mt-[100px]">

        <div className="flex gap-2 flex-col items-center">
          <Image
            src={"https://www.westtelco.com.mx/wp-content/uploads/2022/01/West-Telco-Logo-Marca-Registrada-23.png"}
            width={109}
            height={17}
            alt="West Telco"
          />
          <p className="text-md text-[#00336A] mt-1">Dropbox License Manager</p>
        </div>

        <p className="text-xl font-medium text-[#00336A] mt-12 mb-4">Inicia sesión para continuar</p>

        <form
          action={login}
          className="animate-in flex-1 flex flex-col w-full justify-center gap-4 text-foreground"
        >
          <Input
            isRequired
            type="email"
            name="email"
            label={"Email"}
            radius={'sm'}
            size={'sm'}
          />
          <Input
            isRequired
            type="password"
            name="password"
            label={"Contraseña"}
            radius={'sm'}
            size={'sm'}
          />
          <SubmitButton
            formAction={login}
          // className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
          // pendingText="Signing In..."
          />
          {/* <SubmitButton
          formAction={signUp}
          className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
          pendingText="Signing Up..."
        >
          Sign Up
        </SubmitButton> */}
          {searchParams?.message && (
            <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
              {searchParams.message}
            </p>
          )}
        </form>
        <div className="text-default-500 text-sm mt-4">Build { `${ JSON.stringify(publicRuntimeConfig?.version.version) }` }</div>
      </div>


    </div>
  );
}
