"use client";
import { useState, useEffect } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Skeleton } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faRightFromBracket, faHandshake, faUsers } from "@fortawesome/free-solid-svg-icons";
import { User } from "@supabase/supabase-js";
import { signOut } from "@/utils/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface UserDropdownProps {
  user: User
  userData: any
}

const supabase = createClient()

const UserDropdown = ({ user, userData }: UserDropdownProps) => {

  const router = useRouter()
  console.log(userData)

  const [distribuitors, setDistribuitors] = useState<Array<{ id: number, name: string, marketplace_url: string, flag_base64: string }> | null>(null)
  const [isLoadingDistribuitors, setIsLoadingDistribuitors] = useState(true)

  useEffect(() => {
    const fetchDistribuitors = async () => {
      const { data, error } = await supabase
        .from('distribuitor')
        .select('id,name,marketplace_url,flag_base64,active')
        .eq('active', true)

      console.log(`data: `, data)

      if (error) {
        console.error(error)
      } else {
        setDistribuitors(data)
      }

      setIsLoadingDistribuitors(false)
    }

    fetchDistribuitors()
  }, [])

  return (
    <Dropdown>

      <DropdownTrigger>
        <Button
          variant={'light'}
        >
          {`${userData.first_name} ${userData.last_name}`}
          <FontAwesomeIcon size={'xs'} icon={faChevronDown} color="#006FEE" className={'border-2 rounded-md border-[#006FEE] p-1'} />
        </Button>
      </DropdownTrigger>

      <DropdownMenu >

        <DropdownItem key={'partners'} onPress={() => router.push('/partners')}>
          <div className={'w-full flex text-black items-center gap-3'}>
            <FontAwesomeIcon icon={faHandshake} color="#C2C2C5" />
            <span>Partners</span>
          </div>
        </DropdownItem>

        <DropdownItem key={'clientes'} onPress={() => router.push('/teams')} showDivider>
          <div className={'w-full flex text-black items-center gap-3'}>
            <FontAwesomeIcon icon={faUsers} color="#C2C2C5" />
            <span>Clientes</span>
          </div>
        </DropdownItem>

        {distribuitors && distribuitors.length >= 1 ?
          distribuitors?.map((item, index) => (
            <DropdownItem key={`distribuitor-${item.id}`} onPress={() => router.replace(item.marketplace_url)}>
              <div className={'w-full flex text-black items-center gap-3'}>
                <Image
                  src={item.flag_base64}
                  width={20}
                  height={20}
                  alt={item.name}
                />
                <span>{item.name}</span>
              </div>
            </DropdownItem>
          ))
          : isLoadingDistribuitors ?
            <div className="w-full flex flex-col gap-2">
              <Skeleton className="h-3 w-3/5 rounded-lg"/>
              <Skeleton className="h-3 w-4/5 rounded-lg"/>
            </div>
            :
             <DropdownItem key={'no-distribuitors'}>No hay distribuidores</DropdownItem>
        }

        <DropdownItem key={'signOut'}>
          <form action={signOut} className={'w-full flex text-black items-center gap-3'}>
            <FontAwesomeIcon icon={faRightFromBracket} color="#C2C2C5" />
            <button className="px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover text-black">

              {"Cerrar sesión"}
            </button>
          </form>
        </DropdownItem>

      </DropdownMenu>

    </Dropdown>
  )

}

export default UserDropdown