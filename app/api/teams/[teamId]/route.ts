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
 * GET /api/teams/[teamId]
 * 
 * Obtains the data of a particular team
 * 
 * @param request 
 * @param teamId 
 */
export async function GET(
  request: Request,
  { params }: { params: { teamId: string } }
) {

  const url = new URL(request.url);
  const resellerId = url.searchParams.get('resellerId');

  const teamId = params.teamId
  const resellerIds = process.env.API_ENV === "PROD" ? [resellerId] : [] // If we're calling the TEST environment, send an empty array.
  // console.log(`DEBUG: app/api/teams/[teamId]::GET params: `, params)
  // console.log(`DEBUG: app/api/teams/[teamId]::GET resellerId: `, resellerId)
  // console.log(`DEBUG: app/api/teams/[teamId]::GET params.teamId: `, params.teamId)
  // console.log(`DEBUG: app/api/teams/[teamId]::GET params.resellerId: `, params.resellerId)

  // console.log(`DEBUG: app/api/teams/[teamId]::GET fetch call: `, JSON.stringify({
  //   fetchUrl: `${process.env.API_BASE_URL}/dropboxResellers/v1/team/get`,
  //   body: {
  //     "environment": process.env.API_ENV,
  //     "id": teamId,
  //     "reseller_ids": resellerIds,
  //     "country": process.env.DISTRIBUITOR_COUNTRY,
  //   }
  // }, null, 1))


  try {
    const response = await fetch(`${process.env.API_BASE_URL}/dropboxResellers/v1/team/get`,
      {
        ...requestOptions,
        body: JSON.stringify({
          "environment": process.env.API_ENV,
          "id": teamId,
          "reseller_ids": resellerIds,
          "country": process.env.DISTRIBUITOR_COUNTRY,
        }),
        next: {
          tags: [
            'team' + teamId
          ]
        }
      }
    )

    // This causes a Body is unusable error if it remains uncommented.
    // console.log(`DEBUG: app/api/teams/[teamId]::GET fetch response: `, await response.json())

    if (!response.ok) {
      return Response.json(
        {
          error: "No se pudo obtener los detalles de éste cliente.",
          status: response.status
        }
      )
    }

    revalidateTag('team' + teamId)

    const data = await response.json()
    // console.log(`data: `, data)
    return Response.json(data, { status: 200 })

  } catch (error) {
    console.error("Error fetching team's data:", error)
    return Response.json(
      { error: "Ha ocurrido un error inesperado" },
      { status: 500 }
    )
  }

}

/**
 * PUT /api/teams/[teamId]
 * 
 * Updates a team
 */
export async function PUT(request: Request) {

  const requestBody = await request.json()
  // console.log(`requestBody: `, requestBody)

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/dropboxResellers/v1/team/skus/modify`,
      {
        ...requestOptions,
        body: JSON.stringify(requestBody),
      }
    )

    if (!response.ok) {
      return Response.json(
        {
          error: `No se pudo realizar el cambio en el cliente. ${response.statusText}`,
          stauts: response.status
        }
      )
    }

    revalidateTag('team' + requestBody.id)
    // const responseObject = await response.json()
    // return responseObject
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