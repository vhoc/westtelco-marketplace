import { TRole } from "@/types"

interface ProtectedResourceProps {
  children: React.ReactNode | React.ReactNode[]
  roles: TRole[]
}

const ProtectedElement = ({ children, roles = ["default"] }: ProtectedResourceProps) => {

  return (
    <>
    </>
  )

}

export default ProtectedElement