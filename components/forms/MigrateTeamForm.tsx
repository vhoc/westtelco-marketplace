"use client"
import { useState, useEffect } from "react"
import { Input, Select, SelectItem } from '@nextui-org/react'
import { IPartner } from "@/types"
import { SubmitButton } from "../buttons/SubmitButton"

interface MigrateTeamFormProps {
  teamName: string
  teamId: string
  message?: string | undefined
  formAction: any
  className?: string | undefined
  partners: Array<IPartner>
  origin_reseller_id: string
}

interface IMigrateTeamFormFields {
  name: string
  // origin_reseller_id: string
  destination_reseller_id: string
}

const MigrateTeamForm = ({ teamName, teamId, message, formAction, className, partners, origin_reseller_id }: MigrateTeamFormProps) => {

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [fields, setFields] = useState<IMigrateTeamFormFields>({
    name: teamName,
    // origin_reseller_id: origin_reseller_id,
    destination_reseller_id: ""
  })


  const handleUpdateFields = (property: string, value: string) => {
    setFields(prevFields => ({
      ...prevFields,
      [property]: value
    }))
  }

  useEffect(() => {
    if (fields?.name.length >= 1 &&
      origin_reseller_id.length >= 1 &&
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
        // isDisabled
        isRequired
        isReadOnly
        value={fields.name}
        onChange={(event) => handleUpdateFields('name', event.target.value)}
        maxLength={20}
      />

      <input type="hidden" name="team_id" value={teamId} />

      <Input
        name={'origin_reseller_id'}
        label={'RESELLER ID ACTUAL'}
        aria-label="origin_reseller_id"
        isRequired
        // isDisabled
        value={origin_reseller_id}
        readOnly
        onChange={(event) => handleUpdateFields('origin_reseller_id', event.target.value)}
        maxLength={20}
      />

      {
        partners && partners.length >= 1 ?
          <Select
            isRequired
            name={'destination_reseller_id'}
            label="RESELLER PARTNER DESTINO"
            onChange={(event) => handleUpdateFields('destination_reseller_id', event.target.value)}
            selectedKeys={[fields.destination_reseller_id]}
            showScrollIndicators
          >
            {/* Exclude West Telco on PRODUCTION environment? */}
            {/* {partners.filter(item => item.dropbox_reseller_id !== process.env.NEXT_PUBLIC_DISTRIBUITOR_ID).map((partner, index) => (
              <SelectItem key={partner.dropbox_reseller_id || String(index)} className="text-black">
                {partner.company_name}
              </SelectItem>
            ))} */}

            {/* ENABLE THIS ON DEV ENVIRONMENT */}
            {partners.map((partner, index) => (
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
        loadingText="Migrando..."
        defaultText="Migrar"
        isDisabled={isSubmitDisabled}
        setIsLoading={setIsLoading}
        color={'primary'}
      />
    </form>
  )

}

export default MigrateTeamForm