import { createClient } from "@/utils/supabase/server";

export const dynamic = 'force-dynamic' // defaults to auto
export const revalidate = 120

export async function GET(request: Request): Promise<void | Response> {
  const supabase = createClient()

  const { data, error } = await supabase
      .from('partner')
      .select('*')

    if (error) {
      console.error(`Error retrieving partners from database: `, error)
      return Response.json(error)
    }

    return Response.json({ data })
}