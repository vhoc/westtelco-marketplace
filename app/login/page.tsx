import { SubmitButton } from "./submit-button";
import { login } from "./actions";
import { Input } from "@/lib/hero-ui";
import Image from "next/image";
import getConfig from "next/config";
import logoWt from '../../public/wt-logo-2024.png';
import flagMexico from '../../public/img/flagMx.png';
import flagBrazil from '../../public/img/flagBr.png';
import { Link } from "@/lib/hero-ui";

export default async function Login(
  props: {
    searchParams: Promise<{ message: string }>;
  }
) {
  const searchParams = await props.searchParams;

  const { publicRuntimeConfig } = getConfig();

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-start gap-2 bg-[#f4f4f5]">


      <div className="flex flex-col items-center p-[48px] text-black bg-white min-w-[496px] border-1 border-default-200 mt-[100px]">

        <div className="flex gap-2 flex-col items-center">
          <Image
            src={logoWt}
            width={113}
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
            <p className="mt-4 p-4 bg-warning-200 text-foreground text-center rounded">
              {searchParams.message}
            </p>
          )}
        </form>
        <div className={'flex justify-center gap-6 mt-10 w-full'}>
          <Link href={'https://market.wti.mx/'}>
            <Image
              src={flagMexico}
              width={28}
              height={28}
              alt="Marketplace de México"
              className={'rounded-sm'}
            />
          </Link>

          <Link href={'https://brmarket.wti.mx/'}>
            <Image
              src={flagBrazil}
              width={28}
              height={28}
              alt="Marketplace de Brasil"
              className={'rounded-sm'}
            />
          </Link>
        </div>
        <div className="text-default-400 mt-8 text-xs">
          Build {`${JSON.stringify(publicRuntimeConfig?.version.version)}`}
        </div>
      </div>


    </div>
  );
}
