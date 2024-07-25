"use client";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import Toast from "../feedback/Toast";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SubmitButton } from "../buttons/SubmitButton";

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
  const [fields, setFields] = useState<ICreateTeamFormFields>({
    name: "",
    country_code: "MX",
    invite_admin: "",
    invite_admin_confirmation: "",
    sku_id: "",
  })

  const handleUpdateFields = (property: string, value: string) => {
    setFields(prevFields => ({
      ...prevFields,
      [property]: value
    }))
  }

  // Fields validations
  useEffect(() => {
    if (
      fields.name.length >= 1 &&
      fields.invite_admin.length >=1 &&
      fields.invite_admin_confirmation.length >= 1 &&
      fields.invite_admin === fields.invite_admin_confirmation &&
      fields.sku_id.length >= 1
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