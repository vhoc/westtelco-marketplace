//@ts-nocheck
"use client"
import { useCallback } from 'react';

export const useNextPage = (page: number, pages: number, setPage: (page: number) => void) => {
  return useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages, setPage]);
};

export const usePreviousPage = (page: number, setPage: (page: number) => void) => {
  return useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page, setPage]);
};

export const useRowsPerPageChange = (
  setRowsPerPage: (rows: number) => void,
  setPage: (page: number) => void
) => {
  return useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, [setRowsPerPage, setPage]);
};

export const useSearchChange = (
  setFilterValue: (value: string) => void,
  setPage: (page: number) => void
) => {
  return useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, [setFilterValue, setPage]);
};