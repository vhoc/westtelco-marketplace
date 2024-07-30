"use client"
import { ISku } from "@/types"
import { Card, CardHeader, CardBody, Divider, Button, Spinner } from "@nextui-org/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencil, faUsers, faRotateLeft, faFloppyDisk } from "@fortawesome/free-solid-svg-icons"
import { Chip } from "@nextui-org/react"
import LicensesTable from "./LicensesTable"
import { Modal, ModalContent, ModalBody, useDisclosure, ModalHeader, ModalFooter } from "@nextui-org/react"
import { useState, useEffect } from "react"
import { modifyTeamSkus } from "@/utils/team"

interface LicenseBoxProps {
  baseSku: string
  license_description?: string | undefined
  skus: Array<ISku>
  renewalStateSkus?: Array<ISku>
  num_licensed_users: number
  space_quota: number
  auto_renew: boolean
  end_datetime: string
  teamId: string
  active: boolean
}

export default function LicenseBox(props: LicenseBoxProps) {

  const [editMode, setEditMode] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // LIFTED STATE from <LicensesTable>
  const [modifyStatus, setModifyStatus] = useState<"error" | "success" | "none">("none")

  // LIFTED STATE from <LicensesTable>
  // const [newSkus, setNewSkus] = useState(props.skus)
  const [newSkus, setNewSkus] = useState<Array<ISku>>([])

  // LIFTED STATE from <LicensesTable>
  const [forceImmediate, setForceImmediate] = useState(false)

  // LIFTED STATE from <LicensesTable>
  const [newAddonSkus, setNewAddonSkus] = useState<Array<ISku>>([])

  const [formattedEndDate, setFormattedEndDate] = useState("")

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { isOpen: isOpenError, onOpen: onOpenError, onOpenChange: onOpenChangeError, onClose: onCloseError } = useDisclosure();

  const handleUpdate = () => {
    onOpen()
    if (props.teamId && props.baseSku && props.skus && newSkus) {
      console.log(`handleUpdate/newSkus: `, newSkus)
      modifyTeamSkus(props.teamId, props.skus, newSkus)
        .then(data => {
          if (data.code !== 200) {
            setModifyStatus("error")
            setErrorMessage(data?.message || "Error desconocido")
            setNewSkus([])
            setNewAddonSkus([])
          }
          setModifyStatus("success")
          setNewSkus([])
          setNewAddonSkus([])
        })
        .catch(error => {
          console.error(error)
          setModifyStatus("error")
          setErrorMessage(error)
          // setNewSkus(props.skus)
          setNewSkus([])
          setNewAddonSkus([])
        })
        .finally(() => {
          onClose()
          setEditMode(false)
        })
    }
  }

  useEffect(() => {
    if (props.end_datetime && props.end_datetime.length >= 1) {
      const dateString = new Date(props.end_datetime).toLocaleString(process.env.NEXT_PUBLIC_LOCALE, { timeZone: process.env.NEXT_PUBLIC_TIMEZONE })
      setFormattedEndDate(dateString)
    }
  }, [props.end_datetime])

  // Controls the error modal depending on the errorMessage state
  useEffect(() => {
    if (errorMessage && errorMessage.length >= 1) {
      onOpenError()
    }
  }, [errorMessage, onOpenError])

  // Triggered by editMode state
  useEffect(() => {
    if (editMode) {
      // Update newSkus with currentSkus and filter out skus that are not present in the renewal state
      const prepareNewSkus = (skus: Array<ISku>, renewalSkus: Array<ISku>) => {
        return skus.filter(({ sku_id }) => renewalSkus.some(item => item.sku_id === sku_id))
      }

      const updatedNewSkus = prepareNewSkus(props.skus, props.renewalStateSkus || [])
      setNewSkus(updatedNewSkus)
    } else {
      setNewSkus([])
    }
  }, [editMode, props.skus, props.renewalStateSkus])

  return (
    <Card className="w-full flex flex-col" radius={'none'} shadow={'none'}>

      {/* TOP BAR */}
      <CardHeader className="w-full flex justify-between items-center py-[10px] px-[22px] bg-[#52525B] border-default-700 border-1 text-white text-[14px]">
        <span>{props.baseSku}</span>
        {
          props.active ?
            !editMode ?
              <Button
                color="primary"
                size={'sm'}
                endContent={<FontAwesomeIcon icon={faPencil} size="lg" />}
                onClick={() => setEditMode(true)}
                aria-label="Editar SKU"
              >
                Editar SKU
              </Button>
              :
              <div className="flex justify-end gap-x-2">
                <Button
                  size={'sm'}
                  endContent={<FontAwesomeIcon icon={faRotateLeft} size="lg" />}
                  aria-label="Deshacer"
                  onClick={() => {
                    // setNewSkus(props.skus)
                    setNewAddonSkus([])
                    setEditMode(false)
                  }}
                >
                  Deshacer
                </Button>
                <Button
                  color="primary"
                  size={'sm'}
                  endContent={<FontAwesomeIcon icon={faFloppyDisk} size="lg" />}
                  onClick={handleUpdate}
                  aria-label="Actualizar"
                >
                  Actualizar
                </Button>
              </div>
            :
            null
        }

      </CardHeader>

      <Divider />

      <CardBody className={'px-[32px] py-[24px] flex flex-col'}>

        {/* CARD BODY TOP SECTION */}
        <div className="flex justify-between gap-x-[16px] flex-wrap">

          <div className="shrink">
            <span className={'leading-7 text-[#00336A] text-medium text-[20px]'}>{props.license_description}</span>
          </div>

          <div className="flex flex-col justify-end content-start md:items-center text-right gap-x-[16px] gap-y-[4px] md:flex-row">
            {/* SPACE QUOTA */}
            <div className="flex flex-wrap">
              <span className="text-sm leading-5 text-default-500">Space Quota:&nbsp;</span>
              <span className="text-sm leading-5 text-default-500 font-bold">{`${String((props.space_quota / (1000 * 1000 * 1000)).toFixed(2))} GB`}</span>
            </div>

            {/* EXPIRES */}
            <div className="flex  flex-wrap text-left">
              <span className="text-sm leading-5 text-default-500">Expira en:&nbsp;</span>
              <span className="text-sm leading-5 text-default-500 font-bold">{formattedEndDate}</span>
            </div>

            {/* AUTORENEWAL */}
            {
              !props.active ? <Chip radius={'sm'} size={'sm'} className={'bg-danger-100 text-danger-700 '}>Inactiva</Chip> : null
            }
            {
              props.auto_renew ? <Chip radius={'sm'} size={'sm'} className={'bg-primary-100 text-primary-700 '}>Autorenewal</Chip> : null
            }

            {/* PROVISIONED USERS */}
            <div className="flex gap-[8px]  flex-wrap">
              <FontAwesomeIcon icon={faUsers} size="xl" color="#D4D4D8" />
              <span className="text-xl leading-7 font-medium text-black">{String(props.num_licensed_users)}</span>
            </div>
          </div>

        </div>

        {/* CARD BODY BOTTOM SECTION */}
        {
          props.skus && props.skus.length >= 1 ?
            <LicensesTable
              skus={props.skus}
              renewalStateSkus={props.renewalStateSkus}
              newSkus={newSkus}
              setNewSkus={setNewSkus}
              editMode={editMode}
              modifyStatus={modifyStatus}
              setModifyStatus={setModifyStatus}
              teamEndDateTime={props.end_datetime}
              formattedEndDate={formattedEndDate}
              forceImmediate={forceImmediate}
              setForceImmediate={setForceImmediate}
              setNewAddonSkus={setNewAddonSkus}
              newAddonSkus={newAddonSkus}
            />
            :
            <p>Este cliente no cuenta con licencias.</p>
        }

      </CardBody>

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

    </Card>
  )
}