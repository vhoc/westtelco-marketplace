"use client"
import { useState } from "react";
import { Switch } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { modifyTeamAutorenew } from "@/app/team/actions";
import { type ISku } from "@/types";

interface AutoRenewalSwitchProps {
  className?: string
  autoRenewal?: boolean
  skus: Array<ISku>
  teamId: string
  resellerIds: Array<string>
}

const AutoRenewalSwitch = ({ className, autoRenewal, skus, teamId, resellerIds }: AutoRenewalSwitchProps) => {

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isSwitchTrue, setIsSwitchTrue] = useState(autoRenewal)
  const [isBusy, setIsBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    try {
      setError(null)
      setIsBusy(true)
      // console.log(`Attempting to update `)
      const modifyResponse = await modifyTeamAutorenew(teamId, skus, isSwitchTrue ?? false, resellerIds)

      if ( modifyResponse.code !== 200 ) {
        setError(`Error intentando modificar la auto-renovación: ${modifyResponse.data}`)
      } else {
        onClose()
      }

      // console.log('modifyResponse: ', modifyResponse)
    } catch (error) {
      console.error(error)
      setError(`Error intentando modificar la auto-renovación: ${error}`)
    } finally {
      setIsBusy(false)
    }
  }
  
  return (
    <>
      <Switch
        className={className}
        classNames={{
          base: "inline-flex flex-row-reverse items-center gap-4",
          label: "m-0",
        }}
        isSelected={isSwitchTrue}
        onValueChange={(value) => {
          setIsSwitchTrue(value)
          onOpen()
        }}
      >
        <div className="flex flex-col">
          <span className="text-sm leading-5 font-medium text-left">Auto-renovación</span>
          <span className="text-default-500 text-left text-xs">Se renovará el plan automáticamente</span>
        </div>
      </Switch>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-default-900">
                {
                  error && error.length >= 1 ?
                    <span className="text-red-700">
                      Error
                    </span>
                    :
                    <span className="text-default-900">
                      Confirmar cambio
                    </span>
                }
              </ModalHeader>

              <ModalBody>
                {
                  error && error.length >= 1 ?
                    <p className="text-red-700">
                      {error}
                    </p>
                  :
                    <p className="text-default-900">
                      ¿Estás seguro de que deseas {!isSwitchTrue ? 'desactivar' : 'activar'} la auto-renovación?
                    </p>
                }
                
              </ModalBody>

              <ModalFooter>
                {
                  error && error.length >= 1 ?
                    null
                  :
                    <Button
                      color="default"
                      variant="light"
                      onPress={() => {
                        setIsSwitchTrue(!isSwitchTrue)
                        onClose()
                      }}
                      isDisabled={isBusy}
                    >
                      Cancelar
                    </Button>
                }
                

                <Button
                  color={ error && error.length >= 1 ? 'default' : 'primary' }
                  onPress={!error ? handleConfirm : () => {
                    onClose()
                    setError(null)
                    setIsSwitchTrue(autoRenewal)
                  }}
                  isDisabled={isBusy}
                  isLoading={isBusy}
                >
                  Aceptar
                </Button>
              </ModalFooter>

            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default AutoRenewalSwitch