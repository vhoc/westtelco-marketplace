"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@nextui-org/react";

type Props = {
  formAction?: (formData: FormData) => Promise<any>
};

export function SubmitButton(props: Props) {
  const signingIn = "Autenticando"
  const signIn = "Acceder"
  const { pending, action } = useFormStatus();

  const isPending = pending && action === props.formAction;

  return (

    <Button
      {...props}
      type="submit"
      isLoading={pending}
      radius={'sm'}
      color={'primary'}
      className={'mt-6'}
    >
      {isPending ? `${signingIn}...` : signIn}
    </Button>
  );
}
