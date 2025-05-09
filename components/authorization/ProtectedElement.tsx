"use client"
import { TRole } from "@/types"
import { useUserRole } from "@/utils/context/UserRoleContext"
import React from "react"

interface ProtectedResourceProps {
  /** The content to render if the user has one of the allowed roles. */
  children: React.ReactNode | React.ReactNode[]
  /** An array of roles that are allowed to see the children. */
  roles: TRole[]
  /** Optional: Content to display while the user/role is being loaded. Defaults to null. */
  loadingFallback?: React.ReactNode | React.ReactNode[] | null
  /** Optional: Content to display if the user does not have the required role. Defaults to null. */
  deniedFallback?: React.ReactNode | React.ReactNode[] | null
}

const ProtectedElement = ({ children, roles = ["default"], loadingFallback = null, deniedFallback = null }: ProtectedResourceProps) => {

  const { role, isLoading } = useUserRole() // Get role and loading state from context

  // Display loading fallback if context is still loading user/role
  if (isLoading) {
    return <>{ loadingFallback }</>
  }

  // Check if the user has a role and if that role is included in the allowed list
  const isAllowed = role ? roles.includes(role) : false

  // Render children if allowed, otherwise render the denied fallback
  return isAllowed ? <>{ children }</> : <>{ deniedFallback }</>;

}

export default ProtectedElement