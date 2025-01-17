import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation";

export default async function Home() {

  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  } else {
    return redirect('/teams')
  }
}
