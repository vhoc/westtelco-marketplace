import { Card, Modal, ModalBody, ModalContent, Skeleton } from "@nextui-org/react";
import { CircularProgress } from "@nextui-org/react";

export default async function PartnersLoadingPage() {

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center pt-[16px] animate-in opacity-1 px-3 text-black">
      <main className="flex-1 w-full flex flex-col gap-6 items-center px-16">

        <Card radius={'none'} shadow="none" className={'w-full px-[24px] py-[22px] gap-y-4'}>

          <Skeleton className="rounded-lg">
            <div className="h-24 rounded-lg bg-default-300" />
          </Skeleton>

          <Skeleton className="rounded-lg">
            <div className="h-8 rounded-lg bg-default-300" />
          </Skeleton>

          <Skeleton className="rounded-lg relative">
            <div className="h-96 rounded-lg bg-default-300" />
          </Skeleton>

        </Card>

        <Modal
          isOpen={true}
          hideCloseButton
        >
          <ModalContent>
            <ModalBody>
              <div className="w-full flex flex-col items-center gap-4 py-4">
                <CircularProgress size="lg" aria-label={'Cargando clientes...'} />
                <span className="text-default-700">Cargando partners...</span>
              </div>
            </ModalBody>
          </ModalContent>

        </Modal>

      </main>
    </div>
  );
}
