"use server"
import { INewTeamData, ISku, ITeamApiResponse, ISkuInfo } from "@/types"
import { revalidateTag } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { TGetTeamDataResult } from "../types/server-actions"
import { getSkuInfo } from "@/utils/licenses"
import { getRemainingTime } from "@/utils/time"
import { getPartners as getPartnersByResellerIds } from "@/utils/partner"

const requestOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `${process.env.API_KEY}`,
  },
}

/**
 * Fetches a team's data
 */
export const getTeam = async (teamId: string, resellerId?: string | null | undefined) => {
  "use server"
  revalidateTag('team' + teamId)

  const fetchUrl = resellerId ? `${process.env.LOCAL_API_BASE_URL}/api/teams/${teamId}?resellerId=${resellerId}`
    : `${process.env.LOCAL_API_BASE_URL}/api/teams/${teamId}`

  console.log(`fetchUrl: `, fetchUrl)


  const response = await fetch(fetchUrl,
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      next: {
        tags: [
          'team' + teamId
        ]
      }
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
  revalidateTag('team' + teamId)
  return Response.json(data, { status: 200 })

}

/**
 * Modify a team's SKUs
 * 
 * Sends a modify request to change the SKU's of a team to the backend API, and returns the updated team info.
 * @param teamId string
 * @param currentSkus Array<ISku>
 * @param newSkus Array<ISku>
 * @param forceImmediate boolean
 * @param resellerIds Array<string>
 * @return Promise<ITeamApiResponse>
 */
export const modifyTeamSkus = async (teamId: string, currentSkus: Array<ISku>, newSkus: Array<ISku>, forceImmediate: boolean = false, resellerIds: Array<string> = []): Promise<ITeamApiResponse> => {
  "use server"

  const response = await fetch(`${process.env.LOCAL_API_BASE_URL}/api/teams/${teamId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `${process.env.API_KEY}`,
      },
      body: JSON.stringify({
        "environment": process.env.API_ENV,
        "country": process.env.DISTRIBUITOR_COUNTRY,
        "id": teamId,
        "current_skus": currentSkus,
        "new_skus": newSkus,
        "reseller_ids": resellerIds,
        "force_immediate": forceImmediate,
      })
    }
  )

  const responseObject = await response.json()
  revalidateTag('team' + teamId)
  return responseObject

}

export const modifyTeamAutorenew = async (teamId: string, currentSkus: Array<ISku>,  auto_renew: boolean, resellerIds: Array<string> = []): Promise<ITeamApiResponse> => {
  "use server"

  const response = await fetch(`${process.env.API_BASE_URL}/dropboxResellers/v1/team/auto_renew/modify`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `${process.env.API_KEY}`,
      },
      body: JSON.stringify({
        "environment": process.env.API_ENV,
        "id": teamId,
        "reseller_ids" : resellerIds,
        "new_auto_renew": auto_renew,
        "country": process.env.DISTRIBUITOR_COUNTRY
      })
    }
  )

  const responseObject = await response.json()
  // console.log('responseObject: ', responseObject)
  revalidateTag('team' + teamId)
  return responseObject
}

export async function getPartners() {
  const response = await fetch(`${process.env.LOCAL_API_BASE_URL}/api/partners`, {
    next: {
      tags: ['partners']
    }
  })

  const partners = await response.json()
  return partners
}

export async function getSkus(): Promise<{data: Array<ISkuInfo>}> {
  const response = await fetch(`${process.env.LOCAL_API_BASE_URL}/api/skus`, {
    next: {
      tags: ['skus']
    }
  })

  const skus = await response.json()
  return skus
}

/**
 * Obtains the team from the database (supabase)
 * @param teamId 
 * @returns 
 */
export const getTeamFromDatabase = async (teamId: string) => {

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('team')
    .select('*')
    .eq('team_id', teamId)
    .single()

  if (error) {
    console.error(error)
  }

  return { data, error }
}

/**
 * Updates the admin_email field of the team in the database (supabase)
 * @param teamId 
 * @param teamData 
 * @returns 
 */
export const updateDbTeamAdminEmail = async (teamId: string, admin_email: string) => {
  const supabase = await createClient()
  const { data, error }: { data: INewTeamData | null, error: any } = await supabase
    .from('team')
    .update({ admin_email })
    .eq('team_id', teamId)
    .select()
    .single()

  if (error) {
    console.error(error)
  }

  return { data, error }
}

/**
 * Returns all the team data needed for the /team/[id] page
 * @returns { data, error }
 */
export const fetchTeamPageData = async (teamId: string, resellerId?: string | null | undefined): Promise<TGetTeamDataResult> => {
  "use server"

  const requestResellerIds = process.env.API_ENV === "PROD" && resellerId && resellerId.length >= 1 ? [resellerId] : []
  // console.log(`DEBUG: app/team/actions/fetchTeam: teamId: `, teamId)
  // console.log(`DEBUG: app/team/actions/fetchTeam: resellerId: `, resellerId)
  // console.log(`DEBUG: requestBody: `, JSON.stringify({
  //   "environment": process.env.API_ENV,
  //   "id": teamId,
  //   "reseller_ids": resellerIds,
  //   "country": process.env.DISTRIBUITOR_COUNTRY,
  // }))

  try {
    // 1. Get team data from Dropbox API
    const response = await fetch(`${process.env.API_BASE_URL}/dropboxResellers/v1/team/get`,
      {
        ...requestOptions,
        body: JSON.stringify({
          "environment": process.env.API_ENV,
          "id": teamId,
          "reseller_ids": requestResellerIds,
          "country": process.env.DISTRIBUITOR_COUNTRY,
        }),
        cache: 'no-store',
        next: {
          tags: [
            'team' + teamId
          ]
        }
      }
    )

    if (!response.ok) {
      const teamResponse = await response.json()
      console.log(`teamResponse: `, teamResponse)
      throw new Error('TEAMRESPONSE_FETCH_ERROR')
    }

    const teamResponse = await response.json()
    // console.log(`teamResponse: `, teamResponse)
    
    // 2. Get team data from database
    const { data: teamDataFromDatabase} = await getTeamFromDatabase(teamId)
      .catch(() => { throw new Error('TEAMDATABASE_FETCH_ERROR') })

    // 3. Isolate the base SKU
    const baseSku: ISku | undefined = teamResponse.data?.current_state.skus.filter((sku: ISku) => sku.sku_id.startsWith('TEAM-') || sku.sku_id.startsWith('EDU-') || sku.sku_id.startsWith('ENT-'))[0]
    if (!baseSku) throw new Error('BASESKU_FETCH_ERROR')

    // 4. Get the base SKU's info and Renewal SKU's info
    const skuInfo = await getSkuInfo(baseSku?.sku_id)
      .catch(() => { throw new Error('SKU_INFO_FETCH_ERROR') })

    const renewalSkuInfo: ISkuInfo | null = teamResponse.data.renewal_state && await getSkuInfo(teamResponse.data?.renewal_state?.skus[0]?.sku_id)
      .catch(() => { throw new Error('RENEWALSKU_INFO_FETCH_ERROR') })
    

    // 5. Prepare reseller IDs array
    const resellerIds: Array<string> = teamResponse.data?.reseller_ids ?? []

    // 6. Calculate the remaining time in human language format.
    const remainingTime = getRemainingTime(teamResponse.data?.end_datetime ?? 'Hoy')

    // 7. Get the partners
    const partners = await getPartnersByResellerIds(resellerIds || [])
      .catch(() => { throw new Error('PARTNERS_FETCH_ERROR') })

    // 8. Retrieve all SKUs from the database
    const { data: allSkus } = await getSkus()
      .catch(() => { throw new Error('SKUS_FETCH_ERROR') })


    // Return all the data
    return {
      ok: true,
      data: {
        teamDataFromDropbox: teamResponse.data,
        teamDataFromDatabase: teamDataFromDatabase,
        baseSku: baseSku,
        skuInfo: skuInfo,
        renewalSkuInfo: renewalSkuInfo,
        resellerIds: resellerIds,
        partners: partners,
        allSkus: allSkus,
        remainingTime: remainingTime,
      }
    }
  
  } catch (error: any) {
    console.error("There was an error!", error);

    switch(error.message) {
      case 'TEAMRESPONSE_FETCH_ERROR':
        return {
          ok: false,
          error: "No se pudo obtener los datos del cliente desde Dropbox. Por favor, intenta de nuevo."
        }
      case 'TEAMDATABASE_FETCH_ERROR':
        return {
          ok: false,
          error: "No se pudo obtener los datos del cliente desde la base de datos. Por favor, intenta de nuevo."
        }
      case 'BASESKU_FETCH_ERROR':
        return {
          ok: false,
          error: "Hubo un error al obtener el SKU base. Por favor, intenta de nuevo."
        }
      case 'SKU_INFO_FETCH_ERROR':
        return {
          ok: false,
          error: "Hubo un error al obtener la información del SKU. Por favor, intenta de nuevo."
        }
      case 'RENEWALSKU_INFO_FETCH_ERROR':
        return {
          ok: false,
          error: "Hubo un error al obtener la información del SKU de renovación. Por favor, intenta de nuevo."
        }
      case 'PARTNERS_FETCH_ERROR':
        return {
          ok: false,
          error: "Hubo un error al obtener los partners vinculados al cliente. Por favor, intenta de nuevo."
        }
      case 'SKUS_FETCH_ERROR':
        return {
          ok: false,
          error: "Hubo un error al obtener los SKUs existetes. Por favor, intenta de nuevo."
        }
      default:
        return {
          ok: false,
          error: "Ha ocurrido un error inesperado."
        }
    }
  }

  return {
    ok: false,
    error: "No se pudieron obtener los datos del cliente."
  }
}


export async function fixMissingTeamData(teamId: string, name: string, dropbox_reseller_id: string, contract_start: string) {
  "use server"
  // const requestResellerIds = process.env.API_ENV === "PROD" ? [dropbox_reseller_id] : []
  const supabase = await createClient()  

  const { data, error } = await supabase
    .from('team')
    .insert([
      {
        team_id: teamId,
        name: name,
        dropbox_reseller_id: dropbox_reseller_id,
        contract_start: contract_start,
        provisioning_method: "API",
        distribuitor_id: process.env.DISTRIBUITOR_INTERNAL_ID,
      }
    ])
    .select()

  if ( error ) {
    console.error(error)
    return {
      ok: false,
      error: `No se pudieron agregar los datos del cliente en la base de datos. Por favor, reporte el problema a Desarrollo indicando el id del cliente (${teamId}) y el reseller id (${dropbox_reseller_id}).`
    }
  }

  return {
    ok: true,
    data: data
  }
}
