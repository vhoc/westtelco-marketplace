//@ts-nocheck
"use client"
import { ITeamData } from "@/types";
import React, { useMemo } from "react";
import { Button, Pagination } from "@heroui/react";

interface BottomContentProps {
  sortedItems: ITeamData[]
  teams: ITeamData[]
  items: ITeamData[]
  page: number
  pages: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  onPreviousPage: () => void
  onNextPage: () => void
  selectedKeys: Set<string>
  hasSearchFilter: boolean
}

export const BottomContent = ( { sortedItems, teams, items, page, pages, setPage, onPreviousPage, onNextPage, selectedKeys, hasSearchFilter }: BottomContentProps) => {

  const bottomContentElement = useMemo(() => {
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

  return bottomContentElement

}