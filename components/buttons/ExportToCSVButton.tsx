"use client"
import { Button } from "@heroui/react"
import { ITeamData, IPartner } from "@/types"
import { FileInput } from 'lucide-react'
import { CSVLink } from "react-csv"

interface ExportToCSVButtonProps {
  teams: ITeamData[]
  partners: IPartner[]
}

const ExportToCSVButton = ({ teams, partners }: ExportToCSVButtonProps) => {

  function escapeCsvField(fieldValue: string) {
    // Convert non-strings (like numbers, booleans) to strings
    const stringValue = String(fieldValue);
  
    // Check if quoting is necessary: contains comma, double quote, or newline
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
      // 1. Escape existing double quotes by doubling them ("" -> """")
      const escapedValue = stringValue.replace(/"/g, '""');
      // 2. Enclose the entire result in double quotes
      return `"${escapedValue}"`;
    }
  
    // If no special characters, return the string as is
    return stringValue;
  }

  const exportedTeams = teams.map(team => {
    return {
      id: team.id,
      name: team.name,
      num_licensed_users: team.num_licensed_users,
      num_provisioned_users: team.num_provisioned_users,
      sku_id: team.sku_id,
      auto_renew: team.auto_renew,
      start_date: team.start_date,
      end_date: team.end_date,
      end_datetime: team.end_datetime,
      active: team.active,
      country_code: team.country_code,
      data_residency: team.data_residency,
      reseller_id_1: team.reseller_ids[0] ?? '',
      reseller_id_2: team.reseller_ids[1] ?? '',
      partner: partners.find(partner => partner.dropbox_reseller_id === team.reseller_ids[1])?.company_name ?? 'Unknown',
    }
  })

  const filename = `clientes-zoom_${new Date().toISOString()}.csv`

  if ( teams && teams.length >= 1 && exportedTeams && exportedTeams.length >= 1 ) {
    return (
      <CSVLink data={exportedTeams} filename={filename} >
        <Button
          type="button"
          size="sm"
          color={'default'}
          endContent={<FileInput size={16} />}
        >      
          Exportar
        </Button>
      </CSVLink>
    )
  }


  return null
}

export default ExportToCSVButton