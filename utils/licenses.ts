"use server"
import { PostgrestError } from "@supabase/supabase-js";
import { createClient } from "./supabase/server";
import { type TLicense, type TCommitment, type ISkuType, type ISkuInfo } from "@/types";

export const getSkuInfo = async (sku: string | undefined) => {
  if ( !sku ) {
    console.error(`No sku provided`)
    return null
  }
  
  const supabase = createClient()
  try {
    const { data: skuInfo, error }: { data: ISkuInfo | null, error: PostgrestError | null } = await supabase
      .from('sku')
      .select('*')
      .eq('sku_base', sku)
      .single()

      // console.log('skuInfo: ', skuInfo)//

    if (error) {
      console.error(error)
      return null
    }

    return skuInfo
  } catch (error) {
    console.error(error)
    return null
  }

}

export const getSkuTypes = (sku: string): ISkuType => {
  const typeMatch = sku.match(/(TEAM-BIZPL|TEAM-ST|TEAM-BIZ|TEAM-AD|EDU-|ENT-)/);
  const commitmentMatch = sku.match(/(1Y|AC1M|1M)$/)

  const licenseTypeMap: { [key: string]: TLicense } = {
    "TEAM-ST": "Standard",
    "TEAM-BIZPL": "Business Plus",
    "TEAM-BIZ": "Business",
    "TEAM-AD": "Advanced",
    "EDU-": "Education",
    "ENT-": "Enterprise",
  }

  const commitmentTypeMap: { [key: string]: TCommitment } = {
    "1Y": "Y",
    "AC1M": "AC1M",
    "1M": "1M",
  }

  return {
    licenseType: licenseTypeMap[typeMatch ? typeMatch[0] : "Unknown"], // Default to Unknown if not found
    commitmentType: commitmentTypeMap[commitmentMatch ? commitmentMatch[0] : "Unknown"], // Default to Unknown if not found
  }
}