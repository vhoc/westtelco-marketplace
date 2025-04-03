"use client"
import React, { useMemo } from "react"
import { Input, Button } from "@nextui-org/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faUserPlus } from "@fortawesome/free-solid-svg-icons"
import { ITeamData } from "@/types"
import { useRouter } from "next/navigation"

interface TopContentProps {
  filterValue:string
  onRowsPerPageChange: (e: any) => void
  onSearchChange: (e: any) => void
  hasSearchFilter: boolean
  sortedItems: ITeamData[]
  teams: ITeamData[]
}

export const TopContent = ({ filterValue, onRowsPerPageChange, onSearchChange, hasSearchFilter, sortedItems, teams }: TopContentProps) => {

  const router = useRouter()

  const topContentElement = useMemo(() => {
    return (
      <div className="flex flex-col gap-4 mb-2">
        {/* <div className="flex justify-between gap-3 items-end">


        </div> */}
        <div className="flex justify-between items-center">
          <div className={'flex flex-col gap-y-3'}>
            <Input
              isClearable
              size={'sm'}
              variant={'bordered'}
              className="w-full max-w-[270px]"
              placeholder="Buscar por nombre de cliente"
              startContent={<FontAwesomeIcon icon={faMagnifyingGlass} color={'#E0E0E3'} />}
              value={filterValue}
              // onClear={() => onClear()}
              onValueChange={onSearchChange}
            />
            <span className="text-default-500 text-[12px]">{sortedItems.length} de {teams.length} cuentas totales</span>
          </div>

          <div className="flex flex-col items-end gap-y-3">
            <div className={'flex gap-4 justify-end'}>
              {/* <Button
                size={'sm'}
                className={'bg-black text-white cursor-not-allowed'}
                endContent={<FontAwesomeIcon icon={faPeoplePulling} color={'white'} />}
                onPress={() => router.push('/team/import')}
                isDisabled={true}
              >
                Importar Cliente
              </Button> */}
              <Button
                size={'sm'}
                color={'primary'}
                endContent={<FontAwesomeIcon icon={faUserPlus} color={'white'} />}
                onPress={() => router.push('/team/new')}
              >
                Nuevo Cliente
              </Button>
            </div>
            <label className="flex items-center text-default-500 text-tiny">
              Filas por página:
              <select
                className="bg-[#EBEBED] outline-none text-default-500 text-tiny rounded-md ml-2 px-1"
                onChange={onRowsPerPageChange}
                defaultValue={20}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
            </label>
          </div>


        </div>
      </div>
    );
  }, [
    filterValue,
    onRowsPerPageChange,
    teams.length,
    onSearchChange,
    hasSearchFilter,
  ]);
  

  return topContentElement

}

