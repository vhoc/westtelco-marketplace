'use server'

import { redirect } from 'next/navigation'
import { createTeam } from '@/utils/team'

export async function createNewTeam(formData: FormData) {

  // type-casting here for convenience
  // Pending: validations.
  const teamData = {
    name: formData.get('name') as string,
    invite_admin: formData.get('invite_admin') as string,
    country_code: formData.get('country_code') as string,
    reseller_ids: [ process.env.DISTRIBUITOR_ID, formData.get('reseller_id') as string ],
    is_trial: formData.get('is_trial') as string,
    skus: [
      {
        "sku_id": formData.get('sku_id') as string,
        "quantity": 1
      }
    ]
  }

  const createTeamResponse = await createTeam(teamData)


  if ( createTeamResponse.code !== 200 || !createTeamResponse.data ) {
    return redirect(`/team/new?message=${ encodeURI( createTeamResponse.message || 'Error desconocido.' ) }`)
  }

  const urlEncoded = encodeURIComponent(createTeamResponse.data.id as string)
  return redirect(`/team/${urlEncoded}`);
}
