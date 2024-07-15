"use client";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleDown, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { User } from "@supabase/supabase-js";
import { signOut } from "@/utils/auth";

interface UserDropdownProps {
  user: User
  userData: any
}

const UserDropdown = ({ user, userData }: UserDropdownProps) => {

  return (
    <Dropdown>

      <DropdownTrigger>
        <Button
          variant={'light'}
        >
          { `${ userData.first_name } ${ userData.last_name }` }
          <FontAwesomeIcon size={'xs'} icon={faChevronDown} color="#006FEE" className={'border-2 rounded-md border-[#006FEE] p-1'}/>
        </Button>
      </DropdownTrigger>

      <DropdownMenu>
        <DropdownItem key={'signOut'}>
          <form action={signOut}>
            <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
              {"Cerrar sesión"}
            </button>
          </form>
        </DropdownItem>
      </DropdownMenu>

    </Dropdown>
  )

}

export default UserDropdown