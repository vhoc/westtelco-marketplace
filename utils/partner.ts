"use server"

import { IPartner } from "@/types"
import { createClient } from "./supabase/server"

// Currently unused
//
// export const getPartner = async (resellerId: string): Promise<IPartnerApiResponse> => {
//   const supabase = await createClient()

//   const { data, error } = await supabase
//     .from('partner')
//     .select('*')
//     .eq('dropbox_reseller_id', resellerId)
//     .single()

//   if (error) {
//     console.error(`Error retrieving partner from database: `, error)
//     return {
//       code: 400,
//       message: error.message
//     }
//   }

//   return {
//     code: 200,
//     data: data
//   }
// }

/**
 * Retrieves partners from the database.
 * If resellerIds is provided, it filters the partners by those resellerIds,
 * otherwise it returns all the partners.
 * @param resellerIds 
 * @returns 
 */
export const getPartners = async (resellerIds?: Array<string> | undefined): Promise<Array<IPartner>> => {
  "use server"
  const supabase = await createClient()

  if (resellerIds && resellerIds.length >= 1) {
    const { data, error } = await supabase
      .from('partner')
      .select('*')
      .in('dropbox_reseller_id', resellerIds)
      .eq('distribuitor_id', process.env.DISTRIBUITOR_INTERNAL_ID)

    if (error) {
      console.error(`Error retrieving partners from database: `, error)
      return []
    }
    // console.log(`getPartners data: `, data)
    return data
  } else {
    const { data, error } = await supabase
      .from('partner')
      .select('*')
      .eq('distribuitor_id', process.env.DISTRIBUITOR_INTERNAL_ID)

    if (error) {
      console.error(`Error retrieving partners from database: `, error)
      return []
    }
    // console.log(`getPartners data: `, data)
    return data
  }


}

