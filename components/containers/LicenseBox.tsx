"use client"
import { ILicenseState, ISku, ISkuInfo } from "@/types"
import { Card, CardHeader, CardBody, Divider, Button, Spinner } from "@nextui-org/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencil, faUsers, faRotateLeft, faFloppyDisk, faHandshake, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import { Chip } from "@nextui-org/react"
import LicensesTable from "./LicensesTable"
import { Modal, ModalContent, ModalBody, useDisclosure, ModalHeader, ModalFooter } from "@nextui-org/react"
import { useState, useEffect } from "react"
import { modifyTeamSkus } from "@/app/team/actions"
import { commitmentTypesMapHF } from "@/utils/human-friendly/commitment-types"
import { differenceInDays } from "date-fns"
import PlanChangeDrawer from "../drawers/PlanChangeDrawer/PlanChangeDrawer"
import clsx from "clsx"
import { validateSKUTransition } from "@/utils/validators/sku/sku-transition-validator"
import { ITransitionOutcome } from "@/types"
import AutoRenewalSwitch from "../buttons/AutoRenewalSwitch"

/** TODO: Edit mode CHECK the license quantity of the license SKU, it is null, and updating it returns Conflict */

interface LicenseBoxProps {
  baseSku: string
  skuInfo: ISkuInfo | null
  license_description?: string | undefined
  skus: Array<ISku>
  renewalStateSkus?: Array<ISku>
  renewalSkuInfo?: ISkuInfo | null
  num_licensed_users: number
  space_quota: number
  auto_renew: boolean
  end_date: string
  end_datetime: string
  teamId: string
  teamName: string
  active: boolean
  resellerIds?: Array<string> | undefined
  remainingTime?: string
  currentState?: ILicenseState
  allSkus: Array<ISkuInfo>
}

export default function LicenseBox({ resellerIds = [], ...props }: LicenseBoxProps) {

  // Removes our partner ID from the array leaving only the sub-partner's ID.
  const subPartnerResellerId = resellerIds.filter(id => id !== process.env.NEXT_PUBLIC_DISTRIBUITOR_ID)

  const [editMode, setEditMode] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // LIFTED STATE from <LicensesTable>
  const [modifyStatus, setModifyStatus] = useState<"error" | "success" | "none">("none")

  // LIFTED STATE from <LicensesTable>
  // const [newSkus, setNewSkus] = useState(props.skus)
  const [newSkus, setNewSkus] = useState<Array<ISku>>(props.skus)

  // LIFTED STATE from <LicensesTable>
  const [forceImmediate, setForceImmediate] = useState(false)

  // LIFTED STATE from <LicensesTable>
  const [newAddonSkus, setNewAddonSkus] = useState<Array<ISku>>([])

  const [formattedEndDate, setFormattedEndDate] = useState("")

  // Validation result of the transition
  const [transitionValidationResult, setTransitionValidationResult] = useState<ITransitionOutcome>()

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { isOpen: isOpenError, onOpen: onOpenError, onOpenChange: onOpenChangeError, onClose: onCloseError } = useDisclosure();

  const handleUpdate = () => {
    onOpen()
    if (props.teamId && props.baseSku && props.skus && newSkus && subPartnerResellerId) {
      modifyTeamSkus(props.teamId, props.skus, newSkus, false, subPartnerResellerId)
        .then(data => {
          if (data.code !== 200) {
            setModifyStatus("error")
            setErrorMessage(data?.message || data.error || "Error desconocido")
            setNewSkus(props.skus)
            setNewAddonSkus([])
          } else {
            setModifyStatus("success")
            setNewSkus(newSkus)
            setNewAddonSkus([])
          }
        })
        .catch(error => {
          console.error(error)
          setModifyStatus("error")
          setErrorMessage(error)
          setNewSkus(props.skus)
          setNewAddonSkus([])
        })
        .finally(() => {
          onClose()
          setEditMode(false)
        })
    }
  }

  // Validate the transition
  useEffect(() => {
    const validateTransition = async () => {
      if (props.skus.length >= 1 && props.renewalStateSkus && props.renewalStateSkus?.length >= 1) {
        const outcome = await validateSKUTransition(props.skus[0].sku_id, props.renewalStateSkus?.[0].sku_id)
        setTransitionValidationResult(outcome)
      }
    }

    validateTransition()
  }, [props.skus, props.renewalStateSkus])

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
  // useEffect(() => {
  //   if (editMode) {
  //     // Update newSkus with currentSkus and filter out skus that are not present in the renewal state
  //     const prepareNewSkus = (skus: Array<ISku>, renewalSkus: Array<ISku>) => {
  //       return skus.filter(({ sku_id }) => renewalSkus.some(item => item.sku_id === sku_id))
  //     }

  //     const updatedNewSkus = prepareNewSkus(props.skus, props.renewalStateSkus || [])
  //     // console.log('updatedNewSkus: ', updatedNewSkus)
  //     setNewSkus(updatedNewSkus)
  //   } else {
  //     setNewSkus(props.skus)
  //   }
  // }, [editMode, props.skus, props.renewalStateSkus])

  // DEBUG: newSkus
  // useEffect(() => {
  //   console.log('newSkus: ', JSON.stringify(newSkus, null, 1))
  // }, [newSkus])

  return (
    <Card className="w-full flex flex-col" radius={'none'} shadow={'none'}>

      {/* TOP BAR */}
      <CardHeader
        className={clsx(
          `w-full flex justify-between items-center py-[10px] px-[22px] 
          border-1 text-white text-[14px]`,
          props.currentState?.is_trial ?
            'bg-primary-600 border-primary-700'
            :
            'bg-[#52525B] border-default-700 '
        )}
      >

        <div className="flex gap-4 items-center">
          { // TRIAL indicator chip
            props.currentState?.is_trial ?
              <Chip radius="sm" className="bg-secondary-100 text-secondary-600 text-xs">
                TRIAL
              </Chip>
              :
              null
          }
          <span className="text-xl leading-7 font-medium text-white">{props.skuInfo?.description}</span>
          {
            props.skuInfo ?
              <span className="text-xs leading-4 font-normal text-white pt-2">{commitmentTypesMapHF[props.skuInfo?.commitment_type]}</span>
              :
              <span></span>
          }
        </div>
        <div className="flex justify-end gap-x-2">
          {
            props.skuInfo && !props.currentState?.is_trial ?
              <PlanChangeDrawer
                teamId={props.teamId}
                teamName={props.teamName}
                currentSkuInfo={props.skuInfo}
                num_licensed_users={props.num_licensed_users}
                allSkus={props.allSkus}
                end_date={props.end_date}
                license_description={props.license_description ?? 'SKU sin información'}
                current_skus={props.skus}
                resellerIds={subPartnerResellerId}
              />
              :
              null
          }

          {
            // Can't edit ENTERPRISE type SKUs for now
            !props.baseSku.startsWith('ENT-') && props.active ?
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
                      setNewSkus(props.skus)
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
        </div>

      </CardHeader>

      <Divider />

      <CardBody className={'px-[32px] py-[24px] flex flex-col'}>

        {/* CARD BODY TOP SECTION */}
        <div className="flex flex-col gap-x-[16px] gap-y-2 lg:flex-row justify-between">

          <div className="flex flex-col lg:flex-row content-start gap-x-[16px] gap-y-[4px]">
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
              !props.active ?
                <Chip radius={'sm'} size={'sm'} className={'bg-danger-100 text-danger-700 '}>Inactiva</Chip>
              :
                null
            }
            {
              props.auto_renew ?
                <span className="text-sm leading-5 text-default-500 flex items-center">
                  Renovación:
                  <Chip radius={'sm'} size={'sm'} className={'bg-primary-100 text-primary-700 ml-4'}>AUTO</Chip>
                </span>

                :
                <span className="text-sm leading-5 text-default-500 flex items-center">
                  Renovación:
                  <Chip radius={'sm'} size={'sm'} className={'bg-default-100 text-default-700 ml-4'}>MANUAL</Chip>
                </span>
            }


          </div>

          {/* PROVISIONED USERS */}
          <div className="flex flex-col lg:flex-row gap-[12px] lg:justify-end lg:items-center w-full lg:w-1/2">
            {
              props.renewalSkuInfo && (props.renewalStateSkus?.[0].sku_id !== props.skus[0].sku_id) && transitionValidationResult ?
                <div
                  className={'bg-warning-100 py-1 px-3 max-w-fit min-w-72 rounded-md w-full'}
                >
                  {/* Truncate this span to fit the chip */}
                  <div className="text-sm text-[#11181C] truncate whitespace-nowrap overflow-hidden min-w-72">{`${transitionValidationResult.type} a ${props.renewalSkuInfo?.description} programado en ${props.remainingTime}`}
                    <FontAwesomeIcon icon={faTriangleExclamation} className="text-warning-500 ml-2" />
                  </div>

                </div>
                :
                null
            }

            {// Show the renovation warning only when the remaining days are equal or less than 15.
              differenceInDays(new Date(props.end_datetime), new Date()) >= 0 && differenceInDays(new Date(props.end_datetime), new Date()) <= 15 ?
                <Chip
                  radius={'sm'}
                  className={'bg-warning-100 py-4'}
                >
                  <span className="text-sm text-[#11181C]">{`Renovación programada en ${props.remainingTime}`}</span>
                  <FontAwesomeIcon icon={faTriangleExclamation} className="text-warning-500 ml-2" />
                </Chip>
                :
                null
            }

            <div className="flex gap-4 items-center">
              <FontAwesomeIcon icon={faUsers} size="xl" color="#D4D4D8" />
              <span className="text-xl leading-7 font-medium text-black">{String(props.num_licensed_users)}</span>
            </div>
          </div>

        </div>

        {
          // If there is a plan change schedule, show this warning in Edit Mode
          editMode && props.renewalSkuInfo && (props.renewalStateSkus?.[0].sku_id !== props.skus[0].sku_id) && transitionValidationResult ?
            <div
              className={'bg-warning-100 py-1 px-3 min-w-72 rounded-md w-full mt-4'}
            >
              {/* Truncate this span to fit the chip */}
              <div className="text-sm text-[#11181C] min-w-72 flex">
                <FontAwesomeIcon icon={faTriangleExclamation} className="text-warning-500 mr-2" />
                <div className="flex flex-col gap-y-2">
                  <span><strong> Advertencia:</strong> Hay un <strong>{transitionValidationResult.type}</strong> de plan programado para ésta cuenta. Si realizas un cambio y presionas <strong> Actualizar <FontAwesomeIcon icon={faFloppyDisk} size="lg" /></strong>, el {transitionValidationResult.type} programado se <strong>cancelará.</strong> </span>
                  <span>Si requires hacer un upsale o downsale, puedes hacerlo pero deberás volver a programar el cambio de plan.</span>
                </div>
              </div>

            </div>
            :
            null
        }
        {/* AUTO-RENEW TOGGLE SWITCH */}
        <AutoRenewalSwitch
          className="mt-4 max-w-sm justify-between"
          autoRenewal={props.auto_renew}
          skus={props.skus}
          teamId={props.teamId}
          resellerIds={subPartnerResellerId}
        />

        {/* CARD BODY BOTTOM SECTION */}
        {
          props.skus && props.skus.length >= 1 && newSkus && newSkus.length >= 1 ?
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