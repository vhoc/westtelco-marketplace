'use server'

import { redirect } from 'next/navigation'
import { createTeam } from '@/utils/team'
import { createClient } from '@/utils/supabase/server'

export async function createNewTeam(formData: FormData) {

  // type-casting here for convenience
  // Pending: validations.
  const teamData = {
    name: formData.get('name') as string,
    invite_admin: formData.get('invite_admin') as string,
    country_code: formData.get('country_code') as string,
    reseller_ids: process.env.API_ENV === "PROD" ? [ process.env.DISTRIBUITOR_ID, formData.get('reseller_id') as string ] : [],
    // reseller_ids: [],// Uncomment this and comment the above for DEV environment.
    is_trial: formData.get('is_trial') as string,
    skus: [
      {
        "sku_id": formData.get('sku_id') as string,
        "quantity": 1
      }
    ]
  }

  const createTeamResponse = await createTeam(teamData)


  if (createTeamResponse.code !== 200 || !createTeamResponse.data) {
    return redirect(`/team/new?message=${encodeURI(createTeamResponse.message || 'Error desconocido.')}`)
  }

  // Insert the record in supabase
  // console.log(`createTeamResponse.data: `, JSON.stringify(createTeamResponse.data, null, 3))

  // Calculate the start contract date from the end_date
  let endDate = new Date(createTeamResponse.data.end_datetime)

  // If base SKU ends in 1Y substract 1 year, if not, substract 1 month
  if (createTeamResponse.data.sku_id?.endsWith("1Y") || createTeamResponse.data.sku_id?.endsWith("AC1M")) {
    endDate.setFullYear(endDate.getFullYear() - 1)
  } else {
    endDate.setMonth(endDate.getMonth() - 1);
  }

  let startDate = endDate.toISOString()

  const supabase = createClient()
  const { data, error } = await supabase
    .from('team')
    .insert([
      {
        team_id: createTeamResponse.data.id,
        name: createTeamResponse.data.name,
        dropbox_reseller_id: createTeamResponse.data.reseller_ids[1] ? createTeamResponse.data.reseller_ids[1] : createTeamResponse.data.reseller_ids[0],
        contract_start: startDate,
        provisioning_method: "API",
      }
    ])
    .select()

  const urlEncoded = encodeURIComponent(createTeamResponse.data.id as string)

  if (error) {
    console.error(error)
    return redirect(`/team/${urlEncoded}?message=El cliente fue creado con exito en Dropbox pero no pudo ser dado de alta en la base de datos de West Telco Marketplace. Por favor contactar a soporte de UX Neighbor.`);
  }

  // console.log(`data: `, data)


  return redirect(`/team/${urlEncoded}`);
}
