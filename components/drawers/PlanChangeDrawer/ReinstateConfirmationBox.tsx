"use client"
import { useState } from "react"
import Toast from "../../feedback/Toast"
import { ISku } from "@/types"
import { Button, Input } from "@nextui-org/react"
import { reinstateTeam } from "@/utils/team"
// import { modifyTeamSkus } from "@/app/team/actions"
// import { revalidateTagFromClientComponent } from "@/utils/revalidateTagFromClientComponent"

interface ReinstateConfirmationBoxProps {
  current_sku_base: string
  end_date: string
  new_sku_base: string
  new_license_description: string
  onCloseDrawer?: () => void
  teamId: string
  current_skus: Array<ISku>
  new_skus: Array<ISku>
  resellerIds: Array<string>
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>
  setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>
  setSelectedCommitmentType: React.Dispatch<React.SetStateAction<string>>
  setSelectedBaseSku: React.Dispatch<React.SetStateAction<string>>
  withPlanChange: "change" | "no-change"
}

const ReinstateConfirmationBox = ({ current_sku_base, new_sku_base, new_license_description, end_date, onCloseDrawer, teamId, current_skus, new_skus, resellerIds, setErrorMessage, setSuccessMessage, setSelectedCommitmentType, setSelectedBaseSku, withPlanChange = "no-change" }: ReinstateConfirmationBoxProps) => {

  const [confirmationInput, setConfirmationInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  

  if (withPlanChange === "no-change") {
    return (
      <div className="flex flex-col gap-4">
        <span className="text-xs leading-4 font-semibold text-default-500 uppercase">{`¿ESTÁS SEGURO DE QUERER REINSTAURAR ÉSTE CLIENTE?`}</span>
        <Button
          variant={'flat'}
          color={'default'}
          isDisabled={isLoading}
          radius={'sm'}
          size="lg"
          className="text-default-foreground text-sm"
          isLoading={isLoading}
          onPress={() => {
            setIsLoading(true)
            reinstateTeam(teamId, new_skus, resellerIds)
              .then(data => {
                console.log(`reinstateTeam/then/data: `, data)
              })
              .catch(error => {
                console.error('reinstateTeam/catch/error: ', error)
              })
              .finally(() => {
                setIsLoading(true)
              })
          }}
        >
          {isLoading ? 'Aplicando cambios...' : 'Confirmar'}
        </Button>
      </div>
    )
  }

  // TODO:
  /** - Do the actual reinstatement
   */

  return (
    <div className="flex flex-col gap-4">
      {
        new_skus && new_skus.length >= 1 && new_sku_base.length >= 1 && new_license_description.length >= 1 ?
        <>
          <span className="text-xs leading-4 font-semibold text-default-500 uppercase">{`¿ESTÁS SEGURO DE QUERER REINSTAURAR ÉSTE CLIENTE?`}</span>
          <Toast
            type={'info'}
          >
            <span className="text-sm leading-4 font-normal text-default-900">
              Éste cliente será reinstaurado en el plan <strong>{new_license_description}</strong>
            </span>
          </Toast>

          <Input
            type="text"
            isRequired
            placeholder={`Introduce la palabra "reinstaurar" para confirmar`}
            value={confirmationInput}
            onValueChange={setConfirmationInput}
          />
        </>
        :
        null
      }
      

      <Button
        variant={'flat'}
        color={'default'}
        isDisabled={(confirmationInput.toLowerCase() !== 'reinstaurar' || isLoading)}
        radius={'sm'}
        size="lg"
        className="text-default-foreground text-sm"
        isLoading={isLoading}
        onPress={() => {
          // Do the thing and then, close the drawer
          setIsLoading(true)
          reinstateTeam(teamId, [ { sku_id: new_sku_base, quantity: 1 } ], resellerIds)
            .then(data => {
              console.log(`reinstateTeam/then/data: `, data)
              if (!data) {
                // setCancelStatus("error")
                //@ts-ignore : Dropbox API inconsistent response structure
                setErrorMessage("Error desconocido")
                setSuccessMessage(null)
              }

              if (data.message) {
                // setCancelStatus("error")
                //@ts-ignore : Dropbox API inconsistent response structure
                setErrorMessage(data.message)
                setSuccessMessage(null)
              }

              if (data.code === 409) {
                setErrorMessage(data.message)
                setSuccessMessage(null)
              }

              if (data.code === 200) {
                setErrorMessage(null)
                setSuccessMessage(`El cliente ha sido reinstaurado con éxito.`)
              }

              // Success response takes mor than 30 seconds.
              // I could only make it work using the same skus and license sku, with the same amount of users to reinstate.
                        
              

            })
            .catch(error => {
              console.error(error)
              // setCancelStatus("error")
              setErrorMessage(error)
            })
            .finally(() => {
              setSelectedCommitmentType("")
              setConfirmationInput("")
              setSelectedBaseSku("")
              setIsLoading(false)
              // onClose()
            })
          // modifyTeamSkus(teamId, current_skus, new_skus, false, resellerIds)
          //   .then(data => {
          //     if (data.code !== 200) {
          //       setSuccessMessage(null)
          //       setErrorMessage(data?.message || data.error || "Error desconocido")
          //       revalidateTagFromClientComponent('team' + teamId)
          //     } else {
          //       setErrorMessage(null)
          //       setSuccessMessage(`${transitionValidationResult?.type} ${transitionValidationResult?.outcome === 'Immediate' ? 'realizado' : 'programado'} con éxito.`)
          //     }
          //   })
          //   .finally(() => {
          //     setSelectedCommitmentType("")
          //     setSelectedBaseSku("")
          //   })

        }}
      >
        {isLoading ? 'Aplicando cambios...' : 'Confirmar'}
      </Button>
    </div>
  )
}

export default ReinstateConfirmationBox