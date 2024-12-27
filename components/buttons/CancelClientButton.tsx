"use client"
import { useState, useEffect } from "react"
import { Button, ModalFooter, ModalHeader } from "@nextui-org/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserSlash } from "@fortawesome/free-solid-svg-icons"
import { cancelTeam, reinstateTeam } from "@/utils/team"
import { Modal, ModalContent, ModalBody, useDisclosure, Spinner } from "@nextui-org/react"
import { ISku } from "@/types"
import clsx from "clsx"

interface CancelClientButton {
  teamId: string
  teamActive: boolean
  skus?: Array<ISku> | undefined
  resellerIds?: Array<string> | undefined
}

const CancelClientButton = ({ teamId, teamActive, skus, resellerIds = [] }: CancelClientButton) => {

  // const [cancelStatus, setCancelStatus] = useState<"error" | "success" | "none">("none")
  const [errorMessage, setErrorMessage] = useState("")

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const { isOpen: isOpenError, onOpen: onOpenError, onOpenChange: onOpenChangeError, onClose: onCloseError } = useDisclosure()
  const { isOpen: isOpenConfirmation, onOpen: onOpenConfirmation, onOpenChange: onOpenChangeConfirmation, onClose: onCloseConfirmation } = useDisclosure()

  const handleCancel = () => {
    onOpen()
    if (teamId && resellerIds) {
      cancelTeam(teamId, resellerIds)
        .then(data => {
          if (!data) {
            // setCancelStatus("error")
            //@ts-ignore : Dropbox API inconsistent response structure
            setErrorMessage("Error desconocido")
          }

          if (data.message) {
            // setCancelStatus("error")
            //@ts-ignore : Dropbox API inconsistent response structure
            setErrorMessage(data.message)
          }

          // setCancelStatus("success")

        })
        .catch(error => {
          // setCancelStatus("error")
          setErrorMessage(error)
        })
        .finally(() => {
          onClose()
        })
    }
  }

  const handleReinstate = () => {
    if (skus && skus.length >= 1 && resellerIds) {
      onOpen()
      reinstateTeam(teamId, skus, resellerIds)
        .then(data => {
          console.log(`reinstateTeam/then/data: `, data)
          if (!data) {
            // setCancelStatus("error")
            //@ts-ignore : Dropbox API inconsistent response structure
            setErrorMessage("Error desconocido")
          }

          if (data.message) {
            // setCancelStatus("error")
            //@ts-ignore : Dropbox API inconsistent response structure
            setErrorMessage(data.message)
          }

          // setCancelStatus("success")

        })
        .catch(error => {
          console.error(error)
          // setCancelStatus("error")
          setErrorMessage(error)
        })
        .finally(() => {
          onClose()
        })
    }
  }

  // Controls the error modal depending on the errorMessage state
  useEffect(() => {
    if (errorMessage && errorMessage.length >= 1) {
      onOpenError()
    }
  }, [errorMessage, onOpenError])

  return (
    <>
      <Button
        color={teamActive ? "danger" : "success"}
        variant="ghost"
        size={'sm'}
        endContent={<FontAwesomeIcon icon={faUserSlash} size="lg" aria-label="Suspender cliente" className={clsx( teamActive ? "text-[#ff0049] group-hover:text-white" : "text-[#00dc6c] group-hover:text-white" )}/>}
        onPress={onOpenConfirmation}
        className={clsx(
          teamActive ?
            "group text-[#ff0049] group-hover:text-white"
            :
            "group text-[#00dc6c] group-hover:text-white"
        )}
      >
        {
          teamActive ?
            <span className="text-[#ff0049] group-hover:text-white">Suspender cliente</span>
            :
            <span className="text-[#00dc6c] group-hover:text-white">Reinstaurar cliente</span>
        }
      </Button>

      {/* MODAL "WORKING" */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        backdrop={'blur'}
        isKeyboardDismissDisabled
        hideCloseButton
        shouldBlockScroll
      >
        <ModalContent>
          <ModalBody className={'pb-10 pt-10 px-6'}>
            <Spinner label="Aplicando cambios..." size={'lg'} />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* CONFIRMATION MODAL */}
      <Modal
        isOpen={isOpenConfirmation}
        onOpenChange={onOpenChangeConfirmation}
        backdrop={'blur'}
        shouldBlockScroll
        onClose={() => {
          setErrorMessage("")
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-black">CONFIRMACIÓN</ModalHeader>
          <ModalBody className={'text-black'}>
            {
              teamActive ?
                <div className={'flex flex-col gap-2'}>
                  <span>¿Estás seguro de que deseas suspender el servicio a éste cliente?</span>
                </div>
                :
                <div className={'flex flex-col gap-2'}>
                  <span>¿Estás seguro de que deseas reinstaurar el servicio a éste cliente?</span>
                </div>
            }
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              variant={'light'}
              onPress={() => {
                onCloseConfirmation()
              }}
              aria-label="Cerrar mensaje de confirmación"
            >
              Cancelar
            </Button>
            <Button
              color={teamActive ? 'danger' : 'success'}
              onPress={() => {
                if (teamActive) {
                  handleCancel()
                } else {
                  handleReinstate()
                }
                onCloseConfirmation()
              }}
              aria-label="Cerrar mensaje de confirmación"
            >
              Aceptar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ERROR MODAL */}
      <Modal
        isOpen={isOpenError}
        onOpenChange={onOpenChangeError}
        backdrop={'blur'}
        shouldBlockScroll
        onClose={() => {
          setErrorMessage("")
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-black">ERROR</ModalHeader>
          <ModalBody className={'text-black'}>
            {
              errorMessage
            }
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onPress={() => {
                setErrorMessage("")
                onCloseError()
              }}
              aria-label="Cerrar mensaje de error"
            >
              Aceptar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CancelClientButton