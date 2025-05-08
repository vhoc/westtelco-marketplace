import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";
import { TRole } from "@/types";

export class AuthError extends Error {
  constructor(message = "Authentication required.") {
    super(message);
    this.name = "AuthError";
  }
}

export class PermissionError extends Error {
  constructor(message = "Permission denied.") {
    super(message);
    this.name = "PermissionError";
  }
}

export class RoleConfigError extends Error {
  constructor(message = "User role configuration issue.") {
    super(message);
    this.name = "RoleConfigError";
  }
}

interface UserProfile {
  role: TRole
}

/**
 * Validates the current user's session and role for a secure execution for Server Actions.
 * Must be called at the beginning of a Server Action.
 * Throws AuthError, RoleConfigError, or PermissionError on failure.
 * 
 * @param allowedRoles Array of roles permitted to perform the action.
 * @returns Promise<{ user: User, role: TRole }> The authenticated user and their verified role.
 * @throws AuthError if the user is not authenticated.
 * @throws RoleConfigError if the user's role is not configured.
 * @throws PermissionError if the user's role is not permitted to perform the action.
 */
export async function validateServerActionRole(allowedRoles: TRole[]): Promise<{ user: User, role: TRole }> {

  // Create server client inside the action context
  const supabase = await createClient();

  // Get authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Server Action Validation Error: User not authenticated.", userError?.message);
    throw new AuthError();
  }

  // Fetch the user's role from the database
  const { data: profileData, error: profileError } = await supabase
    .from('user')
    .select('role')
    .eq('id', user.id)
    .single<UserProfile>()

  if (profileError) {
    console.error(`Server Action Validation Error: Failed to fetch role for user ${user.id}:`, profileError.message);
    throw new RoleConfigError('Could not verify user role.'); // Throw specific error
  }

  if (!profileData?.role) {
    // This could mean the user exists in auth but not in your public.user table, or role is null
    console.warn(`Server Action Validation Warning: No role found for user ${user.id}.`);
    throw new RoleConfigError('User role not assigned or profile missing.'); // Throw specific error
  }

  const userRole = profileData.role;

  // Check if the fetched role is in the allowed list
  if (!allowedRoles.includes(userRole)) {
    console.warn(`Server Action Permission Denied: User ${user.id} (Role: ${userRole}) attempted action requiring roles [${allowedRoles.join(', ')}].`);
    throw new PermissionError(`Role '${userRole}' is not authorized for this action.`); // Throw specific error
  }

  // Success: Return user and their verified role
  // console.log(`Server Action Authorized: User ${user.id} (Role: ${userRole}) for roles [${allowedRoles.join(', ')}]`);
  return { user, role: userRole };

}