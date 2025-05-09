"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const signOut = async () => {
  const supabase = await createClient();
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
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser()

  if ( error || !data?.user ){
    console.error('Authentication error:', error)
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
      // await supabase.auth.signOut();
      return redirect(`/login?message=El usuario no existe en éste entorno.`)
    }
  }

}

/**
 * Returns the user's from Supabase Auth along with the user role from the public schema
 */
export const getUserWithRole = async () => {
  const supabase = await createClient();

  const { data:{ user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    // console.error("Error fetching user:", userError?.message);
    return { user: null, role: null };
  }

  // Fetch the role from your public.user table
  // Adjust 'user' to your actual table name and 'id' to the column referencing auth.users.id
  const { data: profileData, error: profileError  } = await supabase
    .from('user')
    .select('role')
    .eq('id', user.id)
    .single()

    if (profileError) {
      console.error("Error fetching user role:", profileError.message);
      // Decide how to handle missing profiles: return null role, throw error, etc.
      return { user, role: 'default' };
    }

    return { user, role: profileData?.role ?? 'default' };
}