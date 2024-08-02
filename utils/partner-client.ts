"use client"

import { IPartner } from "@/types"
import { createClient } from "./supabase/client"

export const getPartners = async (): Promise<Array<IPartner>> => {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('partner')
    .select('*')

  if (error) {
    console.error(`Error retrieving partners from database: `, error)
    return []
  }
  return data
}

