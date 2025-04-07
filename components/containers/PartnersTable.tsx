//@ts-nocheck
"use client"
import React, { useState, useMemo, useCallback } from "react"
import { Input, Button, Skeleton } from "@heroui/react"
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Pagination, Chip } from "@heroui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faUserPlus  } from "@fortawesome/free-solid-svg-icons"
import { IPartner } from "@/types"
import { useRouter } from "next/navigation";

interface PartnersTableProps {
  partners: Array<IPartner>
}

const PartnersTable = ( { partners }: PartnersTableProps ) => {

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingTeamPage, setIsLoadingTeamPage] = useState(false)

  const columns = [
    { name: "NOMBRE DEL PARTNER", uid: "name" },
    { name: "RESELLER ID", uid: "reseller_id" },
    { name: "ADMIN EMAIL", uid: "admin_email" },
  ]

  const [rowsPerPage, setRowsPerPage] = useState(10)
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
    let filteredPartners = [...partners];

    if (hasSearchFilter) {
      filteredPartners = filteredPartners.filter((user) =>
        user.company_name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredPartners = filteredPartners.filter((user) =>
        Array.from(statusFilter).includes(user.status),
      );
    }

    return filteredPartners;
  }, [partners, filterValue, statusFilter, hasSearchFilter]);

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
              placeholder="Buscar por nombre de partner"
              startContent={<FontAwesomeIcon icon={faMagnifyingGlass} color={'#E0E0E3'} />}
              value={filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
            />
            <span className="text-default-500 text-[12px]">{sortedItems.length} de {partners.length} partners</span>
          </div>

          <div className="flex flex-col items-end gap-y-3">
            <div className={'flex gap-4 justify-end'}>
              {/* <Button
                size={'sm'}
                className={'bg-black text-white'}
                endContent={<FontAwesomeIcon icon={faMagnifyingGlass} color={'white'} />}
                onPress={onOpen}
              >
                Buscar por TEAM ID
              </Button> */}
              <Button
                size={'sm'}
                color={'primary'}
                endContent={<FontAwesomeIcon icon={faUserPlus} color={'white'} />}
                onPress={() => router.push('/partner/new')}
              >
                Nuevo Partner
              </Button>
            </div>
            <label className="flex items-center text-default-500 text-tiny">
              Filas por página:
              <select
                className="bg-[#EBEBED] outline-none text-default-500 text-tiny rounded-md ml-2 px-1"
                onChange={onRowsPerPageChange}
                defaultValue={"10"}
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
    partners.length,
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
        <span className="text-default-500 text-[12px]">{sortedItems.length} de {partners.length} partners</span>

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

  const renderCell = useCallback((partner: IPartner, columnKey) => {
    const cellValue = partner[columnKey]
    const currentResellerId = partner.dropbox_reseller_id
    // const urlEncodedId = encodeURIComponent(partner.id as string)

    if (currentResellerId) {
      // const currentPartner = partners.find(item => item.dropbox_reseller_id === currentResellerId[0])
      switch (columnKey) {
        case "name":
          return (
            <div className={'flex flex-col'}>
              <span>{partner.company_name}</span>
              {/* <span className={'text-tiny text-default-500'}>{team.id}</span> */}
            </div>
          )

        case "reseller_id":
          return (
            <div className="text-black">
              { partner.dropbox_reseller_id }
            </div>
          )

        case "admin_email":
          return (
            <div>
              { partner.dropbox_admin_email }
            </div>
          )

        default:
          return cellValue
      }
    }


  }, [partners, isLoadingTeamPage, isLoading, router])

  return (
    <>

      {/* TITLE */}
      <div className="flex justify-between items-center">
        <div className={'text-xl'}>Partners</div>
        {/* <Button onPress={() => refetchTeams()}>Reload</Button> */}
      </div>


      {
        isLoading ?
          <div className={'flex flex-col gap-y-4'}>
            <Skeleton className="rounded-lg">
              <div className="h-12 rounded-lg bg-default-300"></div>
            </Skeleton>
            <Skeleton className="rounded-lg flex flex-row gap-x-4">
              <div className="h-8 rounded-lg bg-default-300"></div>
            </Skeleton>
            <Skeleton className="rounded-lg">
              <div className="h-8 rounded-lg bg-default-300"></div>
            </Skeleton>
            <Skeleton className="rounded-lg">
              <div className="h-8 rounded-lg bg-default-300"></div>
            </Skeleton>
          </div>
          :
          partners.length >= 1 ?
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
                  {(partner) => (
                    <TableRow key={partner.id}>
                      {(columnKey) => <TableCell>{renderCell(partner, columnKey)}</TableCell>}
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

export default PartnersTable