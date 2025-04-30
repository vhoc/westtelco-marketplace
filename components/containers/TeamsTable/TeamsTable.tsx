//@ts-ignore
//@ts-nocheck
"use client"
import React, { useState, useMemo } from "react"
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Progress } from "@heroui/react"
import { ITeamData, IPartner, ITeamDataFromDatabase, ISkuInfo } from "@/types" // Assuming types are correctly imported
import { useRouter } from "next/navigation";
import columns from "./columns" // Make sure 'allowsSorting' is defined in this file for relevant columns
import { TopContent } from "./TopContent"
import { BottomContent } from "./BottomContent"
import { useNextPage, usePreviousPage, useRowsPerPageChange, useSearchChange } from "./handlers"
import { useRenderCell } from "./useRenderCell"

// --- Mock statusOptions if not defined elsewhere ---
const statusOptions = [
    {name: "Active", uid: "active"},
    {name: "Paused", uid: "paused"},
    {name: "Vacation", uid: "vacation"},
];
// --- End Mock ---

interface TeamsTableProps {
  teams: Array<ITeamData>
  partners: Array<IPartner>
  dbTeams?: Array<ITeamDataFromDatabase>
  allSkus?: Array<ISkuInfo>
}

const TeamsTable = ({ teams = [], partners = [], dbTeams = [], allSkus = [] }: TeamsTableProps) => { // Add default values

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false) // Consider if this state is actually used or needed
  const [isLoadingTeamPage, setIsLoadingTeamPage] = useState(false)

  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [page, setPage] = useState(1)
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // Ensure 'status' property exists on ITeamData if used
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "start_date", // Default sort column
    direction: "descending", // Default direction
  });

  const hasSearchFilter = Boolean(filterValue);

  // 1. FILTERING: Filter the original teams array
  const filteredItems = useMemo(() => {
    let filteredTeams = [...teams]; // Start with all teams

    // Apply search filter
    if (hasSearchFilter) {
      filteredTeams = filteredTeams.filter((team) => // Changed variable name to 'team'
        team.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    // Apply status filter (Ensure team object has a 'status' property compatible with statusOptions uids)
    // Also check if statusOptions is defined
    // if (statusOptions && statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
    //   const filterSet = new Set(statusFilter); // More efficient lookup
    //   filteredTeams = filteredTeams.filter((team) =>
    //     filterSet.has(team.status) // Assuming team.status holds the uid like "active"
    //   );
    // }

    return filteredTeams;
  }, [teams, filterValue, statusFilter, hasSearchFilter]); // statusFilter dependency might need adjustment based on its type

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  // 2. SORTING: Sort the *entire* filtered list
  const sortedItems = React.useMemo(() => {
    const itemsToSort = [...filteredItems]; // Sort the result of filtering

    if (!sortDescriptor.column) {
      return itemsToSort; // Return filtered items if no sort applied
    }

    itemsToSort.sort((a, b) => {
      const columnKey = sortDescriptor.column;
      let first = a[columnKey];
      let second = b[columnKey];
      let cmp = 0;

      // --- Date Handling Logic ---
      if (columnKey === 'start_date' || columnKey === 'end_date') {
          const firstIsValid = first != null && first !== '';
          const secondIsValid = second != null && second !== '';

          if (!firstIsValid && !secondIsValid) cmp = 0;
          else if (!firstIsValid) cmp = 1;
          else if (!secondIsValid) cmp = -1;
          else {
              const dateA = new Date(first).getTime();
              const dateB = new Date(second).getTime();
              if (isNaN(dateA) && isNaN(dateB)) cmp = 0;
              else if (isNaN(dateA)) cmp = 1;
              else if (isNaN(dateB)) cmp = -1;
              else cmp = dateA < dateB ? -1 : dateA > dateB ? 1 : 0;
          }
      }
      // --- Fallback for Non-Date Columns ---
      else {
          if (first == null && second == null) cmp = 0;
          else if (first == null) cmp = 1;
          else if (second == null) cmp = -1;
           // Improved generic comparison (handle numbers, strings)
           else if (typeof first === 'number' && typeof second === 'number') {
               cmp = first - second; // Simpler number comparison
           } else {
               // Case-insensitive string comparison
               cmp = String(first).toLowerCase().localeCompare(String(second).toLowerCase());
           }
      }

      // Apply the sort direction
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });

    return itemsToSort;
  }, [sortDescriptor, filteredItems]); // Depend on sort descriptor and the filtered list

  // Calculate total pages based on the filtered (and subsequently sorted) items
  const pages = Math.ceil(filteredItems.length / rowsPerPage); // Use filteredItems length

  // 3. PAGINATION: Slice the *sorted* list for the current page
  const paginatedItems = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    // Slice the results of sorting
    return sortedItems.slice(start, end);
  }, [page, sortedItems, rowsPerPage]); // Depend on page, the sorted list, and rowsPerPage

  // --- Handlers ---
  const onNextPage = useNextPage(page, pages, setPage);
  const onPreviousPage = usePreviousPage(page, setPage);
  const onRowsPerPageChange = useRowsPerPageChange(setRowsPerPage, setPage);
  const onSearchChange = useSearchChange(setFilterValue, setPage);

  const renderCell = useRenderCell({ partners, isLoadingTeamPage, setIsLoadingTeamPage, isLoading, router, dbTeams, allSkus }) // Pass dbTeams/allSkus if useRenderCell needs them

  // Reset page to 1 when sorting changes
  const handleSortChange = (descriptor) => {
    setSortDescriptor(descriptor);
    setPage(1);
  };


  return (
    <>
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <div className={'text-xl'}>Clientes</div>
      </div>

      {isLoading ? ( // Simplified conditional rendering
        <div className={'flex justify-center items-center gap-y-4 w-full text-center h-72'}>
          <Progress
            size="md"
            isIndeterminate
            aria-label="Obteniendo clientes de todos los partners..."
            className="max-w-md"
            label="Obteniendo clientes de todos los partners. Esto puede tomar unos segundos..."
          />
        </div>
      ) : teams.length < 1 || partners.length < 1 ? ( // Handle case with no data
         <div>No hay datos de clientes o partners para mostrar.</div>
      ) : (
        <>
          {/* TABLE */}
          <Table
            aria-label="Teams table"
            isStriped
            sortDescriptor={sortDescriptor}
            onSortChange={handleSortChange}
            bottomContent={
              <BottomContent
                // Pass necessary props - ensure BottomContent uses these correctly
                sortedItems={sortedItems}
                teams={teams}
                page={page}
                pages={pages}
                setPage={setPage}
                onPreviousPage={onPreviousPage}
                onNextPage={onNextPage}
                selectedKeys={selectedKeys} // Check if needed
                totalItems={filteredItems.length} // Pass total count for display
                itemsOnPage={paginatedItems.length} // Pass current page count
                hasSearchFilter={hasSearchFilter} // Check if needed
                items={items}
              />
            }
            bottomContentPlacement="outside"
            topContent={
              <TopContent
                // Pass necessary props - ensure TopContent uses these correctly
                filterValue={filterValue}
                onRowsPerPageChange={onRowsPerPageChange}
                onSearchChange={onSearchChange}
                hasSearchFilter={hasSearchFilter} // Check if needed
                totalItems={filteredItems.length} // Pass total count for display
                partners={partners} // Check if needed
                rowsPerPage={rowsPerPage} // Pass rowsPerPage for the dropdown
                teams={teams}
                sortedItems={sortedItems}
              />
            }
            topContentPlacement="outside"
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  // Use allowsSorting directly from the column definition
                  // allowsSorting={column.allowsSorting}
                  allowsSorting={column.uid === "start_date" ? true : false}
                  // Optional: Align numeric/date columns right
                  align={ (column.uid === 'num_licensed_users' || column.uid === 'start_date' || column.uid === 'end_date') ? 'end' : 'start'}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>

            {/* Pass the PAGINATED items to the body */}
            <TableBody items={paginatedItems} emptyContent={"No se encontraron clientes que coincidan con los filtros."}>
              {(team) => {
                // Finding logic seems okay, ensure dbTeams/allSkus are populated if needed
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
      )}
    </>
  )
}

export default TeamsTable;