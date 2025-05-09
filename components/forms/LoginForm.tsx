"use client"
import { login } from "@/app/login/actions"
import { Input } from "@/lib/hero-ui"
import { SubmitButton } from "@/app/login/submit-button"
import { useState } from "react";

interface LoginFormProps {
  message?: string
}

export const LoginForm = ({ message }: LoginFormProps) => {

  const [isLoading, setIsLoading] = useState(false)

  return (
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
        setIsLoading={setIsLoading}
        isLoading={isLoading}
      />

      {message && (
        <p className="mt-4 p-4 bg-warning-200 text-foreground text-center rounded">
          {message}
        </p>
      )}
    </form>
  )
}