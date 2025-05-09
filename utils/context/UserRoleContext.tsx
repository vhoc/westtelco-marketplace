"use client"
import React, { createContext, useContext, ReactNode, useState, useEffect, useMemo } from "react";
import { User } from "@supabase/supabase-js"
import { TRole } from "@/types";
import { createClient } from "../supabase/client";

interface UserProfile {
  user: User | null
  role: TRole
}

interface UserRoleContextProps {
  user: User | null
  role: TRole
  isLoading: boolean
}

const UserRoleContext = createContext<UserRoleContextProps | undefined>(undefined)

interface UserRoleProviderProps {
  children: ReactNode
  initialUser: User | null
  initialRole: TRole
}

export const UserRoleProvider = ({ children, initialUser, initialRole }: UserRoleProviderProps) => {

  const supabase = createClient()

  // --- Initialize state with props from server ---
  const [user, setUser] = useState<User | null>(initialUser);
  const [role, setRole] = useState<TRole>(initialRole);
  const [isLoading, setIsLoading] = useState<boolean>(!initialUser);

  useEffect(() => {
    // Function to fetch profile/role for a given user client-side
    const fetchProfile = async (currentUser: User) => {

      setIsLoading(true)

      console.log(`Context: Client fetching profile for user ${currentUser.id}`);

      try {
        const { data: profileData, error: profileError } = await supabase
          .from('user') // Your table name
          .select('role') // Select role (and other fields if needed)
          .eq('id', currentUser.id)
          .single<UserProfile>();

        if (profileError) {
          console.error('Context: Client error fetching profile:', profileError.message);
          setRole('default'); // Reset role on error
        } else {
          console.log(`Context: Client profile fetched, role: ${profileData?.role}`);
          setRole(profileData?.role ?? null);
        }


      } catch (error) {
        console.error('Context: Client exception fetching profile:', error);
        setRole('default');
      } finally {
        setIsLoading(false);
      }

      // If the component mounts *without* an initial user from the server,
      // we are definitely loading until the auth state is confirmed.
      if (!initialUser) {
        setIsLoading(true);
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log(`Context: Auth event: ${event}, Session User: ${session?.user?.id}`);
          const currentSessionUser = session?.user ?? null;

          // Update user state based on the session
          setUser(currentSessionUser);

          if (currentSessionUser) {
            // If user logs in or session is established/updated
            // Check if this user is different from the one we already might have a role for
            if (currentSessionUser.id !== user?.id || role === null) {
              // Fetch profile if it's a new user OR if we don't have a role yet
              await fetchProfile(currentSessionUser);
            } else {
              // User is the same, role is already known, no need to fetch again.
              // Ensure loading is false if it was somehow stuck on true.
              setIsLoading(false);
            }
          } else {
            // If user signs out (currentSessionUser is null)
            setRole('default'); // Clear role
            setIsLoading(false); // Not loading anymore
          }
        }
      )

      // Cleanup subscription on component unmount
      return () => {
        console.log("Context: Unsubscribing auth listener.");
        subscription?.unsubscribe();
      };
      // We only need supabase in the dependency array as initialUser/initialRole
      // are used to set the *initial* state, not directly inside the effect's logic flow after mount.
      // The listener handles subsequent changes based on the session user.
    }

  }, [supabase])

  // Memoize context value to prevent unnecessary re-renders of consuming components
  const value = useMemo( () => ({
    user,
    role,
    isLoading,
  }), [user, role, isLoading])


  return (
    <UserRoleContext.Provider value={value}>
      {children}
    </UserRoleContext.Provider>
  )

}

export const useUserRole = (): UserRoleContextProps => {
  const context = useContext(UserRoleContext)

  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider')
  }

  return context

}