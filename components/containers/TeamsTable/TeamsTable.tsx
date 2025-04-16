
//@ts-ignore
//@ts-nocheck
"use client"
import React, { useState, useMemo } from "react"
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Progress } from "@heroui/react"
import { ITeamData, IPartner } from "@/types"
import { useRouter } from "next/navigation";
import columns from "./columns"
import { TopContent } from "./TopContent"
import { BottomContent } from "./BottomContent"
import { useNextPage, usePreviousPage, useRowsPerPageChange, useSearchChange } from "./handlers"
import { useRenderCell } from "./useRenderCell"

interface TeamsTableProps {
  teams: Array<ITeamData>
  partners: Array<IPartner>
  dbTeams?: Array<ITeamDataFromDatabase>
  allSkus?: Array<ISkuInfo>
}

const TeamsTable = ({ teams, partners, dbTeams, allSkus }: TeamsTableProps) => {

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingTeamPage, setIsLoadingTeamPage] = useState(false)

  const [rowsPerPage, setRowsPerPage] = useState(20)
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

  const onNextPage = useNextPage(page, pages, setPage);
  const onPreviousPage = usePreviousPage(page, setPage);
  const onRowsPerPageChange = useRowsPerPageChange(setRowsPerPage, setPage);
  const onSearchChange = useSearchChange(setFilterValue, setPage);

  const renderCell = useRenderCell({ partners, isLoadingTeamPage, setIsLoadingTeamPage, isLoading, router })



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
                // bottomContent={bottomContent}
                bottomContent={
                  <BottomContent
                    sortedItems={sortedItems}
                    teams={teams}
                    page={page}
                    pages={pages}
                    setPage={setPage}
                    onPreviousPage={onPreviousPage}
                    onNextPage={onNextPage}
                    selectedKeys={selectedKeys}
                    hasSearchFilter={hasSearchFilter}
                    items={items}
                  />
                }
                bottomContentPlacement="outside"
                // topContent={topContent}
                topContent={
                  <TopContent
                    filterValue={filterValue}
                    onRowsPerPageChange={onRowsPerPageChange}
                    onSearchChange={onSearchChange}
                    hasSearchFilter={hasSearchFilter}
                    sortedItems={sortedItems}
                    teams={teams}
                    partners={partners}
                  />
                }
                topContentPlacement="outside"
              >

                <TableHeader columns={columns}>
                  {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
                </TableHeader>

                <TableBody items={sortedItems}>
                  {(team) => {
                    const currentTeam = dbTeams?.find(item => item.team_id === team.id)
                    const currentSkuInfo = allSkus?.find(item => item.sku_base === team.sku_id)
                    return (
                      <TableRow key={team.id}>
                        {(columnKey) => <TableCell>{renderCell(team, columnKey, currentTeam, currentSkuInfo)}</TableCell>}
                      </TableRow>
                    )
                  }}
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