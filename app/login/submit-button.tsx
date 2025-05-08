"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/lib/hero-ui";
import { useEffect } from "react";
import { Dispatch, SetStateAction } from "react"

type Props = {
  formAction?: (formData: FormData) => Promise<any>
  isLoading?: boolean | undefined
  setIsLoading?: Dispatch<SetStateAction<boolean>>
};

export function SubmitButton({ formAction, isLoading = false, setIsLoading }: Props) {
  const signingIn = "Autenticando"
  const signIn = "Acceder"
  // const { pending, action } = useFormStatus();

  // const isPending = pending && action === props.formAction;
  const { pending: isBusy } = useFormStatus()

  useEffect(() => {
    if ( setIsLoading ) {
      setIsLoading(isBusy)
    }
  }, [setIsLoading, isBusy])

  return (

    <Button
      // {...props}
      type="submit"
      isLoading={isBusy}
      isDisabled={isBusy}
      radius={'sm'}
      color={'primary'}
      className={'mt-6'}
      formAction={formAction}
    >
      {isBusy ? `${signingIn}...` : signIn}
    </Button>
  );
}
