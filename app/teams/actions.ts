"use server"
import { getPartners } from "@/utils/partner";
import { type TGetAllTeamsFromPartnersResult } from "../types/server-actions";
import { validateServerActionRole, AuthError, PermissionError, RoleConfigError } from "@/utils/auth/serverActions";


/**
 * getAllTeamsFromPartners
 * Protected by validateServerActionRole
 */
export const getAllTeamsFromPartners = async (): Promise<TGetAllTeamsFromPartnersResult> => {
  "use server"

  try {
    await validateServerActionRole([
      'westtelco-admin',
      'westtelco-agent',
      'westtelco-limited'
    ]);

    const partners = await getPartners()

    if (partners && partners.length >= 1) {

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

        if (allTeams.length < 1) {
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


  } catch (error) {
    console.error("Server Action 'getAllTeamsFromPartners' failed:", error)
    if (error instanceof AuthError || error instanceof PermissionError || error instanceof RoleConfigError) {
      return { ok: false, error: error.message }; // Return the specific error message
    } else {
      // Handle other potential errors during action execution
      return { ok: false, error: 'An unexpected error occurred while fetching the teams.' };
    }
  }


}

/**
 * getAllTeamsFromPartners for DEV mode
 */
export const getAllTeamsFromPartnersDev = async (): Promise<TGetAllTeamsFromPartnersResult> => {
  "use server"

  const partners = await getPartners()

  if (partners && partners.length >= 1) {

    try {
      let allTeams = []

      for (const partner of partners) {
        if (partner) {

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
                "reseller_ids": [],
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

      if (allTeams.length < 1) {
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
