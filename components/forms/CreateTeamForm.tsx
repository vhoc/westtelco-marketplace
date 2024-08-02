"use client";
import { Input, Select, SelectItem, Switch, Skeleton } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import Toast from "../feedback/Toast";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SubmitButton } from "../buttons/SubmitButton";
import { getPartners } from "@/utils/partner-client";
import { IPartner } from "@/types";

interface CreateTeamFormProps {
  message?: string | undefined
  formAction: any
  className?: string | undefined
}

interface ICreateTeamFormFields {
  name: string
  country_code: string
  invite_admin: string
  invite_admin_confirmation: string
  sku_id: string
  reseller_id: string
  is_trial: string
}

const CreateTeamForm = ({ message, formAction, className }: CreateTeamFormProps) => {

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
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [partners, setPartners] = useState<Array<IPartner>>([])
  const [isLoadingPartners, setIsLoadingPartners] = useState(true)
  const [fields, setFields] = useState<ICreateTeamFormFields>({
    name: "",
    country_code: "MX",
    invite_admin: "",
    invite_admin_confirmation: "",
    sku_id: "",
    reseller_id: "",
    is_trial: "false",
  })

  const handleUpdateFields = (property: string, value: string | boolean) => {
    setFields(prevFields => ({
      ...prevFields,
      [property]: value
    }))
  }

  // Get Partners from supabase
  useEffect(() => {
    getPartners()
      .then(data => {
        console.log(`Partners: `, data)
        setPartners(data)
      })
      .catch(error => {
        console.error(error)
        setPartners([])
      })
      .finally(() => {
        setIsLoadingPartners(false)
      })
  }, [])

  // Fields validations
  useEffect(() => {
    if (
      fields.name.length >= 1 &&
      fields.invite_admin.length >= 1 &&
      fields.invite_admin_confirmation.length >= 1 &&
      fields.invite_admin === fields.invite_admin_confirmation &&
      fields.sku_id.length >= 1 &&
      fields.reseller_id.length >= 1
    ) {
      setIsSubmitDisabled(false)
    } else {
      setIsSubmitDisabled(true)
    }
  }, [fields])

  return (
    <form action={formAction} className={className}>
      <Input
        name={'name'}
        label={'NOMBRE DEL CLIENTE'}
        aria-label="name"
        isRequired
        value={fields.name}
        onChange={(event) => handleUpdateFields('name', event.target.value)}
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

      <Skeleton isLoaded={!isLoadingPartners} className={'rounded-xl'}>
        <Select
          isRequired
          name={'reseller_id'}
          label="RESELLER PARTNER"
          onChange={(event) => handleUpdateFields('reseller_id', event.target.value)}
          selectedKeys={[fields.reseller_id]}
          showScrollIndicators
        >
          {/* Exclude West Telco for now? */}
          {partners.filter(item => item.dropbox_reseller_id !== process.env.NEXT_PUBLIC_DISTRIBUITOR_ID).map((partner, index) => (
            <SelectItem key={partner.dropbox_reseller_id || String(index)} className="text-black">
              {partner.company_name}
            </SelectItem>
          ))}
        </Select>
      </Skeleton>
      <Skeleton isLoaded={!isLoadingPartners} className={'rounded-xl'}>
        <Input
          label={'RESELLER ID'}
          aria-label="reseller_id"
          isReadOnly
          isDisabled
          value={fields.reseller_id}
        />
      </Skeleton>


      <div className="flex flex-col">
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

      <Switch
        name={'is_trial'}
        isSelected={fields.is_trial === "true"}
        value={fields.is_trial}
        onValueChange={(value) => handleUpdateFields('is_trial', String(value))}
      >
        <span className="text-sm">Trial de 30 días</span>
      </Switch>

      {message && (
        <Toast type={'warning'}>
          {message}
        </Toast>
      )}


      <SubmitButton
        radius={'sm'}
        className="w-full"
        formAction={formAction}
        size={'lg'}
        loadingText="Creando cliente..."
        defaultText="Crear Cliente"
        isDisabled={isSubmitDisabled}
        setIsLoading={setIsLoading}
      />

      <Button
        color="primary"
        variant={'light'}
        radius={'sm'}
        onPress={() => router.push('/team')}
        isDisabled={isLoading}
      >
        Regresar a Encontrar Cliente
      </Button>
    </form>
  )

}

export default CreateTeamForm