import { createClient } from "@/utils/supabase/server"

export async function GET(request: Request) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.log('sign-out/route: error: ', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  console.log('sign-out/route: redirecting to /login')
  return new Response(JSON.stringify({ message: "Signed out successfully" }), { status: 200 })

}