'use server'

import { redirect } from 'next/navigation'
import { createTeam } from '@/utils/team'
import { createClient } from '@/utils/supabase/server'

export async function createNewTeam(formData: FormData) {

  // console.log(`formData: `, formData)

  // type-casting here for convenience
  // Pending: validations.
  const teamData = {
    name: formData.get('name') as string,
    invite_admin: formData.get('invite_admin') as string,
    country_code: formData.get('country_code') as string,
    reseller_ids: process.env.API_ENV === "PROD" ? [ formData.get('reseller_id') as string ] : [],
    is_trial: formData.get('is_trial') as string || false,
    skus: [
      {
        "sku_id": formData.get('sku_id') as string,
        "quantity": 1
      },
      {
        "sku_id": formData.get('licenseSku') as string,
        "quantity": Number(formData.get('license_sku_quantity') as string)
      }
    ],
  }

  console.log(`teamData: `, JSON.stringify(teamData, null, 1))

  const createTeamResponse = await createTeam(teamData)
  // console.log(`createTeamResponse: `, createTeamResponse)


  if (createTeamResponse.code !== 200 || !createTeamResponse.data) {

    // Email already exists
    if ( createTeamResponse.message.error_summary.startsWith('user_on_another_team') ) {
      return redirect(`/team/new?message=${encodeURI('ERROR: El email que has ingresado ya existe en otra cuenta.')}`)
    }

    const errorMessage = createTeamResponse.message && createTeamResponse.message.error_summary ? createTeamResponse.message.error_summary : 'Error desconocido'

    return redirect(`/team/new?message=${encodeURI(errorMessage || 'Error desconocido.')}`)
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
        distributor_id: process.env.DISTRIBUITOR_INTERNAL_ID,
        admin_email: formData.get('invite_admin') as string,
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