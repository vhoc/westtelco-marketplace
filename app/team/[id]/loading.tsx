import { Modal, ModalBody, ModalContent, Skeleton } from "@nextui-org/react";
import { CircularProgress } from "@nextui-org/react";

export default async function TeamLoadingPage() {

  return (
    <div className="w-full flex flex-col">

      <div className={'py-4 px-[80px] bg-white w-full flex justify-between items-end border-b-1 border-b-default-200 gap-2'}>
        <Skeleton className="rounded-lg">
          <div className="h-32 rounded-lg bg-default-300" />
        </Skeleton>
      </div>

      <div className={'py-4 w-full flex flex-col items-center justify-center px-[80px]'}>
        <Skeleton className="rounded-lg relative">
          <div className="h-96 rounded-lg bg-default-300" />
        </Skeleton>
      </div>

      <Modal
        isOpen={true}
        hideCloseButton
      >
        <ModalContent>
          <ModalBody>
            <div className="w-full flex flex-col items-center gap-4 py-4">
              <CircularProgress size="lg" aria-label={'Cargando datos del cliente...'} />
              <span className="text-default-700">Cargando datos del cliente...</span>
            </div>
          </ModalBody>
        </ModalContent>

      </Modal>

    </div>
  )

}
