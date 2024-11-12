"use client";
import { Input, Select, SelectItem, Switch, RadioGroup, Radio, Card, Link } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import Toast from "../feedback/Toast";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SubmitButton } from "../buttons/SubmitButton";
import { IPartner, ISkuInfo } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

interface CreateTeamFormProps {
  message?: string | undefined
  formAction: any
  className?: string | undefined
  partners: Array<IPartner>
  commitmentTypes: Array<{ description: string, value: string }>
  skus: Array<ISkuInfo>
}

interface ICreateTeamFormFields {
  name: string
  country_code: string
  invite_admin: string
  invite_admin_confirmation: string
  sku_id: string
  base_sku_quantity: number,
  license_sku_quantity: number,
  reseller_id: string
  is_trial: string
}

const CreateTeamForm = ({ message, formAction, className, partners, commitmentTypes, skus }: CreateTeamFormProps) => {

  const countries = [
    { name: "Argentina", code: "AR" },
    { name: "Brasil", code: "BR" },
    { name: "Chile", code: "CL" },
    { name: "Colombia", code: "CO" },
    { name: "Costa Rica", code: "CR" },
    { name: "El Salvador", code: "SV" },
    { name: "Guatemala", code: "GT" },
    { name: "Honduras", code: "HN" },
    { name: "Jamaica", code: "JM" },
    { name: "México", code: "MX" },
    { name: "Nicaragua", code: "NI" },
    { name: "Panamá", code: "PA" },
    { name: "Puerto Rico", code: "PR" },
    { name: "Perú", code: "PE" },
    { name: "Uruguay", code: "UY" },
  ]

  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)
  const [baseSkuIncludedUsers, setBaseSkuIncludedUsers] = useState(3)
  const [licenseSku, setLicenseSku] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  // const [partners, setPartners] = useState<Array<IPartner>>([])
  // const [isLoadingPartners, setIsLoadingPartners] = useState(true)
  const [fields, setFields] = useState<ICreateTeamFormFields>({
    name: "",
    country_code: "MX",
    invite_admin: "",
    invite_admin_confirmation: "",
    sku_id: "",
    reseller_id: "",
    is_trial: "false",
    base_sku_quantity: 1,
    license_sku_quantity: 0,
  })

  const [brand, setBrand] = useState<"dropbox" | "sign">("dropbox")
  const [selectedCommitmentType, setSelectedCommitmentType] = useState("")
  const [shownSkus, setShownSkus] = useState<Array<ISkuInfo> | null>(null)

  const handleUpdateFields = (property: string, value: string | boolean) => {
    setFields(prevFields => ({
      ...prevFields,
      [property]: value
    }))
  }

  // Fields validations
  useEffect(() => {
    if (
      fields.name.length >= 1 &&
      fields.invite_admin.length >= 1 &&
      fields.invite_admin_confirmation.length >= 1 &&
      fields.invite_admin === fields.invite_admin_confirmation
    ) {
      setIsSubmitDisabled(false)
    } else {
      setIsSubmitDisabled(true)
    }
  }, [fields])

  // Load the available skus according to the selection of "brand" and "selectedCommitmentType"
  useEffect(() => {

    if (brand === 'dropbox') {// DROPBOX SKUS that are not Legacy
      const dropboxSkus = skus.filter(sku => !sku.license_type.startsWith('sign_') && !sku.sku_license.endsWith('-LEGACY'))
      if (dropboxSkus.length >= 1) {
        setBaseSkuIncludedUsers(3)// Set shown included users for the license (3 for Dropbox base SKU)
        const filteredSkus = dropboxSkus.filter(sku => sku.commitment_type === selectedCommitmentType)
        if (filteredSkus.length >= 1) {
          setShownSkus(filteredSkus)
        } else {
          setShownSkus(null)
        }
      } else {
        setShownSkus(null)
      }
    } else { // SIGN SKUS thatr are not Legacy
      const signSkus = skus.filter(sku => sku.license_type.startsWith('sign_') && !sku.sku_license.endsWith('-LEGACY'))
      if (signSkus.length >= 1) {
        setBaseSkuIncludedUsers(5)// Set shown included users for the license (5 for Sign base SKU)
        const filteredSkus = signSkus.filter(sku => sku.commitment_type === selectedCommitmentType)
        if (filteredSkus.length >= 1) {
          setShownSkus(filteredSkus)
        } else {
          setShownSkus(null)
        }
      } else {
        setShownSkus(null)
      }
    }
  }, [skus, brand, selectedCommitmentType])

  // Update the License SKU corresponding to the selected Base SKU
  useEffect(() => {
    const currentSkuInfo = skus.find(sku => sku.sku_base === fields.sku_id)
    if (currentSkuInfo) {
      setLicenseSku(currentSkuInfo.sku_license)
    } else {
      setLicenseSku("")
    }
  }, [skus, fields.sku_id])

  return (
    <main className="flex-1 w-full flex flex-col gap-6 items-center">
      {
        currentPage === 1 ?
          <Link
            color="primary"
            href={'/teams'}
            className="text-[#006FEE]"
          >
            Regresar a lista de clientes
          </Link>
          :
          <div className="flex justify-between items-end w-full max-w-[510px]">

            <div className="flex flex-col gap-y-3">
              <h4 className="text-base text-default-900">{fields.name}</h4>
              <span className="text-sm text-default-500">{fields.invite_admin}</span>
              <span className="rounded-[4px] bg-primary-100 text-primary-700 w-fit text-xs px-1">{fields.country_code}</span>
            </div>

            <Button
              color={'default'}
              className="rounded-md bg-white text-[#006FEE]"
              size={'sm'}
              onPress={() => setCurrentPage(1)}
            >
              Regresar
            </Button>

          </div>
      }

      <Card radius={'none'} shadow="none" className={'p-[45px] color-[#00336A] text-center w-full max-w-[510px] flex flex-col gap-4 mt-4'}>
        {
          currentPage === 1 ?
            <div className={'text-xl'}>Crear Cliente</div>
            :
            <div className={'text-xl'}>Configura la cuenta de Dropbox</div>
        }

        <form action={formAction} className={className}>

          {/* STEP 1 */}
          {
            currentPage === 1 ?
              <div className="flex flex-col gap-4">
                <Input
                  name={'name'}
                  label={'NOMBRE DEL CLIENTE'}
                  aria-label="name"
                  isRequired
                  value={fields.name}
                  onChange={(event) => handleUpdateFields('name', event.target.value)}
                  maxLength={20}
                />

                <Select
                  isRequired
                  name={'country_code'}
                  label="CÓDIGO DEL PAÍS"
                  // defaultSelectedKeys={["cat"]}
                  onChange={(event) => handleUpdateFields('country_code', event.target.value)}
                  selectedKeys={[fields.country_code]}
                  showScrollIndicators
                >
                  {countries.map((country) => (
                    <SelectItem key={country.code} className="text-black">
                      {country.name}
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  name={'invite_admin'}
                  label={'E-MAIL DEL CLIENTE PARA ENVIAR INVITACIÓN'}
                  aria-label="Invite admin Email"
                  isRequired
                  value={fields.invite_admin}
                  onChange={(event) => handleUpdateFields('invite_admin', event.target.value)}
                />

                <Input
                  name={'invite_admin_confirmation'}
                  label={'CONFIRMAR E-MAIL'}
                  aria-label="Invite admin Email confirmation"
                  isRequired
                  value={fields.invite_admin_confirmation}
                  onChange={(event) => handleUpdateFields('invite_admin_confirmation', event.target.value)}
                />

                {/* <Select
                isRequired
                name={'reseller_id'}
                label="RESELLER PARTNER"
                onChange={(event) => handleUpdateFields('reseller_id', event.target.value)}
                selectedKeys={[fields.reseller_id]}
                showScrollIndicators
              >
                {partners.filter(item => item.dropbox_reseller_id !== process.env.NEXT_PUBLIC_DISTRIBUITOR_ID).map((partner, index) => (
                  <SelectItem key={partner.dropbox_reseller_id || String(index)} className="text-black">
                    {partner.company_name}
                  </SelectItem>
                ))}
              </Select>
              <Input
                label={'RESELLER ID'}
                aria-label="reseller_id"
                isReadOnly
                isDisabled
                value={fields.reseller_id}
              /> */}


                {/* <div className="flex flex-col">
                <div className="text-left text-[12px] font-medium text-default-500">SKU BASE</div>
                <Input
                  name={'sku_id'}
                  // label={''}
                  aria-label="SKU Base"
                  placeholder={'Introduce SKU base'}
                  isRequired
                  value={fields.sku_id}
                  onChange={(event) => handleUpdateFields('sku_id', event.target.value)}
                />
              </div>

               */}

                {message && (
                  <Toast type={'warning'}>
                    {message}
                  </Toast>
                )}

                <RadioGroup
                  label={'Selecciona producto de Dropbox'}
                  className="text-left"
                  value={brand}
                  onValueChange={setBrand as ((value: string) => void) | undefined}
                >
                  <Radio value={'dropbox'} >Dropbox</Radio>
                  <Radio value={'sign'} >Sign</Radio>
                </RadioGroup>

                <Button
                  color={'default'}
                  radius="sm"
                  className="w-full"
                  // formAction={formAction}
                  size="lg"
                  isDisabled={isSubmitDisabled}
                  onClick={() => setCurrentPage(2)}
                >
                  Continuar
                </Button>




              </div>
              :
              null
          }


          {/* STEP 2 */}
          {
            currentPage === 2 ?
              <div className="flex flex-col gap-4">
                <Select
                  isRequired
                  name={'commitment_type'}
                  label="SELECCIONA MODALIDAD DE COSTO Y PAGO"
                  // defaultSelectedKeys={["cat"]}
                  onChange={(event) => {
                    setSelectedCommitmentType(event.target.value)
                    handleUpdateFields('sku_id', '')
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

                {
                  shownSkus && shownSkus.length >= 1 ?
                    <Select
                      isRequired
                      name={'sku_id'}
                      label="Seleccione SKU base"
                      // defaultSelectedKeys={["cat"]}
                      onChange={(event) => handleUpdateFields('sku_id', event.target.value)}
                      selectedKeys={[fields.sku_id]}
                      showScrollIndicators
                    >
                      {shownSkus.map((sku) => (
                        <SelectItem key={sku.sku_base} className="text-black">
                          {sku.description}
                        </SelectItem>
                      ))}
                    </Select>
                    :
                    null
                }

                {/* IS TRIAL SWITCH */}
                { // Annual price, per license per month' doesn't support TRIAL
                  fields.sku_id.length >= 1 && selectedCommitmentType !== 'month-annual-payment' ?
                    <div className="flex justify-between items-center gap-2 mt-4">
                      <div className="flex flex-col">
                        <span className="text-sm leading-5 font-medium text-left">Activar trial de 30 días</span>
                        <span className="text-default-500 text-left text-xs">Las licencias se renovarán automáticamente al expirar</span>
                      </div>

                      <Switch
                        name={'is_trial'}
                        isSelected={fields.is_trial === "true"}
                        value={fields.is_trial}
                        onValueChange={(value) => handleUpdateFields('is_trial', String(value))}
                      >
                      </Switch>
                    </div>
                    :
                    null
                }

                {/* LICENSES AMOUNTS */}
                {
                  fields.sku_id.length >= 1 ?
                    <>
                      <div className="text-medium text-default-500 text-left mt-4">Introduce cantidad de licencias</div>

                      <div className="flex flex-col gap-2">

                        {/* SKU BASE */}
                        <div className="flex justify-between gap-2 items-center">
                          <div className="flex flex-col">
                            <span className="text-sm leading-5 font-medium text-left">Licencias en SKU base</span>
                            <span className="text-default-500 text-left text-xs">{fields.sku_id}</span>
                          </div>

                          <Input
                            readOnly
                            type={'number'}
                            variant={'bordered'}
                            value={String(baseSkuIncludedUsers)}
                            size={'lg'}
                            isDisabled
                            className="max-w-24 w-"
                            classNames={{
                              input: [
                                "text-center text-sm",
                                "pl-3",
                              ],
                              inputWrapper: [
                                "min-w-20",
                                "h-14",
                                "bg-default-100"
                              ]
                            }}
                          />
                        </div>

                        {/* SKU LICENSE */}
                        <div className="flex justify-between gap-2 items-center">
                          <div className="flex flex-col">
                            <span className="text-sm leading-5 font-medium text-left">Licencias adicionales</span>
                            <span className="text-default-500 text-left text-xs">{licenseSku}</span>
                          </div>

                          <Input
                            type={'number'}
                            variant={'bordered'}
                            value={String(fields.license_sku_quantity)}
                            size={'lg'}
                            onChange={(event) => handleUpdateFields('license_sku_quantity', event.target.value)}
                            min={0}
                            className="max-w-24"
                            classNames={{
                              input: [
                                "text-center text-sm",
                                "pl-3",
                              ],
                              inputWrapper: [
                                "min-w-20",
                                "h-14",
                                "bg-white"
                              ]
                            }}
                          />
                        </div>

                        <div className="flex justify-between items-center bg-default-100 rounded-md py-2 pl-2 pr-11">
                          <span className="text-xs text-default-500">Total de licencias</span>
                          <span className="text-xs text-default-500">{Number(fields.license_sku_quantity) + baseSkuIncludedUsers}</span>
                        </div>

                        {/* WARNING MESSAGE */}
                        <div className="bg-warning-100 rounded-lg py-3 px-3 flex gap-4 mt-2">
                          <FontAwesomeIcon icon={faTriangleExclamation} color="#F5A524" size="lg" />

                          <div className="flex flex-col">
                            <p className="font-semibold text-sm text-warning-foreground text-left">Revisa la configuración antes de completar.</p>
                            <p className="text-sm leading-5 font-normal text-warning-foreground text-left">
                              Al finalizar éste paso se provisionarán las licencias de inmediato.
                            </p>
                          </div>
                        </div>

                        <SubmitButton
                          radius={'sm'}
                          color={'primary'}
                          className="w-full mt-2"
                          formAction={formAction}
                          size={'lg'}
                          loadingText="Creando cliente..."
                          defaultText="Completar"
                          isDisabled={isSubmitDisabled}
                          setIsLoading={setIsLoading}
                        />

                      </div>
                    </>
                    :
                    null
                }


                <div className="flex flex-col text-left">
                  selectedCommitmentType: {selectedCommitmentType}<br />
                  sku_id: {fields.sku_id}<br />
                  skuInfo: <pre>{JSON.stringify(shownSkus?.filter(sku => sku.sku_base === fields.sku_id), null, 3)}</pre>
                </div>


              </div>
              :
              null
          }


        </form>
      </Card>
    </main>

  )

}

export default CreateTeamForm