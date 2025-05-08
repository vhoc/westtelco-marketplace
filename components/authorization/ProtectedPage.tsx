import { type ReactNode } from "react";
import { redirect } from "next/navigation";
import { getUserWithRole } from "@/utils/auth";
import { TRole } from "@/types";

interface ProtectedPageProps {
  roles?: TRole[];
  children: ReactNode | ReactNode[];
  unauthenticatedRedirectTo?: string;
  unauthorizedRedirectTo?: string;
}

const ProtectedPage = async ({ roles = ['default'], children, unauthenticatedRedirectTo = "/login", unauthorizedRedirectTo = "/unauthorized" }: ProtectedPageProps) => {

  // 1. Get Supabase client for server components

  // 2. Fetch current user and their role
  const { user, role } = await getUserWithRole();

  // 3. Check if user is authenticated
  // Note: Your middleware might already handle this, but defense-in-depth is good.
  if (!user) {
    console.log("AdminLayout: No user found, redirecting to login.");
    // Redirect to login, maybe include where they came from
    const loginUrl = new URL(unauthenticatedRedirectTo, process.env.APP_URL || 'http://localhost:3000');
    loginUrl.searchParams.set('message', 'Please log in to access the admin area.');
    loginUrl.searchParams.set('redirectedFrom', '/admin'); // Optional: tell login where to return
    redirect(loginUrl.toString());
  }

  // 4. Check if the authenticated user has the required role
  const isAllowed = role ? roles.includes(role) : false;

  if (!isAllowed) {
    console.warn(`AdminLayout Access Denied: User ${user.id} (Role: ${role}) attempted access.`);
    // Redirect to a generic dashboard or an "unauthorized" page
    const unauthorizedUrl = new URL(unauthorizedRedirectTo, process.env.APP_URL || 'http://localhost:3000');
    // unauthorizedUrl.searchParams.set('requiredRole', roles.join(',')); // Optional: info for the page
    // unauthorizedUrl.searchParams.set('userRole', role || 'none'); // Optional: info for the page
    redirect(unauthorizedUrl.toString()); // Or redirect('/dashboard?error=unauthorized');
  }

  // 5. If all checks pass, render the layout and its children
  console.log(`AdminLayout Access Granted: User ${user.id} (Role: ${role})`);
  return (
    <>
      {children}
    </>
  );

}

export default ProtectedPage