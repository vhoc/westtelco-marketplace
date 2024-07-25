"use server";
import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache"
import { ISku, ITeamApiResponse, IApiErrorResponse, INewTeamData } from "@/types";

const requestOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `${process.env.API_KEY}`,
  },
}

/**
 * navigateToTeam
 * 
 * Redirects to the team page from which the team will be loaded
 * @param formData
 * @returns redirect(url: string, type?: RedirectType): never
 */
export const navigateToTeam = async (formData: FormData) => {
  const teamId = formData.get('teamId')
  const urlEncoded = encodeURIComponent(teamId as string)
  if (teamId === 'test-error') {
    return redirect(`/team?message=La b%C3%BAsqueda no obtuvo coincidencias. Intenta de nuevo con otro TEAM ID o contacta a soporte West Telco.`)
  }

  return redirect(`/team/${urlEncoded}`);
}

/**
 * getTeam
 * 
 * Retrieves from the backend API the information of a team using its teamId and returns it in an object
 * @param teamId string
 * @returns Promise<ITeamApiResponse>
 */
export const getTeam = async (teamId: string): Promise<ITeamApiResponse> => {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/dropboxResellers/v1/team/get`,
      {
        ...requestOptions,
        body: JSON.stringify({
          "environment": process.env.API_ENV,
          "id": teamId,
          "reseller_ids": [],
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
      return { code: error.code, message: 'No se encontró un cliente con ese ID, verifica que lo hayas ingresado correctamente o que el cliente exista.' }
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

export const createTeam = async ( teamData: INewTeamData ): Promise<ITeamApiResponse> => {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/dropboxResellers/v1/team/create`, {
      ...requestOptions,
      body: JSON.stringify({
        ...teamData,
        "environment": process.env.API_ENV,
        "reseller_ids": [],
      }),
      next: {
        tags: [
          'team'
        ]
      }
    })

    if (!response.ok) {
      const error = await response.json()
      console.log(`response error: `, error)
      return { code: error.code, message: error.data.user_message.text ? error.data.user_message.text : error.data ? error.data : 'Hubo un error al intentar crear el cliente.' }
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

/**
 * modifyTeamSkus
 * 
 * Sends a modify request to change the SKU's of a team to the backend API, and returns the updated team info.
 * @param teamId string
 * @param currentSkus Array<ISku>
 * @param newSkus Array<ISku>
 * @param forceImmediate boolean
 * @return Promise<ITeamApiResponse>
 */
export const modifyTeamSkus = async (teamId: string, currentSkus: Array<ISku>, newSkus: Array<ISku>, forceImmediate: boolean = false): Promise<ITeamApiResponse> => {
  console.log(`modifyTeamSkus props: teamId:${teamId}, currentSkus: ${JSON.stringify(currentSkus)}, newSkus: ${JSON.stringify(newSkus)}, forceImmediate: ${forceImmediate}`)
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/dropboxResellers/v1/team/skus/modify`,
      {
        ...requestOptions,
        body: JSON.stringify({
          "environment": process.env.API_ENV,
          "id": teamId,
          "current_skus": currentSkus,
          "new_skus": newSkus,
          "reseller_ids": [],
          "force_immediate": forceImmediate,
        })
      }
    )

    if (!response.ok) {
      const errorResponse: IApiErrorResponse = await response.json()
      console.log(`errorResponse: `, errorResponse)
      return { code: errorResponse.code, message: errorResponse.data.error_summary }
    }
    revalidateTag('team')
    const responseObject = await response.json()
    // console.log( `modifyTeamSkus response: `, responseObject )
    return responseObject

  } catch (error) {
    console.error('There was an error!', error);
    //@ts-ignore
    return { code: 400, message: error.message }
  }
}

