"use client"
import { useState, useEffect } from "react"
import Toast from "../../feedback/Toast"
import { ITransitionOutcome, ISku } from "@/types"
import { validateSKUTransition } from "@/utils/validators/sku/sku-transition-validator"
import { Button, Input } from "@heroui/react"
import { modifyTeamSkus } from "@/app/team/actions"
import { revalidateTagFromClientComponent } from "@/utils/revalidateTagFromClientComponent"

interface ConfirmationBoxProps {
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
}

const ConfirmationBox = ({ current_sku_base, new_sku_base, new_license_description, end_date, onCloseDrawer, teamId, current_skus, new_skus, resellerIds, setErrorMessage, setSuccessMessage, setSelectedCommitmentType, setSelectedBaseSku }: ConfirmationBoxProps) => {

  // const [ transitionType, setTransitionType ] = useState<"downgrade" | "upgrade">("downgrade")
  const [transitionValidationResult, setTransitionValidationResult] = useState<ITransitionOutcome>()
  const [confirmationInput, setConfirmationInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Validate the transition
  useEffect(() => {
    const validateTransition = async () => {
      const outcome = await validateSKUTransition(current_sku_base, new_sku_base)
      // Temporal translation to spanish of 'commitment change'
      if (outcome.type === 'Commitment change') {
        setTransitionValidationResult({
          ...outcome,
          // eslint-disable-next-line
          //@ts-ignore
          type: 'Cambio de modalidad',
        })
        return
      }
      setTransitionValidationResult(outcome)
    }
    validateTransition()
  }, [current_sku_base, new_sku_base])


  return (
    <div className="flex flex-col gap-4">
      <span className="text-xs leading-4 font-semibold text-default-500 uppercase">{`¿ESTÁS SEGURO DE QUERER REALIZAR ÉSTE ${transitionValidationResult?.type ?? 'CAMBIO'}?`}</span>
      <Toast
        type={transitionValidationResult?.outcome === 'Scheduled' ? 'warning' : 'info'}
      >
        <span className="text-sm leading-4 font-normal text-default-900">
          {'Este '}
          <strong>{transitionValidationResult?.type ?? 'cambio'}</strong>

          {
            // eslint-disable-next-line
            //@ts-ignore
            transitionValidationResult?.type === 'Cambio de modalidad' ?
              transitionValidationResult.outcome === 'Immediate' ?
              ' se aplicará de forma inmediata al confirmar.'
              :
              ' se programará para realizarse '
            :
            transitionValidationResult?.outcome === 'Scheduled' ?
            (
              <>
                &nbsp;programará el cambio al plan <strong>{new_license_description}</strong>
              </>
            )
            :
              // ' programará el cambio al plan ' :
              transitionValidationResult?.outcome === 'Immediate' ?
              (
                <>
                  &nbsp;permite que el cambio al plan <strong>{new_license_description}</strong> se aplique de manera inmediata al confirmar.
                </>
              )
                :
                ' no está permitido'
          }

          {
            transitionValidationResult?.outcome === 'Scheduled' ?
              ` una vez que termine el plazo del plan actual (${end_date}).` :
              null
          }
        </span>
      </Toast>

      <Input
        type="text"
        isRequired
        placeholder={`Introduce la palabra "${transitionValidationResult?.type ?? 'Cambio'}" para confirmar`}
        value={confirmationInput}
        onValueChange={setConfirmationInput}
      />

      <Button
        variant={'flat'}
        color={'default'}
        isDisabled={(confirmationInput.toLowerCase() !== transitionValidationResult?.type?.toLowerCase()) || isLoading}
        radius={'sm'}
        size="lg"
        className="text-default-foreground text-sm"
        isLoading={isLoading}
        onPress={() => {
          // Do the thing and then, close the drawer
          setIsLoading(true)
          modifyTeamSkus(teamId, current_skus, new_skus, false, resellerIds)
            .then(data => {
              if (data.code !== 200) {
                setSuccessMessage(null)
                setErrorMessage(data?.message || data.error || "Error desconocido")
                revalidateTagFromClientComponent('team' + teamId)
              } else {
                setErrorMessage(null)
                setSuccessMessage(`${transitionValidationResult?.type} ${transitionValidationResult?.outcome === 'Immediate' ? 'realizado' : 'programado'} con éxito.`)
              }
            })
            .finally(() => {
              setSelectedCommitmentType("")
              setSelectedBaseSku("")
            })
            
        }}
      >
        { isLoading ? 'Aplicando cambios...' : 'Confirmar' }
      </Button>
    </div>
  )
}

export default ConfirmationBox