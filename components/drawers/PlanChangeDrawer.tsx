"use client"
import { useState, useEffect } from "react"
import {
  Drawer, DrawerContent, DrawerHeader, DrawerBody,
  DrawerFooter, Button, useDisclosure,
  Select, SelectItem
} from "@nextui-org/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHandshake } from "@fortawesome/free-solid-svg-icons"
import { commitmentTypesMapHF } from "@/utils/human-friendly/commitment-types"
import { ISkuInfo } from "@/types"
import { commitmentTypes } from "@/utils/commitmentTypes"
import { validateSKUTransition } from "@/utils/validators/sku/sku-transition-validator"

interface PlanChangeDrawerProps {
  teamId: string
  teamName: string
  currentSkuInfo: ISkuInfo
  num_licensed_users: number
  allSkus: Array<ISkuInfo>
}

const PlanChangeDrawer = ({ teamId, teamName, currentSkuInfo, num_licensed_users, allSkus }: PlanChangeDrawerProps) => {

  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [selectedCommitmentType, setSelectedCommitmentType] = useState("")
  const [availableSkus, setAvailableSkus] = useState()

  useEffect(() => {
    // First get skus from selected commitment type
    const skusOfThisCommitmentType = allSkus.filter(sku => sku.commitment_type === selectedCommitmentType)
    // console.log("skusOfThisCommitmentType: ", skusOfThisCommitmentType)
    // validateSKUTransition('TEAM-ST3L5TVD1Y', 'TEAM-BIZ3L1Y').then(result => console.log("test result: ", result))

    // Now, from skusOfThisCommitmentType filter in only the ones compatible with the current sku
    const compatibleSkusForTransition = skusOfThisCommitmentType.map((sku) => {
      validateSKUTransition(currentSkuInfo.sku_base, sku.sku_base).then(result => {
        if ( result.outcome !== "Not Allowed" ) {
          return sku
        }
        // console.log({
        //   currentSku: currentSkuInfo.sku_base,
        //   newSku: sku.sku_base,
        //   result: result,
        // })
      })
    })

    console.log("compatibleSkusForTransition: ", compatibleSkusForTransition)
  }, [allSkus, currentSkuInfo.sku_base, selectedCommitmentType])


  return (
    <>
      <Button
        color={'default'}
        size="sm"
        endContent={<FontAwesomeIcon icon={faHandshake} size="lg" />}
        onPress={onOpen}
        aria-label="Cambios de Plan"
        className="bg-content3-foreground text-white"
      >
        Cambios de Plan
      </Button>

      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >

        <DrawerContent className="rounded-none border-l-1 border-l-default-200 w-full max-w-lg p-8 flex flex-col gap-y-8">
          {
            (onClose) => (
              <>
                <DrawerHeader className="border-2 border-dashed border-blue-500 flex justify-center items-center p-0">
                  <span className="text-xl leading-7 font-medium text-[#00336A]">Cambios de Plan</span>
                </DrawerHeader>

                <DrawerBody className="border-2 border-dashed border-red-500 p-0 w-full gap-0">

                  {/* CURRENT PLAN INFO BOX */}
                  <div className="flex flex-col w-full gap-2 p-4">
                    <span className="text-tiny text-primary-500">{teamId}</span>
                    <span className="text-medium text-default-900">{teamName}</span>
                  </div>

                  {/* CURRENT LICENSE INFO */}
                  <div className="bg-default-100 rounded-md p-4 flex flex-col w-full gap-2">
                    <span className="text-medium text-default-500">Plan actual</span>
                    <span className="text-sm leading-5 font-medium text-default-foreground">{currentSkuInfo?.description}</span>
                    <span className="text-sm text-default-900">{commitmentTypesMapHF[currentSkuInfo?.commitment_type]}</span>

                    <div className="flex justify-between items-center w-full gap-1">
                      <span className="text-xs text-default-500">Total de licencias</span>
                      <span className="text-xs text-default-500">{String(num_licensed_users)}</span>
                    </div>
                  </div>

                  {/* NEW PLAN FORM */}
                  <div className="flex flex-col mt-6">
                    <span className="text-medium text-default-500">Selecciona nuevo plan</span>
                    <Select
                      isRequired
                      name={'commitment_type'}
                      label="SELECCIONA MODALIDAD DE COSTO Y PAGO"
                      // defaultSelectedKeys={["cat"]}
                      onChange={(event) => {
                        setSelectedCommitmentType(event.target.value)
                        // handleUpdateFields('sku_id', '')
                      }}
                      selectedKeys={[selectedCommitmentType]}
                      showScrollIndicators
                    >
                      {commitmentTypes.map((item) => (
                        <SelectItem key={item.value} className="text-black">
                          {item.description}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                </DrawerBody>

                <DrawerFooter className="border-2 border-dashed border-lime-500">
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancelar acción
                  </Button>
                </DrawerFooter>
              </>
            )
          }
        </DrawerContent>

      </Drawer>
    </>

  )

}

export default PlanChangeDrawer