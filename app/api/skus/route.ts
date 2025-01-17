import { createClient } from "@/utils/supabase/server";

export const dynamic = 'force-dynamic' // defaults to auto
export const revalidate = 60

export async function GET(_request: Request): Promise<void | Response> {
  const supabase = createClient()

  const { data, error } = await supabase
      .from('sku')
      .select('*')

    if (error) {
      console.error(`Error retrieving skus from database: `, error)
      return Response.json(error)
    }

    const response = Response.json({data})

    return response
}
