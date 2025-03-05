"use client";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import Toast from "../feedback/Toast";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SubmitButton } from "../buttons/SubmitButton";

interface CreatePartnerFormProps {
  message?: string | undefined
  formAction: any
  className?: string | undefined
}

interface ICreatePartnerFormFields {
  company_name: string
  dropbox_reseller_id: string
  dropbox_admin_email: string
  address_1?: string | undefined
  address_2?: string | undefined
  address_city?: string | undefined
  address_state?: string | undefined
  address_postal_code?: string | undefined
  address_country: string
  invoice_data?: string | undefined
  currency: string
}

const CreatePartnerForm = ({ message, formAction, className }: CreatePartnerFormProps) => {

  const currencies = [
    { name: "Peso Mexicano", code: "mxn" },
    { name: "Dólar Estadounidense", code: "usd" },
    { name: "Real Brasileño", code: "br" },
  ]

  const countries = [
    { name: "Argentina", code: "AR" },
    { name: "Brasil", code: "BR" },
    { name: "Chile", code: "CL" },
    { name: "Colombia", code: "CO" },
    { name: "Costa Rica", code: "CR" },
    { name: "El Salvador", code: "SV" },
    { name: "Estados Unidos", code: "US" },
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
  // const [isLoadingPartners, setIsLoadingPartners] = useState(true)
  const [fields, setFields] = useState<ICreatePartnerFormFields>({
    company_name: "",
    dropbox_reseller_id: "",
    dropbox_admin_email: "",
    address_1: "",
    address_2: "",
    address_city: "",
    address_state: "",
    address_postal_code: "",
    address_country: "MX",
    invoice_data: "",
    currency: "mxn"
  })

  const handleUpdateFields = (property: string, value: string | boolean) => {
    setFields(prevFields => ({
      ...prevFields,
      [property]: value
    }))
  }

  // Fields validations
  useEffect(() => {
    if (
      fields.company_name.length >= 1 &&
      fields.dropbox_reseller_id.length >= 1 &&
      fields.dropbox_admin_email.length >= 1 &&
      fields.currency.length >= 1
    ) {
      setIsSubmitDisabled(false)
    } else {
      setIsSubmitDisabled(true)
    }
  }, [fields])

  return (
    <form action={formAction} className={className}>
      <Input
        name={'company_name'}
        label={'NOMBRE DEL PARTNER'}
        aria-label="company_name"
        isRequired
        value={fields.company_name}
        onChange={(event) => handleUpdateFields('company_name', event.target.value)}
        maxLength={120}
      />

      <Input
        name={'dropbox_reseller_id'}
        label={'DROPBOX RESELLER ID'}
        aria-label="dropbox_reseller_id"
        isRequired
        value={fields.dropbox_reseller_id}
        onChange={(event) => handleUpdateFields('dropbox_reseller_id', event.target.value)}
      />

      <Input
        name={'dropbox_admin_email'}
        label={'DROPBOX ADMIN EMAIL'}
        aria-label="dropbox_admin_email"
        isRequired
        value={fields.dropbox_admin_email}
        onChange={(event) => handleUpdateFields('dropbox_admin_email', event.target.value)}
      />

      <Input
        name={'address_1'}
        label={'DIRECCIÓN (LÍNEA 1)'}
        aria-label="address_1"
        value={fields.address_1}
        onChange={(event) => handleUpdateFields('address_1', event.target.value)}
      />

      <Input
        name={'address_2'}
        label={'DIRECCIÓN (LÍNEA 2)'}
        aria-label="address_2"
        value={fields.address_2}
        onChange={(event) => handleUpdateFields('address_2', event.target.value)}
      />

      <Input
        name={'address_city'}
        label={'CIUDAD'}
        aria-label="address_city"
        value={fields.address_city}
        onChange={(event) => handleUpdateFields('address_city', event.target.value)}
      />

      <Input
        name={'address_state'}
        label={'ESTADO O REGIÓN'}
        aria-label="address_state"
        value={fields.address_state}
        onChange={(event) => handleUpdateFields('address_state', event.target.value)}
      />

      <Input
        type={'number'}
        maxLength={6}
        max={99999}
        name={'address_postal_code'}
        label={'CÓDIGO POSTAL'}
        aria-label="address_postal_code"
        value={fields.address_postal_code}
        onChange={(event) => handleUpdateFields('address_postal_code', event.target.value)}
      />

      <Select
        name={'address_country'}
        label="CÓDIGO DEL PAÍS"
        onChange={(event) => handleUpdateFields('address_country', event.target.value)}
        selectedKeys={[fields.address_country]}
        showScrollIndicators
      >
        {countries.map((country) => (
          <SelectItem key={country.code} className="text-black">
            {country.name}
          </SelectItem>
        ))}
      </Select>

      <Select
        name={'currency'}
        label="TIPO DE CAMBIO"
        onChange={(event) => handleUpdateFields('currency', event.target.value)}
        selectedKeys={[fields.currency]}
        showScrollIndicators
      >
        {currencies.map((currency) => (
          <SelectItem key={currency.code} className="text-black">
            {currency.name}
          </SelectItem>
        ))}
      </Select>        

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
        loadingText="Creando partner..."
        defaultText="Crear Partner"
        isDisabled={isSubmitDisabled}
        setIsLoading={setIsLoading}
      />

      <Button
        color="primary"
        variant={'light'}
        radius={'sm'}
        onPress={() => router.push('/partners')}
        isDisabled={isLoading}
      >
        Regresar a Partners
      </Button>
    </form>
  )

}

export default CreatePartnerForm