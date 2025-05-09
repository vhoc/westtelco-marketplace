"use client"
import { useState, useEffect } from "react"
import { Input, Select, SelectItem } from "@heroui/react"
import { IPartner } from "@/types"
import { SubmitButton } from "../buttons/SubmitButton"

interface ImportTeamFormProps {
  message?: string | undefined
  formAction: any
  className?: string | undefined
  partners: Array<IPartner>
  originResellerId?: string | undefined
}

interface IImportTeamFormFields {
  teamId: string
  destination_reseller_id: string
}

const ImportTeamForm = ({ message, formAction, className, partners, originResellerId }: ImportTeamFormProps) => {

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [fields, setFields] = useState<IImportTeamFormFields>({
    teamId: "",
    destination_reseller_id: ""
  })

  const handleUpdateFields = (property: string, value: string) => {
    setFields(prevFields => ({
      ...prevFields,
      [property]: value
    }))
  }


  useEffect(() => {
    if (fields.teamId.length >= 1 && fields.destination_reseller_id.length >= 1) {
      setIsSubmitDisabled(false)
    } else {
      setIsSubmitDisabled(true)
    }
  }, [fields])

  return (
    <form action={formAction} className={className}>
      <Input
        name={'teamId'}
        label={'TEAM ID'}
        aria-label="teamId"
        isRequired
        value={fields.teamId}
        onChange={(event) => handleUpdateFields('teamId', event.target.value)}
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

export default ImportTeamForm