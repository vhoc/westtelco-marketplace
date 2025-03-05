"use client"
import { useState, useEffect } from "react"
import {
  Drawer, DrawerContent, DrawerHeader, DrawerBody,
  DrawerFooter, Button, useDisclosure,
  Select, SelectItem, Skeleton, Radio, RadioGroup
} from "@nextui-org/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHandshake, faUserSlash } from "@fortawesome/free-solid-svg-icons"
import { commitmentTypesMapHF } from "@/utils/human-friendly/commitment-types"
import { ISkuInfo, ISku } from "@/types"
import { commitmentTypes } from "@/utils/commitmentTypes"
import useCompatibleSkus from "@/utils/hooks/useCompatibleSkus"
import useAvailableSkus from "@/utils/hooks/useAvailableSkus"
import ConfirmationBox from "./ConfirmationBox"
import { getSkuInfo } from "@/utils/licenses-client"
import Toast from "@/components/feedback/Toast"
import ReinstateConfirmationBox from "./ReinstateConfirmationBox"

interface PlanChangeDrawerProps {
  teamId: string
  teamName: string
  end_date: string
  currentSkuInfo: ISkuInfo
  num_licensed_users: number
  allSkus: Array<ISkuInfo>
  license_description: string
  current_skus: Array<ISku>
  resellerIds: Array<string>
  isReinstatement?: boolean
}

const PlanChangeDrawer = ({ teamId, teamName, end_date, currentSkuInfo, num_licensed_users, allSkus, license_description, current_skus, resellerIds, isReinstatement = false }: PlanChangeDrawerProps) => {

  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [selectedCommitmentType, setSelectedCommitmentType] = useState("")
  const [selectedBaseSku, setSelectedBaseSku] = useState(current_skus[0]?.sku_id)
  const [selectedBaseSkuDescription, setSelectedBaseSkuDescription] = useState("")
  const { compatibleSkus, isLoading: loadingCompatibleSkus } = useCompatibleSkus(allSkus, currentSkuInfo.sku_base, selectedCommitmentType)
  const { availableSkus, isLoading: loadingAvailableSkus } = useAvailableSkus(allSkus, selectedCommitmentType)
  const [newSkus, setNewSkus] = useState<Array<ISku>>(current_skus)
  const [withPlanChange, setWithPlanChange] = useState<"change" | "no-change">("no-change")

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // DEBUG
  // useEffect(() => {
  //   console.log(`availableSkus: `, availableSkus)
  // }, [availableSkus])

  /**
   * Update the newSkus array with the selectedBaseSku   * 
   */
  useEffect(() => {
    // Get the selectedBaseSku's License SKU:
    getSkuInfo(selectedBaseSku).then(data => {
      if (data?.code === 200 && data.data?.sku_license) {

        setNewSkus(prevState =>
          prevState.map((item, index) =>
            index === 0 // Substitute the first sku_id which is the BASE SKU
              ? { ...item, sku_id: selectedBaseSku }
              : index === 1 && data.data?.sku_license // Substitute the second sku_id which is the LICENSE SKU
                ? { ...item, sku_id: data.data.sku_license }
                : item // Leave the rest as they are
          )
        );
      }
    })

  }, [selectedBaseSku])

  /** Reset selectedCommitmentType, selectedBaseSku, and selectedBaseSkuDescription to their original state if the user selects "no-change" in withPlanChange  */
  useEffect(() => {
    if (withPlanChange === "no-change") {
      setSelectedBaseSku(current_skus[0]?.sku_id);
      setSelectedCommitmentType("");
      setSelectedBaseSkuDescription("");
    }
  }, [current_skus, withPlanChange])


  return (
    <>
      <Button
        color={isReinstatement ? 'success' : 'default'}
        variant={isReinstatement ? 'ghost' : 'solid'}
        size="sm"
        endContent={isReinstatement ? <FontAwesomeIcon icon={faUserSlash} size="lg" aria-label="Suspender cliente" className={"text-[#00dc6c] group-hover:text-white"} /> : <FontAwesomeIcon icon={faHandshake} size="lg" />}
        onPress={onOpen}
        aria-label={isReinstatement ? "Reinstaurar" : "Cambios de Plan"}
        className={isReinstatement ? "group text-[#00dc6c] group-hover:text-white" : "bg-content3-foreground text-white"}
      >
        {
          isReinstatement ?
            <span className="text-[#00dc6c] group-hover:text-white">Reinstaurar cliente</span>
            :
            <span>Cambios de Plan</span>
        }
      </Button>

      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >

        <DrawerContent className="rounded-none border-l-1 border-l-default-200 w-full max-w-lg p-8 flex flex-col gap-y-8">
          {
            (onClose) => (
              <>
                <DrawerHeader className="flex justify-center items-center p-0">
                  <span className="text-xl leading-7 font-medium text-[#00336A]">
                    {
                      isReinstatement ?
                        "Reinstaurar cliente"
                        :
                        "Cambios de Plan"
                    }
                  </span>
                </DrawerHeader>

                <DrawerBody className="p-0 w-full gap-2 flex flex-col justify-between">

                  {/* TOP SECTION */}
                  <div>

                    {/* ERROR/SUCCESS MESSAGES */}
                    {
                      errorMessage || successMessage ?
                        <Toast
                          type={errorMessage ? 'error' : 'success'}
                        >
                          <span className="text-sm leading-4 font-normal text-default-900">
                            {errorMessage || successMessage}
                          </span>
                        </Toast>
                        :
                        null
                    }

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
                    {
                      isReinstatement ?
                        <div className="mt-4">
                          <RadioGroup
                            label="¿Desea cambiar el plan de cliente?"
                            value={withPlanChange}
                            className="ml-4"
                            onValueChange={(value) => setWithPlanChange(value as "change" | "no-change")}
                          >
                            <Radio value="no-change">Mantener el plan</Radio>
                            <Radio value="change">Cambiar plan</Radio>
                          </RadioGroup>
                        </div>
                        :
                        null
                    }

                    {
                      !isReinstatement || withPlanChange === "change" ?
                        <>

                          {/* NEW COMMITMENT TYPE */}
                          <div className="flex flex-col mt-6">
                            <span className="text-medium text-default-500">Selecciona nuevo plan</span>
                            <Select
                              isRequired
                              name={'commitment_type'}
                              label="SELECCIONA MODALIDAD DE COSTO Y PAGO"
                              // defaultSelectedKeys={["cat"]}
                              onChange={(event) => {
                                setSelectedCommitmentType(event.target.value)
                                setSelectedBaseSku("")
                                // handleUpdateFields('sku_id', '')
                              }}
                              selectedKeys={[selectedCommitmentType]}
                              showScrollIndicators
                            >
                              {commitmentTypes.map((item) => {
                                return (
                                  <SelectItem key={item.value} className="text-black">
                                    {item.description}
                                  </SelectItem>
                                )
                              })}
                            </Select>
                          </div>

                          {/* AVAILABLE SKUS TO TRANSITION TO */}
                          {
                            loadingCompatibleSkus ?
                              <Skeleton className="rounded-lg mt-2">
                                <div className="h-14 rounded-lg bg-default-300" />
                              </Skeleton>
                              :
                                !isReinstatement ?
                                  compatibleSkus && compatibleSkus.length >= 1 ?
                                    <div className="flex flex-col mt-2">
                                      <Select
                                        isRequired
                                        name={'sku_base'}
                                        label="SELECCIONA SKU BASE"
                                        // defaultSelectedKeys={["cat"]}
                                        onChange={(event) => {
                                          // get the description of the selected sku
                                          const skuDescription = allSkus.filter((sku) => sku.sku_base === event.target.value)[0].description
                                          setSelectedBaseSkuDescription(skuDescription)
                                          setSelectedBaseSku(event.target.value)

                                          // handleUpdateFields('sku_id', '')
                                        }}
                                        selectedKeys={[selectedBaseSku]}
                                        showScrollIndicators
                                      >
                                        {compatibleSkus.map((item) => (
                                          <SelectItem key={item.sku_base} className="text-black">
                                            {item.description}
                                          </SelectItem>
                                        ))}
                                      </Select>
                                    </div>
                                    :
                                    null
                                  :
                                  availableSkus && availableSkus.length >= 1 ?
                                    <div className="flex flex-col mt-2">
                                      <Select
                                        isRequired
                                        name={'sku_base'}
                                        label="SELECCIONA SKU BASE"
                                        // defaultSelectedKeys={["cat"]}
                                        onChange={(event) => {
                                          // get the description of the selected sku
                                          const skuDescription = allSkus.filter((sku) => sku.sku_base === event.target.value)[0].description
                                          setSelectedBaseSkuDescription(skuDescription)
                                          setSelectedBaseSku(event.target.value)

                                          // handleUpdateFields('sku_id', '')
                                        }}
                                        selectedKeys={[selectedBaseSku]}
                                        showScrollIndicators
                                      >
                                        {availableSkus.map((item) => (
                                          <SelectItem key={item.sku_base} className="text-black">
                                            {item.description}
                                          </SelectItem>
                                        ))}
                                      </Select>
                                    </div>
                                    :
                                    null
                          }

                        </>
                        :
                        null
                    }


                  </div>


                </DrawerBody>

                <DrawerFooter className="flex flex-col gap-4 p-0">

                  {
                    isReinstatement ?
                      <ReinstateConfirmationBox
                        current_sku_base={currentSkuInfo.sku_base}
                        new_sku_base={selectedBaseSku}
                        end_date={end_date}
                        new_license_description={selectedBaseSkuDescription}
                        onCloseDrawer={onClose}
                        teamId={teamId}
                        current_skus={current_skus}
                        resellerIds={resellerIds}
                        new_skus={newSkus}
                        setErrorMessage={setErrorMessage}
                        setSuccessMessage={setSuccessMessage}
                        setSelectedCommitmentType={setSelectedCommitmentType}
                        setSelectedBaseSku={setSelectedBaseSku}
                        withPlanChange={withPlanChange}
                      />
                    :
                      null
                  }

                  {
                    !isReinstatement && selectedBaseSku && selectedBaseSku.length >= 1 && selectedBaseSkuDescription && selectedBaseSkuDescription.length >= 1 ?
                      <div className="flex flex-col gap-2">
                        <ConfirmationBox
                          current_sku_base={currentSkuInfo.sku_base}
                          new_sku_base={selectedBaseSku}
                          end_date={end_date}
                          new_license_description={selectedBaseSkuDescription}
                          onCloseDrawer={onClose}
                          teamId={teamId}
                          current_skus={current_skus}
                          resellerIds={resellerIds}
                          new_skus={newSkus}
                          setErrorMessage={setErrorMessage}
                          setSuccessMessage={setSuccessMessage}
                          setSelectedCommitmentType={setSelectedCommitmentType}
                          setSelectedBaseSku={setSelectedBaseSku}
                        />
                      </div>
                      :
                      null
                  }
                  <Button
                    color="default"
                    variant="flat"
                    onPress={onClose}
                    className="text-default-foreground text-sm"
                    size={'lg'}
                    radius="sm"
                  >
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