"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@nextui-org/react";
// import { useTranslations } from "next-intl";

type Props = {
  formAction?: (formData: FormData) => Promise<any>
};

export function SubmitButton(props: Props) {
  // const t = useTranslations("Dashboard")
  const signingIn = "Autenticando"
  const signIn = "Ingresar"
  const { pending, action } = useFormStatus();

  const isPending = pending && action === props.formAction;

  return (

    <Button
      {...props}
      type="submit"
      isLoading={pending}
      radius={'sm'}
    >
      {isPending ? `${signingIn}...` : signIn}
    </Button>
  );
}
