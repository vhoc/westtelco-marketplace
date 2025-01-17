"use client"
import { Modal, ModalContent, ModalHeader, ModalBody, } from "@nextui-org/react"
import { CircularProgress } from "@nextui-org/react"

interface BusyModalProps {
  message: string
}

const BusyModal = ({message }: BusyModalProps) => {


  return (
    <Modal
      isOpen={true} 
    >

      <ModalContent>
          <ModalBody>
            <CircularProgress size="lg" aria-label={ message && message.length >= 1 ? message : 'Cargando...' } />
          </ModalBody>
      </ModalContent>

    </Modal>
  )
}

  export default BusyModal