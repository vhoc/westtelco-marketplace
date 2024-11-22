"use server"
import {  ISku, ITeamApiResponse } from "@/types"
import { revalidateTag } from "next/cache"

/**
 * Fetches a team's data
 */
export const getTeam = async (teamId: string, resellerId?: string | null | undefined) => {
  "use server"
  // console.log(`DEBUG: app/team/actions/getTeam: teamId: `, teamId)
  // console.log(`DEBUG: app/team/actions/getTeam: resellerId: `, resellerId)

  const fetchUrl = resellerId ? `${process.env.LOCAL_API_BASE_URL}/api/teams/${teamId}?resellerId=${resellerId}`
                              : `${process.env.LOCAL_API_BASE_URL}/api/teams/${teamId}`

  // console.log(`DEBUG: app/team/actions/getTeam: fetchUrl: `, fetchUrl)
  
// console.log(`DEBUG: app/team/actions/getTeam: fetch call: `, `${process.env.LOCAL_API_BASE_URL}/api/teams/${teamId}${resellerId && resellerId.length >= 1 ? `?resellerId=${resellerId}` : ''}`)
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

  // console.log(`DEBUG: app/team/actions/getTeam: fetch response: `, await response.json())

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

  // console.log(response)

  // if (!response.ok) {
  //   const errorResponse: IApiErrorResponse = await response.json()
  //   console.log(`errorResponse: `, errorResponse)
  //   return { code: errorResponse.code, message: errorResponse.data.error_summary }
  // }
  
  const responseObject = await response.json()
  revalidateTag('team' + teamId)
  // console.log(`responseObject: `, responseObject)
  return responseObject

}

export async function getPartners() {
  const response = await fetch(`${ process.env.LOCAL_API_BASE_URL }/api/partners`, {
    next: {
      tags: ['partners']
    }
  })

  const partners = await response.json()
  return partners
}

export async function getSkus() {
  const response = await fetch(`${ process.env.LOCAL_API_BASE_URL }/api/skus`, {
    next: {
      tags: ['skus']
    }
  })

  const skus = await response.json()
  return skus
}