export const dynamic = 'force-dynamic' // defaults to auto
export const revalidate = 120

export async function GET(request: Request) {

  const response = await fetch(`${process.env.LOCAL_API_BASE_URL}/api/partners`)

  if (response) {
    const { data } = await response.json()
    // console.log(`data: `, data)

    if (data && data.length >= 1) {
      const allTeams = []
      for (const partner of data) {
        if (partner && partner.dropbox_reseller_id) {
          const result = await fetch(`${process.env.LOCAL_API_BASE_URL}/api/partners/${ partner.dropbox_reseller_id }/teams`)
          const currentResult = await result.json()
          
          if (currentResult && currentResult.data && currentResult.data.teams && currentResult.data.teams.length >= 1) {
            allTeams.push(currentResult.data.teams)
          }
        }
      }

      // console.log(`allTeams: `, allTeams)

      return Response.json({
        code: 200,
        status: 'OK',
        data: {
          teams: allTeams.flat()
        }
      })
    }

  }
}