"use client";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import Toast from "../feedback/Toast";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";

interface FindTeamFormProps {
  message?: string | undefined
  formAction: any
  className?: string | undefined
}

const FindTeamForm = ({ message, formAction, className }: FindTeamFormProps) => {

  const [teamId, setTeamId] = useState('')
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleTeamIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setTeamId(value)
    setIsSubmitDisabled(value.trim() === '');
  }

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsLoading(true);
    (event.target as HTMLButtonElement).form?.requestSubmit();
  }

  return (
    <form action={formAction} className={className}>
      <Input
        name={'teamId'}
        label={'TEAM ID'}
        placeholder={'Introduce Dropbox TEAM ID para buscar al cliente'}
        aria-label="Team ID"
        isRequired
        value={teamId}
        onChange={handleTeamIdChange}
      />
      {message && (
        <Toast type={'warning'}>
          {message}
        </Toast>
      )}
      <Button
        type="submit"
        isLoading={isLoading}
        radius={'sm'}
        color="primary"
        className="w-full"
        isDisabled={isSubmitDisabled || isLoading}
        onClick={handleSubmit}
        formAction={formAction}
        size={'lg'}
      >
        {isLoading ? `Buscando...` : 'Buscar'}
      </Button>

      <Button
        color="primary"
        variant={'light'}
        radius={'sm'}
        onPress={() => router.push('/team/new')}
      >
        Crear Cliente
      </Button>
    </form>
  )

}

export default FindTeamForm