"use server"
import { IPartner, ITeamData } from "@/types";
import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import { getPartners } from "@/utils/partner";
import { type TGetAllTeamsFromPartnersResult } from "../types/server-actions";

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

/**
 * getAllTeamsFromPartners
 */
export const getAllTeamsFromPartners = async (): Promise<TGetAllTeamsFromPartnersResult> => {
  "use server"

  const partners = await getPartners()

  if ( partners && partners.length >= 1 ) {

    try {
      let allTeams = []

      for (const partner of partners) {
        if (partner && partner.dropbox_reseller_id) {
          
          const result = await fetch(`${process.env.API_BASE_URL}/dropboxResellers/v1/team/list2`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `${process.env.API_KEY}`,
              },
              body: JSON.stringify({
                "environment": process.env.API_ENV,
                "reseller_ids": [partner.dropbox_reseller_id],
                "country": process.env.DISTRIBUITOR_COUNTRY,
              }),
              next: {
                tags: [
                  `reseller-${partner.dropbox_reseller_id}-teams`
                ]
              }
            },
          )

          const currentResult = await result.json()
          
          if (currentResult && currentResult.data && currentResult.data.teams && currentResult.data.teams.length >= 1) {
            
            allTeams.push(currentResult.data.teams)
          }
        }
      }

      if ( allTeams.length < 1 ) {
        return {
          ok: false,
          error: "Hubo un error al intentar obtener los clientes. Intenta actualizar la página.",
        }
      }

      return {
        ok: true,
        data: {
          teams: allTeams.flat(),
          partners: partners
        }
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: error as string,
      }
    }

  } else {
    return {
      ok: false,
      error: "Hubo un error al intentar obtener los clientes. Intenta actualizar la página.",
    }
  }
}

/**
 * getAllTeams
 * 
 * Returns a list of all the teams from all the partners.
 * @param Promise<Array<ITeamData>>
 * @returns redirect(url: string, type?: RedirectType): never
 */
export const getAllTeams = async (): Promise<Array<ITeamData>> => {
  "use server"

  try {
    const allTeams = await fetch(`${process.env.LOCAL_API_BASE_URL}/api/partners/teams`,
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


    if (!allTeams.ok) {
      const error = await allTeams.json()
      console.error(error.message)
      return []
    }
    const responseObject = await allTeams.json()
    if ( responseObject && responseObject.data && responseObject.data.teams && responseObject.data.teams.length >= 1 ) {
      return responseObject.data.teams
    }

    return []

  } catch (error) {
    console.error('There was an error!', error);

    return []
    
  }
}

export const refetchTeams = async (partners: Array<IPartner>) => {
  "use server"
  
  if (partners.length >= 1) {
    partners.forEach((partner) => {
      revalidateTag(`reseller-${partner.dropbox_reseller_id}-teams`)
    })
  }

  revalidateTag('teams')
    
  // return redirect(`/teams`)
}