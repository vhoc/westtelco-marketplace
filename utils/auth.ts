"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const signOut = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/login");
};

/**
 * Validates:
 * - That the user has an active valid session
 * - That the user belongs to the current environment (MX, BR, etc)
 * - If the user doesn't belong to the current environment, validates if its role is 'westtelco-admin'
 * @returns Promise<redirect>
 */
export const isUserValid = async ( successRedirectTo?: string | undefined ): Promise<void> => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser()

  if ( error || !data?.user ){
    console.error(error)
    return redirect(`/login?message=${ 'Se requiere iniciar sesión.' }`)
  } else {
    // Check if the user's profile data for a validation below
    const { data: userData, error: userError } = await supabase
      .from('user')
      .select('distribuitor_id,role')
      .eq('id', data.user.id)
      .single()

    if ( userError ) {
      console.error(userError)
      return redirect(`/login?message=El usuario no cuenta con un perfil, favor de contactar a soporte de UX Neighbor.`)
    }

    // Validate if the user's distribuitor_id is the same as the one in the environment
    // OR bypass if the user's role is "westtelco-admin"
    if ( (userData.distribuitor_id === Number(process.env.DISTRIBUITOR_INTERNAL_ID)) || userData.role === 'westtelco-admin' ) {
      if ( successRedirectTo && successRedirectTo.length >= 1 ) {
        return redirect(successRedirectTo)
      }
      return
    } else {
      console.error('El usuario no existe en éste entorno.')
      await supabase.auth.signOut();
      return redirect(`/login?message=El usuario no existe en éste entorno.`)
    }
  }

}