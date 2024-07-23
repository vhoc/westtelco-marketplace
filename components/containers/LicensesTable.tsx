// @ts-nocheck
"use client"
import { useState, useEffect, Dispatch, SetStateAction } from "react"
import { ISku, ISkuInfo } from "@/types"
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Chip, Input, Button, Checkbox } from "@nextui-org/react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react"
import { filterLicenseType, getSkuInfo, validateAddonSku } from "@/utils/licenses-client"
import { isInGracePeriod } from "@/utils/team-client"
import { doesAddonSkuExist } from "@/utils/licenses-client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlusCircle, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons"
import { AddonsTable } from "./AddonsTable"

interface LicensesTableProps {
  skus: Array<ISku>
  renewalStateSkus?: Array<ISku> | undefined
  // initialSkus: Array<ISku>
  // setInicialSkus: Dispatch<SetStateAction<ISku[]>>
  newSkus: Array<ISku> | undefined// LIFTED
  setNewSkus: Dispatch<SetStateAction<ISku[] | undefined>>// LIFTED
  editMode: boolean
  modifyStatus: "success" | "error" | "none"// LIFTED
  setModifyStatus: Dispatch<SetStateAction<"success" | "error" | "none">>// LIFTED
  forceImmediate: boolean// LIFTED
  setForceImmediate: Dispatch<SetStateAction<boolean>>// LIFTED
  teamEndDateTime: string
  formattedEndDate: string
}

export default function LicensesTable(props: LicensesTableProps) {

  const [regularSkus, setRegularSkus] = useState<Array<ISku> | null>(null)
  const [addonSkus, setAddonSkus] = useState<Array<ISku> | null>(null)
  const [newAddonSkus, setNewAddonSkus] = useState<Array<ISku>>([])

  const [gracePeriodStatus, setGracePeriodStatus] = useState(false)
  const [newSkuToAdd, setNewSkuToAdd] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isAddSkuButtonDisabled, setIsAddSkuButtonDisabled] = useState(false)
  const [baseSkuInfo, setBaseSkuInfo] = useState<ISkuInfo | null>(null)

  // Modal control
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const tableClassNames = {
    th: ["rounded-none", "border-none"],
    tr: [
      "rounded-none",
      "first:border-none"
    ],
    td: [
      "group-data-[first=true]:first:before:rounded-none",
      "group-data-[first=true]:last:before:rounded-none",
      // middle
      "group-data-[middle=true]:before:rounded-none",
      // last
      "group-data-[last=true]:first:before:rounded-none",
      "group-data-[last=true]:last:before:rounded-none",
      "border-b-default-200",
      "border-b-1",
    ],
  }

  const handleRemoveAddon = (skuId: string) => {
    props.setNewSkus((prevNewSkus) => (
      prevNewSkus?.filter(item => item.sku_id !== skuId)
    ))
  }

  const handleAddAddon = async (skuId: string, quantity: number) => {
    setIsAddSkuButtonDisabled(true)
    try {
      const validateAddonResponse = await validateAddonSku(baseSkuInfo?.sku_base, skuId, props.skus)
      if (validateAddonResponse.status !== "success") {
        setErrorMessage(validateAddonResponse.message)
        return
      }
      // Check if the Addon SKU exists in the database.
      const addonSkuResponse = await doesAddonSkuExist(skuId)
      if (addonSkuResponse.code !== 200) {
        setErrorMessage(addonSkuResponse.message)
        return
      }

      // Check if the entered SKU is already present in newSkus (prevent duplication).
      const isSkuDuplicate = props.newSkus?.find(item => item.sku_id === skuId)
      if (isSkuDuplicate) {
        setErrorMessage("El SKU que estás intentando agregar ya está seleccionado. Si deseas aplicar los cambios, presiona el botón 'Actualizar'.")
        return
      }

      // Add entered addon sku to the newSkus to be sent to Dropbox
      setNewAddonSkus((prevNewSkus) => (
        // Quantity needs to be the total users count, including the base SKU's 3 licensed users.
        [...prevNewSkus, { sku_id: skuId, quantity: quantity + 3 }]
      ))

      // Reset the SKU input field
      setNewSkuToAdd("");

    } catch (error) {
      setErrorMessage("Un error desconocido ha ocurrido. Por favor, intenta de nuevo.")
      console.error(error);
    } finally {
      setIsAddSkuButtonDisabled(false)
      setNewSkuToAdd("");
    }
  }

  const handleAddLicenseSku = async (skuId: string, quantity: number) => {
    console.log(`skuId: `, skuId)
    setIsAddSkuButtonDisabled(true)
    try {
      const skuInfo = await getSkuInfo(skuId)
      console.log(`skuInfo: `, skuInfo)
      if (skuInfo && skuInfo.data) {
        props.setNewSkus((prevNewSkus) => (
          [...prevNewSkus, { sku_id: skuInfo.data.sku_license, quantity: quantity }]
        ))
      }
    } catch (error) {

    } finally {
      setIsAddSkuButtonDisabled(false)
    }
  }

  // Initially, gets the current baseSku info:
  useEffect(() => {
    if (props.skus && props.skus.length >= 1) {
      const baseSku = props.skus.filter(item => item.sku_id.startsWith('TEAM-'))
      if (baseSku) {
        getSkuInfo(baseSku[0].sku_id).then(data => {
          if (data.data) {
            setBaseSkuInfo(data.data)
          }
        })
      }
    }
  }, [props.skus])

  // Handles the regular skus and the addons skus to place them separately in the table
  useEffect(() => {
    if (props.skus && props.skus.length >= 1) {
      const regular = filterLicenseType(props.skus, "regular")
      // If editMode is TRUE, show newSkus in the addons table, instead of the current Skus.
      // const addons = props.editMode ? filterLicenseType(props.newSkus, "addon") : filterLicenseType(props.skus, "addon")
      const addons = filterLicenseType(props.skus, "addon")

      setRegularSkus(regular)
      setAddonSkus(addons)
    }
  }, [props.skus, props.newSkus, props.editMode])

  // Updates the grade period status of the team
  useEffect(() => {
    const newStatus = isInGracePeriod(new Date(), new Date(props.teamEndDateTime)) // TRUE OR FALSE: Is current date in the 14 day grace period after teamEndDate?
    setGracePeriodStatus(newStatus)
  }, [props.teamEndDateTime])

  // Controls the error modal depending on the errorMessage state
  useEffect(() => {
    if (errorMessage && errorMessage.length >= 1) {
      onOpen()
    }
  }, [errorMessage, onOpen])

  // TEST
  useEffect(() => {
    console.log(`newSkus: `, props.newSkus)
  }, [props.newSkus])

  useEffect(() => {
    console.log(`newAddonSkus: `, newAddonSkus)
  }, [newAddonSkus])

  return (
    <div className="flex flex-col w-full">

      {/* REGULAR SKUS TABLE */}
      {
        props.newSkus && props.newSkus.length >= 1 && regularSkus && regularSkus.length >= 1 ?
          <Table isStriped radius="none" shadow="none" classNames={tableClassNames} aria-label="Tabla de SKUs">

            <TableHeader className="bg-white">
              <TableColumn className="bg-white">SKU</TableColumn>
              <TableColumn className="bg-white">LICENCIAS</TableColumn>
            </TableHeader>

            <TableBody>
              {
                regularSkus.map((sku, index) => {

                  const currentSkuRenewalState = props.renewalStateSkus.find(item => item.sku_id === sku.sku_id)
                  const currentSku = props.skus.find(item => item.sku_id === sku.sku_id)
                  const currentNewSku = props.newSkus.find(item => item.sku_id === sku.sku_id)

                  return (
                    <TableRow key={index} >
                      <TableCell className={'w-1/2'}>{sku.sku_id}{sku.sku_id.startsWith('TEAM-') || sku.sku_id.startsWith('EDU-') ? <Chip radius={'sm'} size={'sm'} className="ml-4 bg-default-100 text-default-700 text-tiny">BASE</Chip> : null}</TableCell>
                      <TableCell className={'w-1/2'}>
                        {
                          !props.editMode || sku.sku_id.startsWith('TEAM-') || sku.sku_id.startsWith('EDU-') ?
                            <span>
                              {
                                // If the modification is a decrease, show the currentSku's quantity, otherwise show the newSku's quantity
                                // This is because downsales don't take effect immediately for current licenses, it only alters the number of licenses to be renewed.

                                // New quantity is higher than current quantity? (UPSALE)
                                (currentNewSku?.quantity > currentSku?.quantity) ?
                                  <span>{currentNewSku?.quantity}</span>// SHOW NEW QUANTITY
                                  :
                                  // New quantity is lower than current quantity? (DOWNSALE)
                                  // Is the team_end_date lower than current date? (MANDATORY PERIOD COMPLETED)
                                  new Date(props.teamEndDateTime) < new Date() ?
                                    <span>{currentNewSku?.quantity}</span>// SHOW NEW QUANTITY
                                    :
                                    // Is the team_end_date higher than current date? (MANDATORY PERIOD NOT COMPLETED)
                                    <span>{currentSku?.quantity}</span>// KEEP SHOWING CURRENT QUANTITY
                              }
                              {
                                // If a modification to the licenses has been made and the SKU id starts with TEAMLIC- OR EDULIC-,
                                // ==OR== if the number of licenses to be renewed is lower than the licenses currently active, show the Chip with the message
                                (props.modifyStatus === "success" || currentSkuRenewalState?.quantity < currentSku?.quantity) && (sku.sku_id.startsWith('TEAMLIC-') || sku.sku_id.startsWith('EDULIC-') && (!sku.sku_id.startsWith('TEAMADD-') || !sku.sku_id.startsWith('EDUADD-'))) ?
                                  <Chip radius={'full'} size={'sm'} className="ml-4 bg-primary-200 text-black text-tiny">
                                    {
                                      // (currentSku?.quantity <= currentNewSku?.quantity) && currentSkuRenewalState?.quantity > currentSku?.quantity ?
                                      (currentSku?.quantity <= currentNewSku?.quantity) && currentSkuRenewalState?.quantity >= currentSku?.quantity ?
                                        `Número de licencias incrementado a ${currentNewSku?.quantity}`
                                        :
                                        `Cambio programado a ${props.modifyStatus === "success" ? currentNewSku?.quantity : currentSkuRenewalState?.quantity} licencias en ${props.formattedEndDate}`
                                    }
                                  </Chip>
                                  :
                                  null
                              }
                            </span>
                            :
                            <div className="flex gap-8 items-center">
                              <Input
                                type="number"
                                variant="bordered"
                                value={props.newSkus.find(item => item.sku_id === sku.sku_id)?.quantity}
                                aria-label="Cantidad"
                                onChange={(event) => {
                                  const thisSku = props.newSkus.find(item => item.sku_id === sku.sku_id)
                                  props.setNewSkus((prevSkus) =>
                                    prevSkus.map(sku =>
                                      // sku.sku_id === thisSku?.sku_id ? { ...sku, quantity: thisSku?.sku_id.startsWith("TEAM-") || thisSku?.sku_id.startsWith("EDU-") ? 1 : Number(event.target.value) } : sku
                                      ({ ...sku, quantity: sku.sku_id.startsWith("TEAM-") || sku.sku_id.startsWith("EDU-") ? 1 : Number(event.target.value) })
                                      // thisSku?.sku_id.startsWith("EDU-") || thisSku?.sku_id.startsWith("TEAM-") ? sku : { ...sku, quantity: Number(event.target.value) }
                                      // ({ ...sku, quantity: Number(event.target.value) })
                                      //TODO: When there are addons, we need to automatically change the addons quantities to match the new quantity.
                                    ))

                                }}
                                className="max-w-24"
                                size={'lg'}
                              />
                              <span className="text-[14px] text-default-500">{`Aumenta o reduce el número actual de licencias (${props.newSkus.find(item => item.sku_id === sku.sku_id)?.quantity})`}</span>
                            </div>

                        }
                      </TableCell>
                    </TableRow>
                  )
                })
              }

              {
                /**
                 * Show "Agregar License SKU" button when:
                 * - No SKU that starts with 'TEAMLIC-' (License SKU) already exists in the current skus.
                 * - No License SKU already exists in the newSkus (SKUs to be added) array.
                 * - This component is in EDIT mode.
                 */
                !regularSkus?.some(item => item.sku_id.startsWith('TEAMLIC-')) && !props.newSkus?.some(item => item.sku_id === baseSkuInfo?.sku_license) && props.editMode ?
                  <TableRow key={'new-license-sku-row'}>
                    <TableCell>
                      <Button
                        color="primary"
                        size={'sm'}
                        endContent={<FontAwesomeIcon icon={faPlusCircle} size="lg" />}
                        aria-label="Agregar License SKU"
                        isLoading={isAddSkuButtonDisabled}
                        isDisabled={isAddSkuButtonDisabled}
                        onPress={() => handleAddLicenseSku(baseSkuInfo?.sku_base, 1)}
                      >
                        Agregar License SKU
                      </Button>
                    </TableCell>
                    <TableCell>

                    </TableCell>
                  </TableRow>
                  :
                  baseSkuInfo && baseSkuInfo.sku_base && !props.skus.some(item => item.sku_id.startsWith('TEAMLIC-')) && props.newSkus && props.newSkus.some(item => item.sku_id.startsWith('TEAMLIC-')) && props.editMode ?
                    <TableRow key={'new-license-sku-row'}>
                      <TableCell>
                        {props.newSkus.find(item => item.sku_id.startsWith('TEAMLIC-')).sku_id}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-8 items-center">
                          <Input
                            type="number"
                            variant="bordered"
                            value={props.newSkus.find(item => item.sku_id === baseSkuInfo.sku_license)?.quantity}
                            aria-label="Cantidad"
                            onChange={(event) => {

                              if (props.newSkus && props.newSkus.length >= 1) {
                                // const thisSku = props.newSkus.find(item => item.sku_id === sku.sku_id)
                                props.setNewSkus((prevSkus) =>
                                  prevSkus.map(sku =>
                                    ({ ...sku, quantity: sku.sku_id.startsWith("TEAM-") || sku.sku_id.startsWith("EDU-") ? 1 : Number(event.target.value) })
                                  ))
                              }


                            }}
                            className="max-w-24"
                            size={'lg'}
                          />
                          <span className="text-[14px] text-default-500">{`Aumenta o reduce el número actual de licencias (${props.newSkus.find(item => item.sku_id === baseSkuInfo.sku_base)?.quantity})`}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                    :
                    null
              }

              {
                gracePeriodStatus && props.editMode ?
                  <TableRow>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell>
                      <Checkbox
                        aria-label="Forzar cambio inmediato"
                        isSelected={props.forceImmediate}
                        // PENDING TO IMPLEMENT IN THE API CALL
                        onValueChange={(isSelected: boolean) => props.setForceImmediate(isSelected)}
                      >
                        Forzar cambio inmediato
                      </Checkbox>
                    </TableCell>
                  </TableRow>
                  :
                  null
              }

            </TableBody>

          </Table>
          :
          null
      }

      {/* ADDONS SKUS TABLE */}
      {/* <AddonsTable
        currentAddonSkus={addonSkus}
        editMode={props.editMode}
        skus={props.skus}
        newSkus={props.newSkus}
        setNewSkus={props.setNewSkus}
        renewalStateSkus={props.renewalStateSkus}
        formattedEndDate={props.formattedEndDate}
      /> */}
      <Table isStriped radius="none" shadow="none" classNames={tableClassNames} aria-label="Addon SKUs table">

        <TableHeader className="bg-white">
          <TableColumn className="bg-white">ADD-ONS</TableColumn>
          <TableColumn className="bg-white">LICENCIAS</TableColumn>
          <TableColumn className="bg-white">&nbsp;</TableColumn>
        </TableHeader>


        <TableBody>
          {
            props.editMode ?
              <TableRow key="add-new-addon-row">
                <TableCell>
                  <div className="flex gap-x-4 pb-4">
                    <Input
                      type="text"
                      placeholder="Introduce Add-on SKU para añadir"
                      className="max-w-[370px] rounded-sm"
                      aria-label="New SKU"
                      value={newSkuToAdd}
                      onValueChange={setNewSkuToAdd}
                    />
                    <Button
                      color="primary"
                      className={'rounded-md'}
                      aria-label="Añadir"
                      isLoading={isAddSkuButtonDisabled}
                      isDisabled={isAddSkuButtonDisabled || !newSkuToAdd || newSkuToAdd.length < 1}
                      // Add addon with the sku specified in the above input, and the quantity taken from the TEAMLIC- or EDULIC- SKU's quantity for it to be equal to the new quanitity to be requested. If only a Base SKU exists, set quantity to 1.
                      onPress={() => handleAddAddon(newSkuToAdd, props.newSkus?.find(item => item.sku_id.startsWith("TEAMLIC-"))?.quantity || props.newSkus?.find(item => item.sku_id.startsWith("EDULIC-"))?.quantity || 0)}
                    >
                      Añadir
                    </Button>
                  </div>
                </TableCell>
                <TableCell>&nbsp;</TableCell>
                <TableCell>&nbsp;</TableCell>
              </TableRow>
            :
              null
          }


          {
            addonSkus && addonSkus.length >= 1 ?
              addonSkus.map((sku, index) => {
                return (
                  <TableRow key={`currentAddons-${index}`}>
                    <TableCell className={'w-1/2'}>
                      <span>{sku.sku_id}</span>
                    </TableCell>
                    <TableCell>
                      <span>{sku.quantity}</span>
                      {
                        // If the current SKU is not found in renewalStateSkus, tag it with a Chip.
                        !props.renewalStateSkus?.find(item => item.sku_id === sku.sku_id) ?

                          <Chip radius={'full'} size={'sm'} className="ml-4 bg-primary-200 text-black text-tiny">
                            {/* If the current SKU is neither found in newSkus, show a "to be added" message. */}
                            {
                              // checar si esta en current skus, mostrar eliminacion programada, si no, mostrar para agregar.
                              props.skus.some(item => item.sku_id === sku.sku_id) ?
                                `Eliminación programada para ${props.formattedEndDate}`
                                :
                                `Seleccionado para agregar`
                              // !props.newSkus?.find(item => item.sku_id === sku.sku_id) ?
                              //   `Eliminación programada para ${props.formattedEndDate}`
                              //   :
                              //   `Seleccionado para agregar`
                            }
                            {
                              // console.log(`currentAddonSku: `, sku)
                              // !props.renewalStateSkus.some(item => item.sku_id )
                            }
                          </Chip>
                          :
                          !props.newSkus?.find(item => item.sku_id === sku.sku_id) && props.editMode ?
                            <Chip color="warning" radius={'full'} size={'sm'} className="ml-4 text-black text-tiny">
                              {`Seleccionado para eliminación`}
                            </Chip>
                            :
                            null
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      {
                        // Show delete button only when we are in Edit Mode and if the SKU is not deleted.
                        props.editMode && props.renewalStateSkus?.find(item => item.sku_id === sku.sku_id) ?
                          <Button
                            color={'danger'}
                            aria-label="Eliminar"
                            variant={'faded'}
                            size={'sm'}
                            className={'bg-white'}
                            onPress={() => handleRemoveAddon(sku.sku_id)}
                          >
                            Eliminar
                          </Button>
                          :
                          <span>&nbsp;</span>
                      }
                    </TableCell>
                  </TableRow>
                )
              })
              :
              null
          }
          {
            newAddonSkus && newAddonSkus.length >= 1 ?
              newAddonSkus.map((sku, index) => {
                return (
                  <TableRow key={`newAddons-${index}`}>
                    <TableCell className={'w-1/2'}>
                      <span>{sku.sku_id}</span>
                    </TableCell>
                    <TableCell>
                      <span>{sku.quantity}</span>
                      {
                        // If the current SKU is not found in renewalStateSkus, tag it with a Chip.
                        !props.renewalStateSkus?.find(item => item.sku_id === sku.sku_id) ?

                          <Chip radius={'full'} size={'sm'} className="ml-4 bg-primary-200 text-black text-tiny">
                            {/* If the current SKU is neither found in newSkus, show a "to be added" message. */}
                            {
                              // checar si esta en current skus, mostrar eliminacion programada, si no, mostrar para agregar.
                              props.skus.some(item => item.sku_id === sku.sku_id) ?
                                `Eliminación programada para ${props.formattedEndDate}`
                                :
                                `Seleccionado para agregar`
                              // !props.newSkus?.find(item => item.sku_id === sku.sku_id) ?
                              //   `Eliminación programada para ${props.formattedEndDate}`
                              //   :
                              //   `Seleccionado para agregar`
                            }
                            {
                              console.log(`currentAddonSku: `, sku)
                              // !props.renewalStateSkus.some(item => item.sku_id )
                            }
                          </Chip>
                          :
                          !props.newSkus?.find(item => item.sku_id === sku.sku_id) && props.editMode ?
                            <Chip color="warning" radius={'full'} size={'sm'} className="ml-4 text-black text-tiny">
                              {`Seleccionado para eliminación`}
                            </Chip>
                            :
                            null
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      {
                        // Show delete button only when we are in Edit Mode and if the SKU is not deleted.
                        props.editMode && props.renewalStateSkus?.find(item => item.sku_id === sku.sku_id) ?
                          <Button
                            color={'danger'}
                            aria-label="Eliminar"
                            variant={'faded'}
                            size={'sm'}
                            className={'bg-white'}
                            onPress={() => handleRemoveAddon(sku.sku_id)}
                          >
                            Eliminar
                          </Button>
                          :
                          <span>&nbsp;</span>
                      }
                    </TableCell>
                  </TableRow>
                )
              })
              :
              null
          }
        </TableBody>


      </Table>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={() => {
          setErrorMessage("")
        }}
        backdrop={'blur'}
        shouldBlockScroll
      >
        <ModalContent>
          <ModalHeader className="flex gap-2 text-black items-center">
            <FontAwesomeIcon icon={faExclamationTriangle} size={'lg'} color={'#ffba00'} />
            ERROR
          </ModalHeader>
          <ModalBody className={'text-black'}>
            {errorMessage}
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onPress={() => {
                setErrorMessage("")
                onClose()
              }}
              aria-label="Cerrar mensaje de error"
            >
              Aceptar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )

}