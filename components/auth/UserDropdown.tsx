"use client";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { User } from "@supabase/supabase-js";
import { signOut } from "@/utils/auth";
import Image from "next/image";
import flagMexico from '../../public/img/flagMx.png'
import flagBrazil from '../../public/img/flagBr.png'
import { useRouter } from "next/navigation";

interface UserDropdownProps {
  user: User
  userData: any
}

const UserDropdown = ({ user, userData }: UserDropdownProps) => {

  const router = useRouter()

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

      <DropdownMenu disabledKeys={['wtbr']}>

        <DropdownItem key={'wtmx'} onPress={() => router.push('/')}>
          <div className={'w-full flex text-black items-center gap-3'}>
            <Image
              src={flagMexico}
              width={20}
              height={20}
              alt={'West Telco MX'}
            />
            <span>West Telco MX</span>
          </div>
        </DropdownItem>

        <DropdownItem key={'wtbr'} onPress={() => router.push('/')}>
          <div className={'w-full flex text-black items-center gap-3'}>
            <Image
              src={flagBrazil}
              width={20}
              height={20}
              alt={'West Telco BR'}
            />
            <span>West Telco BR</span>
          </div>
        </DropdownItem>

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