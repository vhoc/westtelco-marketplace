"use server"
import { INewTeamData, ISku, ITeamApiResponse } from "@/types"
import { revalidateTag } from "next/cache"
import { createClient } from "@/utils/supabase/server"

/**
 * Fetches a team's data
 */
export const getTeam = async (teamId: string, resellerId?: string | null | undefined) => {
  "use server"
  revalidateTag('team' + teamId)
  console.log(`DEBUG: app/team/actions/getTeam: teamId: `, teamId)
  console.log(`DEBUG: app/team/actions/getTeam: resellerId: `, resellerId)

  const fetchUrl = resellerId ? `${process.env.LOCAL_API_BASE_URL}/api/teams/${teamId}?resellerId=${resellerId}`
    : `${process.env.LOCAL_API_BASE_URL}/api/teams/${teamId}`


  const response = await fetch(fetchUrl,
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      next: {
        tags: [
          'team' + teamId
        ]
      }
    }
  )

  if (!response.ok) {
    return Response.json(
      {
        error: "No se pudo obtener la información de éste cliente.",
        status: response.status
      }
    )
  }

  const data = await response.json()
  revalidateTag('team' + teamId)
  return Response.json(data, { status: 200 })

}

/**
 * Modify a team's SKUs
 * 
 * Sends a modify request to change the SKU's of a team to the backend API, and returns the updated team info.
 * @param teamId string
 * @param currentSkus Array<ISku>
 * @param newSkus Array<ISku>
 * @param forceImmediate boolean
 * @param resellerIds Array<string>
 * @return Promise<ITeamApiResponse>
 */
export const modifyTeamSkus = async (teamId: string, currentSkus: Array<ISku>, newSkus: Array<ISku>, forceImmediate: boolean = false, resellerIds: Array<string> = []): Promise<ITeamApiResponse> => {
  "use server"

  const response = await fetch(`${process.env.LOCAL_API_BASE_URL}/api/teams/${teamId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `${process.env.API_KEY}`,
      },
      body: JSON.stringify({
        "environment": process.env.API_ENV,
        "country": process.env.DISTRIBUITOR_COUNTRY,
        "id": teamId,
        "current_skus": currentSkus,
        "new_skus": newSkus,
        "reseller_ids": resellerIds,
        "force_immediate": forceImmediate,
      })
    }
  )

  const responseObject = await response.json()
  console.log(`responseObject: `, responseObject)
  revalidateTag('team' + teamId)
  return responseObject

}

export async function getPartners() {
  const response = await fetch(`${process.env.LOCAL_API_BASE_URL}/api/partners`, {
    next: {
      tags: ['partners']
    }
  })

  const partners = await response.json()
  return partners
}

export async function getSkus() {
  const response = await fetch(`${process.env.LOCAL_API_BASE_URL}/api/skus`, {
    next: {
      tags: ['skus']
    }
  })

  const skus = await response.json()
  return skus
}

/**
 * Obtains the team from the database (supabase)
 * @param teamId 
 * @returns 
 */
export const getTeamFromDatabase = async (teamId: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('team')
    .select('*')
    .eq('team_id', teamId)
    .single()

  if (error) {
    console.error(error)
  }

  return { data, error }
}

/**
 * Updates the admin_email field of the team in the database (supabase)
 * @param teamId 
 * @param teamData 
 * @returns 
 */
export const updateDbTeamAdminEmail = async (teamId: string, admin_email: string) => {
  const supabase = createClient()
  const { data, error }: { data: INewTeamData | null, error: any } = await supabase
    .from('team')
    .update({ admin_email })
    .eq('team_id', teamId)
    .select()
    .single()

  if (error) {
    console.error(error)
  }

  return { data, error }
}