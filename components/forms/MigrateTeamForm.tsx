"use client"
import { useState, useEffect } from "react"
import { Input, Select, SelectItem } from '@nextui-org/react'
import { IPartner } from "@/types"
import { SubmitButton } from "../buttons/SubmitButton"

interface MigrateTeamFormProps {
  message?: string | undefined
  formAction: any
  className?: string | undefined
  partners: Array<IPartner>
  origin_reseller_id: string
}

interface IMigrateTeamFormFields {
  name: string
  origin_reseller_id: string
  destination_reseller_id: string
}

const MigrateTeamForm = ({ message, formAction, className, partners, origin_reseller_id }: MigrateTeamFormProps) => {

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [fields, setFields] = useState<IMigrateTeamFormFields>({
    name: "",
    origin_reseller_id: decodeURIComponent(origin_reseller_id),
    destination_reseller_id: ""
  })

  const handleUpdateFields = (property: string, value: string) => {
    setFields(prevFields => ({
      ...prevFields,
      [property]: value
    }))
  }

  useEffect(() => {
    if (fields.name.length >= 1 &&
      fields.origin_reseller_id.length >= 1 &&
      fields.destination_reseller_id.length >= 1) {
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
        maxLength={20}
      />

      <Input
        name={'origin_reseller_id'}
        label={'RESELLER ID ACTUAL'}
        aria-label="origin_reseller_id"
        isRequired
        isDisabled
        value={fields.origin_reseller_id || origin_reseller_id}
        readOnly
        onChange={(event) => handleUpdateFields('origin_reseller_id', event.target.value)}
        maxLength={20}
      />

      {
        partners && partners.length >= 1 ?
          <Select
            isRequired
            name={'destination_reseller_id'}
            label="RESELLER PARTNER"
            onChange={(event) => handleUpdateFields('destination_reseller_id', event.target.value)}
            selectedKeys={[fields.destination_reseller_id]}
            showScrollIndicators
          >
            {/* Exclude West Telco for now? */}
            {partners.filter(item => item.dropbox_reseller_id !== process.env.NEXT_PUBLIC_DISTRIBUITOR_ID).map((partner, index) => (
              <SelectItem key={partner.dropbox_reseller_id || String(index)} className="text-black">
                {partner.company_name}
              </SelectItem>
            ))}
          </Select>
          :
          null
      }

      <SubmitButton
        radius={'sm'}
        className="w-full"
        formAction={formAction}
        size={'lg'}
        loadingText="Importando..."
        defaultText="Importar"
        isDisabled={isSubmitDisabled}
        setIsLoading={setIsLoading}
        color={'primary'}
      />
    </form>
  )

}

export default MigrateTeamForm