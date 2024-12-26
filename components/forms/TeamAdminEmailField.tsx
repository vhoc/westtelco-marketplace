"use client"
import { useState } from "react"
import { Button, Input } from "@nextui-org/react"
import { isEmailValid } from "@/utils/validators/input-fields/email"
import { INewTeamData } from "@/types"
import { updateDbTeamAdminEmail } from "@/app/team/actions"

interface TeamAdminEmailFieldProps {
  admin_email?: string
  dbTeam: INewTeamData
}

const TeamAdminEmailField = ({ admin_email, dbTeam }: TeamAdminEmailFieldProps) => {

  const [adminEmail, setAdminEmail] = useState(admin_email)
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

  if (admin_email || updatedEmail) {
    return (
      <span className={'text-[#71717A] text-xs'}>{admin_email ?? updatedEmail}</span>
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