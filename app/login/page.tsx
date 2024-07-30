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

  const { publicRuntimeConfig } = getConfig();

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-start gap-2 bg-[#f4f4f5]">
      

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
          />
          
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
