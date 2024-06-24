import Link from "next/link";
import { SubmitButton } from "./submit-button";
import { login } from "./actions";
// import { useTranslations } from "next-intl";
import { Input } from "@nextui-org/react";
export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {

  // const t = useTranslations('Dashboard')

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <Link
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
      </Link>

      <form
        action={login}
        className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
      >
        <Input
          isRequired
          type="email"
          name="email"
          label={"Email"}
          radius={'sm'}
        />
        <Input
          isRequired
          type="password"
          name="password"
          label={"Contraseña"}
          radius={'sm'}
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
    </div>
  );
}
