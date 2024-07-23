"use client"
import { ISku, IAddon, IAddonApiResponse, ISkuInfoResponse } from "@/types";
import { createClient } from "./supabase/client";

export const filterLicenseType = (skus: Array<ISku>, type: "regular" | "addon") => {
  "use client"
  const regularPrefixes = ["TEAM-", "TEAMLIC-", "EDU-", "EDULIC-"]
  const addonPrefixes = ["TEAMADD-", "EDUADD-"]

  let result = []

  if (type === "regular") {
    result = skus.filter(item => regularPrefixes.some(prefix => item.sku_id.startsWith(prefix)))
  } else if (type === "addon") {
    result = skus.filter(item => addonPrefixes.some(prefix => item.sku_id.startsWith(prefix)))
  } else {
    throw new Error("Invalid type specified.")
    result = []
  }
  // console.log(`filterLicenseType result: ${ JSON.stringify(result, null, 1) }`)
  return result

}

export const doesAddonSkuExist = async (skuId: string): Promise<IAddonApiResponse> => {
  const supabase = createClient()

  const { data: sku, error } = await supabase
    .from('addon')
    .select('*')
    .eq('sku_addon', skuId)
    .single()

  if ( sku ) {
    // console.log(`doesAddonSkuExist/sku: `, sku)
    return {
      code: 200,
      data: sku,
    }
  }

  if ( error ) {
    console.error(`Error: `, error.message)
    return {
      code: 400,
      message: "El SKU de este Addon no se encontró."
    }
  }

  return {
    code: 404,
    message: "El SKU de este Addon no existe en la base de datos."
  }
}

export const getSkuInfo = async ( skuId: string ): Promise<ISkuInfoResponse> => {
  const supabase = createClient()
  const { data: sku, error } = await supabase
    .from('sku')
    .select('*')
    .eq('sku_base', skuId)
    .single()

  if ( sku ) {
    return {
      code: 200,
      data: sku,
    }
  }

  if ( error ) {
    console.error(`Error: `, error.message)
    return {
      code: 400,
      message: "No se encontró el SKU especificado en la base de datos."
    }
  }

  return {
    code: 404,
    message: "El SKU especificado no existe en la base de datos."
  }

}