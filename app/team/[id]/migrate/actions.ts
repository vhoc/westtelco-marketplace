import { redirect } from "next/navigation"
import { revalidateTag } from "next/cache"
import { createClient } from "@/utils/supabase/server"

export const migrateTeam = async (formData: FormData) => {
  "use server"

  const supabase = await createClient()

  const rawData = {
    id: formData.get('team_id'),
    reseller_ids: [formData.get('origin_reseller_id')],
    to_reseller_ids: [formData.get('destination_reseller_id')],
  }

  // Make the request to Dropbox API to migrate the team from the origin reseller to the destination reseller
  const response = await fetch(`${process.env.API_BASE_URL}/dropboxResellers/v1/team/migrate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `${process.env.API_KEY}`,
      },
      body: JSON.stringify({
        "environment": process.env.API_ENV,
        "id": rawData.id,
        "reseller_ids" : rawData.reseller_ids,
        "to_reseller_ids": rawData.to_reseller_ids,
        // "country": process.env.DISTRIBUITOR_COUNTRY
      })
    }
  )

  const responseObject = await response.json()
  console.log('responseObject: ', responseObject)


  if ( responseObject.code !== 200 ) {
    if ( responseObject.data?.error_summary ) {
      return redirect(`/team/${rawData.id}/migrate?message=${responseObject.data.error_summary}`)
    }
    return redirect(`/team/${rawData.id}/migrate?message=${responseObject.data}`)
  }
  // If the call is successful, make the request to Supabase to update the team's reseller_id column.

  const { data, error: supabaseError } = await supabase
    .from('partner')
    .update({ dropbox_reseller_id: rawData.to_reseller_ids })
    .eq('dropbox_reseller_id', rawData.reseller_ids)
    .select()

  console.log(`app/team/[id]/migrate/actions.ts :: updated reseller data in database: `, data)

  revalidateTag('team' + rawData.id)

  if ( supabaseError ) {
    return redirect(`/teams?message=El cliente se ha migrado correctamente, pero el reseller id no se ha actualizado correctamente en la base de datos. Reporta éste mensaje de error a Desarrollo.`)
  }

  return redirect(`/teams?message=El cliente se ha migrado correctamente.`)

}