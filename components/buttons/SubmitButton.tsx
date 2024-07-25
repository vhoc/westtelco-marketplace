'use client'
import { Button } from "@nextui-org/react"
import { Dispatch, SetStateAction } from "react"
import { useFormStatus } from "react-dom"
import { useEffect } from "react"

interface SubmitButtonProps {
  // isSubmitDisabled?: boolean
  formAction: any
  loadingText?: string | undefined
  defaultText?: string | undefined
  radius?: "sm" | "none" | "md" | "lg" | "full" | undefined
  className?: string | undefined
  isDisabled?: boolean | undefined
  size?: "sm" | "md" | "lg" | undefined
  isLoading?: boolean | undefined
  setIsLoading?: Dispatch<SetStateAction<boolean>>
}

export const SubmitButton = ( { formAction, loadingText = 'Cargando...', defaultText = 'Enviar', isLoading = false, setIsLoading, ...props }: SubmitButtonProps ) => {

  const { pending: isBusy } = useFormStatus()

  useEffect(() => {
    if ( setIsLoading ) {
      setIsLoading(isBusy)
    }
  }, [setIsLoading, isBusy])
  
  return (
    <Button
      type="submit"
      isLoading={isBusy}
      radius={props.radius}
      className={props.className}
      isDisabled={props.isDisabled || isBusy}
      // onClick={handleSubmit}
      formAction={formAction}
      size={props.size}
    >
      {isBusy ? loadingText : defaultText}
    </Button>
  )
}

