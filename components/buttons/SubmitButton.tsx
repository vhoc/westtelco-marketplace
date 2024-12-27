'use client'
import { Button } from "@nextui-org/react"
import { Dispatch, SetStateAction } from "react"
import { useFormStatus } from "react-dom"
import { useEffect } from "react"

interface SubmitButtonProps {
  formAction: any
  loadingText?: string | undefined
  defaultText?: string | undefined
  radius?: "sm" | "none" | "md" | "lg" | "full" | undefined
  className?: string | undefined
  isDisabled?: boolean | undefined
  size?: "sm" | "md" | "lg" | undefined
  isLoading?: boolean | undefined
  setIsLoading?: Dispatch<SetStateAction<boolean>>
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined
}

export const SubmitButton = ( { formAction, loadingText = 'Cargando...', defaultText = 'Enviar', isLoading = false, setIsLoading, color = 'default', ...props }: SubmitButtonProps ) => {

  const { pending: isBusy } = useFormStatus()

  useEffect(() => {
    if ( setIsLoading ) {
      setIsLoading(isBusy)
    }
  }, [setIsLoading, isBusy])
  
  return (
    <Button
      type="submit"
      color={color}
      isLoading={isBusy}
      radius={props.radius}
      className={props.className}
      isDisabled={props.isDisabled || isBusy}
      formAction={formAction}
      size={props.size}
    >
      {isBusy ? loadingText : defaultText}
    </Button>
  )
}

