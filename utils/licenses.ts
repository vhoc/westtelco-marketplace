"use server"
import { createClient } from "./supabase/server";

export const getSkuInfo = async (sku: string | undefined) => {
  if ( !sku ) {
    console.error(`No sku provided`)
    return null
  }
  
  const supabase = createClient()
  try {
    console.log(`sku: `, sku)
    const { data: skuInfo, error } = await supabase
      .from('sku')
      .select('*')
      .eq('sku_base', sku)
      .single()

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