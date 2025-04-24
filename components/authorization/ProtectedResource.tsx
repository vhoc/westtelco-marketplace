import { TRole } from "@/types"

interface ProtectedResourceProps {
  children: React.ReactNode | React.ReactNode[]
  roles: TRole[]
}

const ProtectedResource = ({ children, roles = ["default"] }: ProtectedResourceProps) => {

  return (
    <>
    </>
  )

}

export default ProtectedResource