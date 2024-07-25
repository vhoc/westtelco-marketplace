'use server'

import { redirect } from 'next/navigation'
import { createTeam } from '@/utils/team'
// import { createClient } from '@/utils/supabase/server'

export async function createNewTeam(formData: FormData) {
  // const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const teamData = {
    name: formData.get('name') as string,
    invite_admin: formData.get('invite_admin') as string,
    country_code: formData.get('country_code') as string,
    skus: [
      {
        "sku_id": formData.get('sku_id') as string,
        "quantity": 1
      }
    ]
  }

  console.log(`teamData: `, teamData)

  const createTeamResponse = await createTeam(teamData)

  console.log(`createTeamResponse: `, createTeamResponse)

  if ( createTeamResponse.code !== 200 || !createTeamResponse.data ) {
    return redirect(`/team/new?message=${ encodeURI( createTeamResponse.message || 'Error desconocido.' ) }`)
  }

  const urlEncoded = encodeURIComponent(createTeamResponse.data.id as string)
  return redirect(`/team/${urlEncoded}`);
}
