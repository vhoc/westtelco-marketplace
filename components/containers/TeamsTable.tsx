//@ts-nocheck
"use client"
import React, { useState, useMemo, useEffect, useCallback } from "react"
import { Input, Button, Skeleton } from "@nextui-org/react"
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Pagination, Chip, Progress } from "@nextui-org/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faUserPlus, faPencil, faPeoplePulling } from "@fortawesome/free-solid-svg-icons"
import { ITeamData, IPartner } from "@/types"
import { useRouter } from "next/navigation";
import { getAllTeams } from "@/app/teams/actions"
import { getPartners } from "@/utils/partner"
import FindTeamForm from "../forms/FindTeamForm"
import { navigateToTeam } from "@/app/teams/actions"
import { refetchTeams } from "@/app/teams/actions"

const TeamsTable = () => {

  const router = useRouter()
  const [teams, setTeams] = useState<Array<ITeamData>>([])
  const [partners, setPartners] = useState<Array<IPartner>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingTeamPage, setIsLoadingTeamPage] = useState(false)

  const columns = [
    { name: "NOMBRE DEL CLIENTE / TEAM ID", uid: "name" },
    { name: "GESTIONADO POR", uid: "reseller_ids" },
    { name: "BASE SKU", uid: "sku_id" },
    { name: "LICENCIAS", uid: "num_licensed_users" },
    { name: "STATUS", uid: "active" },
    { name: "ACCIONES", uid: "actions" },
  ]

  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [page, setPage] = useState(1)
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "name",
    direction: "ascending",
  });

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredTeams = [...teams];

    if (hasSearchFilter) {
      filteredTeams = filteredTeams.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredTeams = filteredTeams.filter((user) =>
        Array.from(statusFilter).includes(user.status),
      );
    }

    return filteredTeams;
  }, [teams, filterValue, statusFilter, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = React.useMemo(() => {
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
              onClear={() => onClear()}
              onValueChange={onSearchChange}
            />
            <span className="text-default-500 text-[12px]">{sortedItems.length} de {teams.length} cuentas totales</span>
          </div>

          <div className="flex flex-col items-end gap-y-3">
            <div className={'flex gap-4 justify-end'}>
              <Button
                size={'sm'}
                className={'bg-black text-white cursor-not-allowed'}
                endContent={<FontAwesomeIcon icon={faPeoplePulling} color={'white'} />}
                onPress={() => router.push('/team/import')}
                isDisabled={true}
              >
                Importar Cliente
              </Button>
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
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
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

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        {/* <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span> */}
        <span className="text-default-500 text-[12px]">{sortedItems.length} de {teams.length} cuentas totales</span>

        <div className="flex w-[70%] justify-end gap-2 items-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={pages}
            onChange={setPage}
          />
          <div className="hidden lg:flex gap-2 items-center">
            <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
              Anterior
            </Button>
            <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    );
  }, [items.length, selectedKeys, page, pages, hasSearchFilter]);

  const renderCell = useCallback((team: ITeamData, columnKey) => {
    const cellValue = team[columnKey]
    const currentResellerId = team.reseller_ids.filter(item => item !== process.env.NEXT_PUBLIC_DISTRIBUITOR_ID)
    const urlEncodedId = encodeURIComponent(team.id as string)

    if (currentResellerId) {
      const currentPartner = partners.find(item => item.dropbox_reseller_id === currentResellerId[0])
      switch (columnKey) {
        case "name":
          return (
            <div className={'flex flex-col'}>
              <span>{team.name}</span>
              <span className={'text-tiny text-default-500'}>{team.id}</span>
            </div>
          )

        case "reseller_ids":
          return (
            <div className="text-black">
              {
                currentPartner ?
                  `${currentPartner.company_name} [${currentResellerId[0]}]`
                  :
                  'N/A'
              }
            </div>
          )

        case "active":
          return (
            <div>
              <Chip radius={'sm'} size={'sm'} className={`text-tiny ${team.active ? 'bg-success-100' : 'bg-default-200'} ${team.active ? 'text-success-600' : 'text-default-400'}`}>
                {
                  team.active ?
                    `ACTIVO`
                    :
                    `INACTIVO`
                }
              </Chip>
            </div>
          )

        case "actions":
          return (
            <div className={'flex justify-end items-center'}>
              <Button
                size={'sm'}
                variant={'light'}
                isLoading={isLoadingTeamPage}
                isDisabled={isLoadingTeamPage}
                onPress={() => {
                  setIsLoadingTeamPage(true)
                  router.push(`/team/${urlEncodedId}?resellerId=${currentResellerId[0]}`)
                }}
              >
                {
                  !isLoading ?
                    <FontAwesomeIcon icon={faPencil} color={'#71717A'} size={'lg'} />
                    :
                    '.'
                }

              </Button>
            </div>
          )

        default:
          return cellValue
      }
    }


  }, [partners, isLoadingTeamPage, isLoading, router])

  // LOAD TEAMS AND PARTNERS
  useEffect(() => {
    setIsLoading(true)
    getAllTeams().then(data => {

      // console.log(`data: `, data)
      setTeams(data)
    }).catch(error => {
      console.error(error)
    }).finally(() => {
      setIsLoading(false)
    })
  }, [])

  // LOAD PARTNERS
  useEffect(() => {
    setIsLoading(true)
    getPartners().then(data => {
      setPartners(data)
    }).catch(error => {
      console.error(error)
    }).finally(() => {
      setIsLoading(false)
    })
  }, [])

  return (
    <>

      {/* TITLE */}
      <div className="flex justify-between items-center">
        <div className={'text-xl'}>Clientes</div>
        {/* <Button onPress={() => refetchTeams()}>Reload</Button> */}
      </div>


      {
        isLoading ?
          <div className={'flex justify-center items-center gap-y-4 w-full text-center h-72'}>
            <Progress
              size="md"
              isIndeterminate
              aria-label="Obteniendo clientes de todos los partners..."
              className="max-w-md"
              label="Obteniendo clientes de todos los partners. Esto puede tomar unos segundos..."
            />
          </div>
          :
          teams.length >= 1 && partners.length >= 1 ?
            <>

              {/* TABLE */}
              <Table
                aria-label="Teams table"
                isStriped
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                topContent={topContent}
                topContentPlacement="outside"
              // classNames={{
              //   wrapper: "max-h-[382px]",
              // }}
              >

                <TableHeader columns={columns}>
                  {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
                </TableHeader>

                <TableBody items={sortedItems} >
                  {(team) => (
                    <TableRow key={team.id}>
                      {(columnKey) => <TableCell>{renderCell(team, columnKey)}</TableCell>}
                    </TableRow>
                  )}
                </TableBody>

              </Table>
            </>
            :
            <div></div>
      }


    </>
  )

}

export default TeamsTable