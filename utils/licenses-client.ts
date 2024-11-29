"use client"
import { ISku, IAddonApiResponse, ISkuInfoResponse, ISkuValidationResponse } from "@/types";
import { createClient } from "./supabase/client";

export const filterLicenseType = (skus: Array<ISku>, type: "regular" | "addon") => {
  "use client"
  const regularPrefixes = ["TEAM-", "TEAMLIC-", "EDU-", "EDULIC-", "ENT-", "ENTLIC-"]
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

export const validateAddonSku = async ( baseSku: string , addonSku: string, currentSkus: Array<ISku> ): Promise<ISkuValidationResponse> => {

  const hyphenPosition = addonSku.indexOf('-')
  const currentAddonSkus = filterLicenseType(currentSkus, "addon")
  const newAddonNameInitials = addonSku.substring(hyphenPosition + 1, hyphenPosition + 3)

  const { data: baseSkuInfo, code: baseSkuResponseCode, message: baseSkuResponseMessage } = await getSkuInfo(baseSku)
  const { data: addonSkuInfo, code: addonSkuResponseCode, message: addonSkuResponseMessage } = await doesAddonSkuExist(addonSku)

  // Check existence of baseSku
  if ( baseSkuResponseCode !== 200 || !baseSkuInfo ) {
    return { status: "error", message: baseSkuResponseMessage }
  }

  // Check existence of addonSku
  if ( addonSkuResponseCode !== 200 || !addonSkuInfo ) {
    return { status: "error", message: addonSkuResponseMessage }
  }

  // Same commitment type: anual or monthly
  if ( baseSkuInfo.commitment_type !== addonSkuInfo.commitment_type ) {
    return { status: "error", message: "El período de suscripción y de pago debe ser igual al de la licencia Base." }
  }

  // New addonSku is "Extended Version History" and there is a "Data Governance" addon already in the team.  
  const dataGovernanceAddons = currentAddonSkus.some(item => item.sku_id.substring(hyphenPosition + 1, hyphenPosition + 3) === 'LH')
  if ( currentAddonSkus && currentAddonSkus.length >= 1 && newAddonNameInitials === "EV" && dataGovernanceAddons  ) {
    return { status: "error", message: "No se puede agregar un addon [Extended Version History] cuando ya existe un addon [Data Governance] en el cliente." }
  }

  // New addonSku is "Data Governance" and there is an "Extended Version History" addon already in the team.
  const extendedVersionHistoryAddons = currentAddonSkus.some(item => item.sku_id.substring(hyphenPosition + 1, hyphenPosition + 3) === 'EV')
  if ( currentAddonSkus && currentAddonSkus.length >= 1 && newAddonNameInitials === "LH" && extendedVersionHistoryAddons  ) {
    return { status: "error", message: "No se puede agregar un addon [Data Governance] cuando ya existe un addon [Extended Version History] en el cliente." }
  }

  return { status: "success" }
  
}