"use server"
import { ITeamData } from "@/types"

/**
 * Fetches a team's data
 */
export const getTeam = async (teamId: string, resellerId?: string | null | undefined) => {
  "use server"

    const response = await fetch(`${process.env.LOCAL_API_BASE_URL}/api/teams/${teamId}${ resellerId && resellerId.length>=1 ? `?resellerId=${resellerId}` : '' }`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
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
    return Response.json(data, { status: 200 })

}