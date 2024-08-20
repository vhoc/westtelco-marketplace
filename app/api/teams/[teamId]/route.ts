import { revalidateTag } from "next/cache"

const requestOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `${process.env.API_KEY}`,
  },
}

/**
 * /api/teams/[teamId]
 * 
 * Obtains the data of a particular team
 * 
 * @param request 
 * @param teamId 
 */
export async function GET(
  request: Request,
  { params }: { params: { teamId: string, resellerId: string } }
) {

  const teamId = params.teamId
  const resellerIds = process.env.API_ENV === "PROD" ? [params.resellerId] : [] // If we're calling the TEST environment, send an empty array.

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/dropboxResellers/v1/team/get`,
      {
        ...requestOptions,
        body: JSON.stringify({
          "environment": process.env.API_ENV,
          "id": teamId,
          "resellerIds": resellerIds,
          "country": process.env.DISTRIBUITOR_COUNTRY,
        }),
        next: {
          tags: [
            `team-${teamId}`
          ]
        }
      }
    )

    if (!response.ok) {
      return Response.json(
        {
          error: "No se pudo obtener los detalles de éste cliente.",
          status: response.status
        }
      )
    }

    revalidateTag(`team-${teamId}`)

    const data = await response.json()
    return Response.json(data, { status: 200 })

  } catch (error) {
    console.error("Error fetching team's data:", error)
    return Response.json(
      { error: "Ha ocurrido un error inesperado" },
      { status: 500 }
    )
  }

}