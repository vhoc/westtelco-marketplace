import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: { skuId: string } }
): Promise<void | Response> {
  const supabase = createClient()

  const skuId = params.skuId

  const { data, error } = await supabase
      .from('sku')
      .select('*')
      .eq('sku_license', skuId)
      .single()

    if (error) {
      console.error(`Error retrieving sku from database: `, error)
      return Response.json(error)
    }

    const response = Response.json({data})

    return response
}