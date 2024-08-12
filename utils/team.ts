"use server";
import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache"
import { ISku, ITeamApiResponse, ITeamsApiResponse, IApiErrorResponse, INewTeamData, ITeamData } from "@/types";
// import { getPartners } from "./partner";

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
  const resellerId = formData.get('resellerId')
  const urlEncoded = encodeURIComponent(teamId as string)
  if (teamId === 'test-error') {
    return redirect(`/team?message=La b%C3%BAsqueda no obtuvo coincidencias. Intenta de nuevo con otro TEAM ID o contacta a soporte West Telco.`)
  }

  return redirect(`/team/${urlEncoded}?resellerId=${resellerId}`);
}

export const getTeamsOfPartner = async (resellerId: string): Promise<ITeamsApiResponse> => {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/dropboxResellers/v1/team/list2`,
      {
        ...requestOptions,
        body: JSON.stringify({
          "environment": process.env.API_ENV,
          "reseller_ids": [resellerId],
          "country": process.env.DISTRIBUITOR_COUNTRY,
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      return { code: error.code, message: 'Hubo un error al intentar obtener la lista de clientes del partner seleccionado.' }
    }

    const responseObject = await response.json()
    return responseObject
  } catch (error) {
    console.error('There was an error!', error)
    //@ts-ignore
    return { code: 400, message: error.message }
  }
}



export const getAllTeams = async (): Promise<Array<ITeamData>> => {
  "use server"

  try {
    const allTeams = await fetch(`${process.env.LOCAL_API_BASE_URL}/api/teams`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        next: {
          tags: [
            'teams'
          ]
        }
      })

    // console.log(`allTeams: `, await allTeams.json())

    if (!allTeams.ok) {
      const error = await allTeams.json()
      console.error(error.message)
      return []
    }
    const responseObject = await allTeams.json()
    return responseObject

  } catch (error) {
    console.error('There was an error!', error);
    //@ts-ignore
    return []
    // // 1. Get all the partners (resellers)
    // const partners = await getPartners()

    // // 2. Loop through all the partners to get each one's teams
    // if (partners && partners.length >= 1) {
    //   const allTeams = []
    //   for (const partner of partners) {
    //     if ( partner && partner.dropbox_reseller_id ) {
    //       const result = await getTeamsOfPartner(partner.dropbox_reseller_id)
    //       if ( result && result.data && result.data.teams && result.data.teams.length >= 1 ) {
    //         // 3. Assemble all teams into a single array
    //         allTeams.push(result.data.teams)
    //       }
    //     }
    //   }

    //   // 4. Return the array
    //   return allTeams.flat()
    // } 

    // return []
  }
}

/**
 * getTeam
 * 
 * Retrieves from the backend API the information of a team using its teamId and returns it in an object
 * @param teamId string
 * @returns Promise<ITeamApiResponse>
 */
export const getTeam = async (teamId: string, resellerId?: string | null | undefined): Promise<ITeamApiResponse> => {
  console.log(`requestBody: `, JSON.stringify({
    "environment": process.env.API_ENV,
    "id": teamId,
    "reseller_ids": [resellerId],
    "country": process.env.DISTRIBUITOR_COUNTRY,
  }, null, 2))
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/dropboxResellers/v1/team/get`,
      {
        ...requestOptions,
        body: JSON.stringify({
          "environment": process.env.API_ENV,
          "id": teamId,
          "reseller_ids": process.env.API_ENV === "PROD" ? [resellerId] : [],
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

export const createTeam = async (teamData: INewTeamData): Promise<ITeamApiResponse> => {
  try {
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
 * cancelTeam
 * 
 * Sends a request to change the team's active status to FALSE. It returns the team info in successful or a message if not.
 * @param teamId 
 * @returns ITeamAPIResponse | { message: string }
 */
export const cancelTeam = async (teamId: string, resellerIds: Array<string>): Promise<ITeamApiResponse> => {


  // console.log(`body: `, JSON.stringify({
  //   "id": teamId,
  //   "reseller_ids": resellerIds
  // }))
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/dropboxResellers/v1/team/cancel`,
      {
        ...requestOptions,
        body: JSON.stringify({
          "id": teamId,
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

/**
 * modifyTeamSkus
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
  // console.log(`modifyTeamSkus props: teamId:${teamId}, currentSkus: ${JSON.stringify(currentSkus)}, newSkus: ${JSON.stringify(newSkus)}, forceImmediate: ${forceImmediate}`)
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/dropboxResellers/v1/team/skus/modify`,
      {
        ...requestOptions,
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

    if (!response.ok) {
      const errorResponse: IApiErrorResponse = await response.json()
      console.log(`errorResponse: `, errorResponse)
      return { code: errorResponse.code, message: errorResponse.data.error_summary }
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