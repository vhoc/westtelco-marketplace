"use client"
import { useState } from "react"
import { Button, Input } from "@nextui-org/react"
import { isEmailValid } from "@/utils/validators/input-fields/email"
import { ITeamDataFromDatabase } from "@/types"
import { updateDbTeamAdminEmail } from "@/app/team/actions"

interface TeamAdminEmailFieldProps {
  // admin_email?: string
  dbTeam: ITeamDataFromDatabase
}

const TeamAdminEmailField = ({ dbTeam }: TeamAdminEmailFieldProps) => {

  // console.log('dbTeam', dbTeam)

  const [adminEmail, setAdminEmail] = useState<string | null>(dbTeam.admin_email ?? null)
  const [updatedEmail, setUpdatedEmail] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdate = () => {
    if (dbTeam.team_id && adminEmail) {
      setIsLoading(true)
      updateDbTeamAdminEmail(dbTeam.team_id, adminEmail)
        .then((data) => {
          setUpdatedEmail(data.data?.admin_email ?? null)
          setEditMode(false)
        })
        .catch(error => {
          console.error(error)
          
        })
        .finally(() => {
          setIsLoading(false)
        })
    }

  }

  if ( (dbTeam.admin_email && dbTeam.admin_email.length >= 1) || (updatedEmail && updatedEmail.length >= 1) ) {
    return (
      <span className={'text-[#71717A] text-xs'}>{dbTeam.admin_email ?? updatedEmail}</span>
    )
  }

  return (

    <div className={'text-[#71717A] text-xs flex items-center'}>
      {
        editMode ?
          <Input
            type={'email'}
            size="sm"
            value={adminEmail ?? ''}
            onValueChange={setAdminEmail}
            placeholder="Ingrese el correo electrónico"
            variant={'bordered'}
            color={'primary'}
            isInvalid={!isEmailValid(adminEmail!)}
            errorMessage={!isEmailValid(adminEmail!) ? 'El correo electrónico no es válido.' : null}
          />
          :
          `No hay un correo electrónico registrado.`
      }

      <Button
        color={'primary'}
        variant={'light'}
        size={'sm'}
        className="ml-2"
        onPress={editMode ? handleUpdate : () => setEditMode(true)}
        isDisabled={editMode && !isEmailValid(adminEmail!) || isLoading}
      >
        {editMode ?
          isLoading ?
            'Actualizando...' :
              'Guardar' :
              'Agregar'}
      </Button>
      {
        editMode && !isLoading ?
          <Button
            color={'default'}
            variant={'light'}
            size={'sm'}
            className="ml-2"
            onPress={() => setEditMode(false)}
            isDisabled={isLoading}
          >
            Cancelar
          </Button>
          : null
      }
    </div>
  )

}

export default TeamAdminEmailField