"use client"
import { Dispatch, SetStateAction, useState } from "react"
import { ISku, ISkuInfo } from "@/types"
import { Button, Chip, Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"
import { doesAddonSkuExist, validateAddonSku } from "@/utils/licenses-client"

interface AddonsTableProps {
  currentAddonSkus: Array<ISku>
  editMode: boolean
  skus: Array<ISku>
  newSkus: Array<ISku> | undefined// LIFTED
  setNewSkus: Dispatch<SetStateAction<ISku[] | undefined>>// LIFTED
  formattedEndDate: string
  renewalStateSkus?: Array<ISku> | undefined
}

export const AddonsTable = (props: AddonsTableProps) => {

  const [newSkuToAdd, setNewSkuToAdd] = useState("")
  const [isAddSkuButtonDisabled, setIsAddSkuButtonDisabled] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [baseSkuInfo, setBaseSkuInfo] = useState<ISkuInfo | null>(null)

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

  const handleAddAddon = async (skuId: string, quantity: number) => {
    if (baseSkuInfo && baseSkuInfo.sku_base) {
      setIsAddSkuButtonDisabled(true)
      try {
        const validateAddonResponse = await validateAddonSku(baseSkuInfo.sku_base, skuId, props.skus)
        if (validateAddonResponse.status !== "success") {
          setErrorMessage(validateAddonResponse.message || "Error")
          return
        }
        // Check if the Addon SKU exists in the database.
        const addonSkuResponse = await doesAddonSkuExist(skuId)
        if (addonSkuResponse.code !== 200) {
          setErrorMessage(addonSkuResponse.message || "Error")
          return
        }

        // Check if the entered SKU is already present in newSkus (prevent duplication).
        const isSkuDuplicate = props.newSkus?.find(item => item.sku_id === skuId)
        if (isSkuDuplicate) {
          setErrorMessage("El SKU que estás intentando agregar ya está seleccionado. Si deseas aplicar los cambios, presiona el botón 'Actualizar'.")
          return
        }

        // Add entered addon sku to the newSkus to be sent to Dropbox
        props.setNewSkus((prevNewSkus: any) => (
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

  }

  const handleRemoveAddon = (skuId: string) => {
    props.setNewSkus((prevNewSkus) => (
      prevNewSkus.filter(item => item.sku_id !== skuId)
    ))
  }

  return (
    <Table isStriped radius="none" shadow="none" classNames={tableClassNames} aria-label="Addon SKUs table">

      <TableHeader className="bg-white">
        <TableColumn className="bg-white">ADD-ONS</TableColumn>
        <TableColumn className="bg-white">LICENCIAS</TableColumn>
        <TableColumn className="bg-white">&nbsp;</TableColumn>
      </TableHeader>


      <TableBody>
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
        
        {
          props.currentAddonSkus && props.currentAddonSkus.length >= 1 ?
            props.currentAddonSkus.map((sku, index) => {
              return (
                <TableRow key={index}>
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
            <TableRow key={'none'}>
              <TableCell className={'w-1/2'}></TableCell>
              <TableCell className={'w-1/2'}></TableCell>
            </TableRow>
        }
      </TableBody>


    </Table>
  )

}