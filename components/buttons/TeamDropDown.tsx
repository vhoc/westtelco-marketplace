"use client"

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEllipsisV, faRepeat } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"

interface ITeamDropDownProps {
  teamId: string
}

export default function TeamDropDown({ teamId }: ITeamDropDownProps) {
  if (!teamId || teamId.length < 1) {
    return null
  }

  return (
    <Dropdown className="rounded-md">
      <DropdownTrigger>
        <Button size="sm" className="min-w-0 w-10 max-w-10 p-0">
          <FontAwesomeIcon icon={faEllipsisV} size="lg" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions" className="rounded-sm">

        <DropdownItem key="migrate">
          <Link className="w-full flex gap-4 py-2 max-w-[262px]" href={`/team/${teamId}/migrate`}>
            <FontAwesomeIcon icon={faRepeat} size="lg" color="#C2C2C5" />

            <div className="flex flex-col gap-1">
              <span className="text-black font-medium text-sm leading-5">Migrar Cliente</span>
              <p className="text-default-600 font-medium text-xs">
                Se migrará la gestión de éste cliente a otro reseller.
              </p>
            </div>
          </Link>
        </DropdownItem>

      </DropdownMenu>
    </Dropdown>
  )
}