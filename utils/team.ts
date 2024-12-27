"use server";
import { revalidateTag } from "next/cache"
import { ISku, ITeamApiResponse, INewTeamData } from "@/types";

const requestOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `${process.env.API_KEY}`,
  },
}

export const createTeam = async (teamData: INewTeamData): Promise<ITeamApiResponse> => {

  const response = await fetch(`${process.env.API_BASE_URL}/dropboxResellers/v1/team/create`, {
    ...requestOptions,
    body: JSON.stringify({
      ...teamData,
      "environment": process.env.API_ENV,
      "country": process.env.DISTRIBUITOR_COUNTRY,
    }),
    next: {
      tags: [
        'team'
      ]
    }
  })


  if (!response.ok) {
    const error = await response.json()

    return { code: error.code, message: error.data.user_message?.text ? error.data.user_message.text : error.data ? error.data : 'Hubo un error al intentar crear el cliente.' }
  }
  revalidateTag('team')
  const responseObject = await response.json()
  return responseObject

}

/**
 * cancelTeam
 * 
 * Sends a request to change the team's active status to FALSE. It returns the team info in successful or a message if not.
 * @param teamId 
 * @returns ITeamAPIResponse | { message: string }
 */
export const cancelTeam = async (teamId: string, resellerIds: Array<string>): Promise<ITeamApiResponse> => {

  const response = await fetch(`${process.env.API_BASE_URL}/dropboxResellers/v1/team/cancel`,
    {
      ...requestOptions,
      body: JSON.stringify({
        "id": teamId,
        "environment": process.env.API_ENV,
        "reseller_ids": [resellerIds.find(resellerId => resellerId !== process.env.DISTRIBUITOR_ID)],// Select only the reseller ID that is not the distribuitor's
        "country": process.env.DISTRIBUITOR_COUNTRY,
      }),
      next: {
        tags: [
          'team'
        ]
      }
    }
  )


  if (!response.ok) {
    const error = await response.json()
    const errorMessage = error && error.data && error.data.error_summary ? error.data.error_summary : 'Error desconocido al intentar suspender al cliente.'
    return { code: error.code, message: errorMessage }
  }
  revalidateTag('team')
  const responseObject = await response.json()
  return responseObject

}

/**
 * reinstateTeam
 * 
 * Sends a request to change the team's active status to TRUE. It returns the team info in successful or a message if not.
 * @param teamId 
 * @param skus
 * @returns ITeamAPIResponse | { message: string }
 */
export const reinstateTeam = async (teamId: string, skus: Array<ISku>, resellerIds: Array<string> = []): Promise<ITeamApiResponse> => {

  console.log(`body: `, JSON.stringify({
    "id": teamId,
    "skus": skus,
    "reseller_ids": resellerIds,
    "country": process.env.DISTRIBUITOR_COUNTRY,
  }))
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/dropboxResellers/v1/team/reinstate`,
      {
        ...requestOptions,
        body: JSON.stringify({
          "id": teamId,
          "skus": skus,
          "environment": process.env.API_ENV,
          "reseller_ids": [],
          "country": process.env.DISTRIBUITOR_COUNTRY,
        }),
        next: {
          tags: [
            'team'
          ]
        }
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.log(error)
      return { code: error.code, message: error.error_summary }
    }
    revalidateTag('team')
    const responseObject = await response.json()
    return responseObject

  } catch (error) {
    console.error('There was an error!', error);
    //@ts-ignore
    return { code: 400, message: error.message }
  }
}
