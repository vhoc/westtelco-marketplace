export const dynamic = 'force-dynamic' // defaults to auto

const requestOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `${process.env.API_KEY}`,
  },
}

/**
 * /api/partners/[resellerId]/teams
 * 
 * Obtains all the teams of a particular reseller/partner.
 * 
 * @param request 
 * @param resellerId 
 * @returns 
 */
export async function GET(
  request: Request,
  { params }: { params: { resellerId: string } }
) {

  const resellerId = params.resellerId

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/dropboxResellers/v1/team/list2`,
      {
        ...requestOptions,
        body: JSON.stringify({
          "environment": process.env.API_ENV,
          "reseller_ids": [resellerId],
          "country": process.env.DISTRIBUITOR_COUNTRY,
        }),
        cache: 'no-store',
      },
    )
  
    if (!response.ok) {
      return Response.json(
        {
          error: "No se pudo obtener la lista de clientes para éste partner.",
          status: response.status
        }
      )
    }

    const data = await response.json()
    
    return Response.json(data, { status: 200 })
  
  } catch (error) {
    console.error("Error fetching data:", error);
    return Response.json(
      { error: "Ha ocurrido un error inesperado" },
      { status: 500 }
    );
  }

}