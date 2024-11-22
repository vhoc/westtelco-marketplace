"use server";
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



// export const getTeamsOfPartner = async (resellerId: string): Promise<ITeamsApiResponse> => {
//   try {
//     const response = await fetch(`${process.env.API_BASE_URL}/dropboxResellers/v1/team/list2`,
//       {
//         ...requestOptions,
//         body: JSON.stringify({
//           "environment": process.env.API_ENV,
//           "reseller_ids": [resellerId],
//           "country": process.env.DISTRIBUITOR_COUNTRY,
//         }),
//       }
//     )

//     if (!response.ok) {
//       const error = await response.json()
//       return { code: error.code, message: 'Hubo un error al intentar obtener la lista de clientes del partner seleccionado.' }
//     }

//     const responseObject = await response.json()
//     return responseObject
//   } catch (error) {
//     console.error('There was an error!', error)
//     //@ts-ignore
//     return { code: 400, message: error.message }
//   }
// }

/**
 * getTeam
 * 
 * Retrieves from the backend API the information of a team using its teamId and returns it in an object
 * @param teamId string
 * @returns Promise<ITeamApiResponse>
 */
// export const getTeam = async (teamId: string, resellerId?: string | null | undefined): Promise<ITeamApiResponse> => {
//   console.log(`requestBody: `, JSON.stringify({
//     "environment": process.env.API_ENV,
//     "id": teamId,
//     "reseller_ids": [resellerId],
//     "country": process.env.DISTRIBUITOR_COUNTRY,
//   }, null, 2))
//   try {
//     const response = await fetch(`${process.env.API_BASE_URL}/dropboxResellers/v1/team/get`,
//       {
//         ...requestOptions,
//         body: JSON.stringify({
//           "environment": process.env.API_ENV,
//           "id": teamId,
//           "reseller_ids": process.env.API_ENV === "PROD" ? [resellerId] : [],
//           "country": process.env.DISTRIBUITOR_COUNTRY,
//         }),
//         next: {
//           tags: [
//             'team'
//           ]
//         }
//       }
//     )

//     if (!response.ok) {
//       const error = await response.json()
//       return { code: error.code, message: 'No se encontró un cliente con ese ID, verifica que lo hayas ingresado correctamente o que el cliente exista.' }
//     }
//     revalidateTag('team')
//     const responseObject = await response.json()
//     return responseObject

//   } catch (error) {
//     console.error('There was an error!', error);
//     //@ts-ignore
//     return { code: 400, message: error.message }
//   }
// }

export const createTeam = async (teamData: INewTeamData): Promise<ITeamApiResponse> => {
  // console.log(`teamData: `, JSON.stringify({
  //   ...teamData,
  //   "environment": process.env.API_ENV,
  //   "country": process.env.DISTRIBUITOR_COUNTRY,
  // }))

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
  // console.log(`Newly created team: `, JSON.stringify(responseObject, null, 1))
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


  // console.log(`body: `, JSON.stringify({
  //   "id": teamId,
  //   "reseller_ids": resellerIds
  // }))
  // try {
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

  // console.log(`response: `, await response.json())

  if (!response.ok) {
    const error = await response.json()
    const errorMessage = error && error.data && error.data.error_summary ? error.data.error_summary : 'Error desconocido al intentar suspender al cliente.'
    // console.log(`Error: `, error)
    return { code: error.code, message: errorMessage }
  }
  revalidateTag('team')
  const responseObject = await response.json()
  // console.log(`responseObject: `, responseObject)
  return responseObject

  // } catch (error) {
  //   console.error('There was an error!', error);
  //   //@ts-ignore
  //   return { code: 400, message: error.message }
  // }
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

// /**
//  * modifyTeamSkus
//  * 
//  * Sends a modify request to change the SKU's of a team to the backend API, and returns the updated team info.
//  * @param teamId string
//  * @param currentSkus Array<ISku>
//  * @param newSkus Array<ISku>
//  * @param forceImmediate boolean
//  * @param resellerIds Array<string>
//  * @return Promise<ITeamApiResponse>
//  */
// export const modifyTeamSkus = async (teamId: string, currentSkus: Array<ISku>, newSkus: Array<ISku>, forceImmediate: boolean = false, resellerIds: Array<string> = []): Promise<ITeamApiResponse> => {
//   // console.log(`modifyTeamSkus props: teamId:${teamId}, currentSkus: ${JSON.stringify(currentSkus)}, newSkus: ${JSON.stringify(newSkus)}, forceImmediate: ${forceImmediate}`)
//   try {
//     const response = await fetch(`${process.env.API_BASE_URL}/dropboxResellers/v1/team/skus/modify`,
//       {
//         ...requestOptions,
//         body: JSON.stringify({
//           "environment": process.env.API_ENV,
//           "country": process.env.DISTRIBUITOR_COUNTRY,
//           "id": teamId,
//           "current_skus": currentSkus,
//           "new_skus": newSkus,
//           "reseller_ids": resellerIds,
//           "force_immediate": forceImmediate,
//         })
//       }
//     )

//     if (!response.ok) {
//       const errorResponse: IApiErrorResponse = await response.json()
//       console.log(`errorResponse: `, errorResponse)
//       return { code: errorResponse.code, message: errorResponse.data.error_summary }
//     }
//     revalidateTag('team')
//     const responseObject = await response.json()
//     return responseObject

//   } catch (error) {
//     console.error('There was an error!', error);
//     //@ts-ignore
//     return { code: 400, message: error.message }
//   }
// }