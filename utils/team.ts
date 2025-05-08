"use server";
import { revalidatePath, revalidateTag } from "next/cache"
import { ISku, ITeamApiResponse, INewTeamData } from "@/types";
import { validateServerActionRole, AuthError, PermissionError, RoleConfigError } from "@/utils/auth/serverActions";

const requestOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `${process.env.API_KEY}`,
  },
}

/**
 * create Team
 * Protected by validateServerActionRole
 * 
 * @param teamData 
 * @returns 
 */
export const createTeam = async (teamData: INewTeamData): Promise<ITeamApiResponse> => {

  try {
    await validateServerActionRole([
      'westtelco-admin',
      'westtelco-agent',
    ]);

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

  } catch (error) {
    console.error("Server Action 'createTeam' failed:", error)
    if (error instanceof AuthError || error instanceof PermissionError || error instanceof RoleConfigError) {
      return { code: 403, error: error.message }; // Return the specific error message
    } else {
      // Handle other potential errors during action execution
      return { code: 500, error: 'An unexpected error occurred while creating the team.' };
    }
  }


}

/**
 * cancelTeam
 * Protected by validateServerActionRole
 * 
 * Sends a request to change the team's active status to FALSE. It returns the team info in successful or a message if not.
 * @param teamId 
 * @returns ITeamAPIResponse | { message: string }
 */
export const cancelTeam = async (teamId: string, resellerIds: Array<string>): Promise<ITeamApiResponse> => {

  try {
    await validateServerActionRole([
      'westtelco-admin',
      'westtelco-agent',
    ]);

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
  } catch (error) {
    console.error("Server Action 'cancelTeam' failed:", error)
    if (error instanceof AuthError || error instanceof PermissionError || error instanceof RoleConfigError) {
      return { code: 403, error: error.message }; // Return the specific error message
    } else {
      // Handle other potential errors during action execution
      return { code: 500, error: 'An unexpected error occurred while canceling the team.' };
    }
  }


}

/**
 * reinstateTeam
 * Protected by validateServerActionRole
 * 
 * Sends a request to change the team's active status to TRUE. It returns the team info in successful or a message if not.
 * @param teamId 
 * @param skus
 * @returns ITeamAPIResponse | { message: string }
 */
export const reinstateTeam = async (teamId: string, skus: Array<ISku>, resellerIds: Array<string> = []): Promise<ITeamApiResponse> => {

  // console.log(`body: `, JSON.stringify({
  //   "id": teamId,
  //   "skus": skus,
  //   "reseller_ids": [resellerIds[1]],
  //   "country": process.env.DISTRIBUITOR_COUNTRY,
  // }))

  try {
    await validateServerActionRole([
      'westtelco-admin',
      'westtelco-agent',
    ]);

    const response = await fetch(`${process.env.API_BASE_URL}/dropboxResellers/v1/team/reinstate`,
      {
        ...requestOptions,
        body: JSON.stringify({
          "id": teamId,
          "skus": skus,
          "environment": process.env.API_ENV,
          "reseller_ids": [resellerIds[1]],
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
      // console.log(`error: `, error)
      return {
        code: error.code,
        message: error.data.error_summary.startsWith('skus_invalid') ?// Dropbox API is so bad... different strings for the same error
          'El cliente fue cancelado fuera del período de gracia, por lo tanto debe reinstaurarse con la misma licencia que tenía antes.' :
          error.data.error_summary
      }
    }
    revalidateTag('team')
    revalidatePath('/team')
    const responseObject = await response.json()
    return responseObject

  } catch (error) {
    console.error("Server Action 'reinstateTeam' failed:", error)
    if (error instanceof AuthError || error instanceof PermissionError || error instanceof RoleConfigError) {
      return { code: 403, error: error.message }; // Return the specific error message
    } else {
      // Handle other potential errors during action execution
      return { code: 500, error: 'An unexpected error occurred while reinstating the team.' };
    }
  }
}
