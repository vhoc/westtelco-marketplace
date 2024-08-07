import { getTeamsOfPartner } from "@/utils/team"

export const dynamic = 'force-dynamic' // defaults to auto
export const revalidate = 120

export async function GET(request: Request) {

  const response = await fetch(`${process.env.LOCAL_API_BASE_URL}/api/partners`)

  if (response) {
    const { data } = await response.json()

    if (data && data.length >= 1) {
      const allTeams = []
      for (const partner of data) {
        if (partner && partner.dropbox_reseller_id) {
          const result = await getTeamsOfPartner(partner.dropbox_reseller_id)
          if (result && result.data && result.data.teams && result.data.teams.length >= 1) {
            // 3. Assemble all teams into a single array
            allTeams.push(result.data.teams)
          }
        }
      }

      return Response.json(allTeams.flat())
    }

  }
}