"use server"
import { PostgrestError } from "@supabase/supabase-js";
import { type TLicense, type TCommitment, type ISkuType, type ISkuInfo } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { validateServerActionRole, AuthError, PermissionError, RoleConfigError } from "@/utils/auth/serverActions";

export const getSkuInfo = async (sku: string | undefined) => {
  if (!sku) {
    console.error(`No sku provided`)
    return null
  }

  const supabase = await createClient()
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

export const getSkuTypes = async (sku: string): Promise<ISkuType> => {
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

export const fetchSkus = async () => {
  try {
    await validateServerActionRole([
      'westtelco-admin',
      'westtelco-agent',
      'westtelco-limited'
    ]);

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('sku')
      .select('*')

    // console.log(`api/skus/route.ts: data: `, data)
    // console.log(`api/skus/route.ts: error: `, error)

    if (error) {
      console.error(`Error retrieving skus from database: `, error)
      return []
    }
    return data

  } catch (error) {
    console.error("Server Action 'fetchSkus' failed:", error)
    if (error instanceof AuthError || error instanceof PermissionError || error instanceof RoleConfigError) {
      return []; // Return the specific error message
      // return { ok: false, error: error.message }; // Return the specific error message
    } else {
      // Handle other potential errors during action execution
      // return { ok: false, error: 'An unexpected error occurred while fetching the teams.' };
      return []
    }
  }

}