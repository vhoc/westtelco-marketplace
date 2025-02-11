"use client"

import { Button } from "@nextui-org/react"
import { useState } from "react"
import { fixMissingTeamData } from "@/app/team/actions"
import { ITeamData } from "@/types"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { useRouter } from "next/navigation"


interface FixMissingTeamDataButtonProps {
  team: ITeamData
}

const FixMissingTeamDataButton = ({ team }: FixMissingTeamDataButtonProps) => {

  const [isBusy, setIsBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { onOpenChange } = useDisclosure();
  const router = useRouter()

  const handleFixMissingData = async () => {
    setError(null)
    setIsBusy(true)

    const fixMissingDataResponse = await fixMissingTeamData(team.id, team?.name, team.reseller_ids[1] ? team.reseller_ids[1] : team.reseller_ids[0], team.start_date ?? '',)

    if (!fixMissingDataResponse.ok) {
      setError(fixMissingDataResponse.error ?? null)
      setIsBusy(false)
    }

    
    router.refresh()
  }

  return (
    <>
      <Button
        color="primary"
        size="sm"
        onPress={handleFixMissingData}
        isLoading={isBusy}
        isDisabled={isBusy}
      >
        Solucionar
      </Button>

      <Modal
        isOpen={(error && error.length >= 1) ? true : false}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-default-900">
                <span className="text-red-700">
                  Error
                </span>
              </ModalHeader>

              <ModalBody>
                <p className="text-red-700">
                  {error}
                </p>
              </ModalBody>

              <ModalFooter>


                <Button
                  color={error && error.length >= 1 ? 'default' : 'primary'}
                  onPress={() => {
                    onClose()
                    setError(null)
                  }}
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

export default FixMissingTeamDataButton