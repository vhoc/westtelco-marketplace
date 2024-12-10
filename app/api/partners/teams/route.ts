export const dynamic = 'force-dynamic' // defaults to auto
// export const revalidate = 1440

export async function GET(request: Request) {

  const response = await fetch(`${process.env.LOCAL_API_BASE_URL}/api/partners`, 
    // { cache: 'no-store' }
  )

  if (response) {
    const { data } = await response.json()

    if (data && data.length >= 1) {
      const allTeams = []
      for (const partner of data) {
        if (partner && partner.dropbox_reseller_id) {
          const result = await fetch(`${process.env.LOCAL_API_BASE_URL}/api/partners/${ partner.dropbox_reseller_id }/teams`, 
            {
              // KEY IS HERE
              cache: 'no-store',
              next: {
                tags: [
                  `reseller-${partner.dropbox_reseller_id}-teams`
                ]
              }
            }
          )
          const currentResult = await result.json()
          // console.log(`currentResult: `, currentResult)
          
          if (currentResult && currentResult.data && currentResult.data.teams && currentResult.data.teams.length >= 1) {
            
            // if (currentResult.data.teams.find(item => item.reseller_ids[1] === "GJAJHK2J2M")) {
            //   console.log(`currentResult: `, currentResult.data.teams.length)
            // }
            

            allTeams.push(currentResult.data.teams)
          }
        }
      }

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