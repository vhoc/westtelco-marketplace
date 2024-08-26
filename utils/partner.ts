"use server"

import { IPartner, IPartnerApiResponse } from "@/types"
import { createClient } from "./supabase/server"

export const getPartner = async (resellerId: string): Promise<IPartnerApiResponse> => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('partner')
    .select('*')
    .eq('dropbox_reseller_id', resellerId)
    .single()

  if (error) {
    console.error(`Error retrieving partner from database: `, error)
    return {
      code: 400,
      message: error.message
    }
  }

  return {
    code: 200,
    data: data
  }
}

export const getPartners = async (resellerIds?: Array<string> | undefined): Promise<Array<IPartner>> => {
  "use server"
  const supabase = createClient()

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
    console.log(`getPartners data: `, data)
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

    return data
  }


  return []
}

