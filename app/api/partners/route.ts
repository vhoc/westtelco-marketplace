import { createClient } from "@/utils/supabase/server";

export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(_request: Request): Promise<void | Response> {
  const supabase = await createClient()

  const { data, error } = await supabase
      .from('partner')
      .select('*')
      .eq('distribuitor_id', process.env.DISTRIBUITOR_INTERNAL_ID)

    if (error) {
      console.error(`Error retrieving partners from database: `, error)
      return Response.json(error)
    }

    const response = Response.json({data})

    return response
}
