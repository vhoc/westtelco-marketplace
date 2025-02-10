//@ts-nocheck
"use client"
import { useCallback } from 'react'
import { Button } from '@nextui-org/react'
import { Chip } from '@nextui-org/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { differenceInDays } from 'date-fns'
import { getRemainingTime } from '@/utils/time'
import clsx from 'clsx'
import { ITeamData } from '@/types'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { Key } from 'react'

interface RenderCellHookProps {
  partners: any[] // Replace 'any' with proper partner type
  isLoadingTeamPage: boolean
  setIsLoadingTeamPage: (value: boolean) => void
  isLoading: boolean
  router: AppRouterInstance
}

export const useRenderCell = ({
  partners,
  isLoadingTeamPage,
  setIsLoadingTeamPage,
  isLoading,
  router
}: RenderCellHookProps) => {
  return useCallback((team: ITeamData, columnKey: string | Key | number) => {
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
            <div className="flex gap-1">
              {
                team.active ?
                  <Chip
                    radius="sm"
                    size="sm"
                    className={clsx(
                      'text-tiny',
                      'bg-success-100',
                      'text-success-600'
                    )}
                  >
                    ACTIVO
                  </Chip>
                  :
                  <Chip
                    radius="sm"
                    size="sm"
                    className={clsx(
                      'text-tiny',
                      'bg-default-200',
                      'text-default-400'
                    )}
                  >
                    INACTIVO
                  </Chip>
              }
              {
                team.current_state.is_trial ?
                  <Chip
                    radius="sm"
                    size="sm"
                    className={clsx(
                      'text-tiny',
                      'bg-secondary-100',
                      'text-secondary-600'
                    )}
                  >
                    TRIAL
                  </Chip>
                  :
                  null
              }

            </div>
          )

        case "end_date":
          const humanReadableRemainingTime = getRemainingTime(new Date(team.end_date))
          const daysDiff = differenceInDays(new Date(team.end_date), new Date())
          return (
            <div className={clsx(
              new Date(team.end_date) <= new Date() ? "text-red-600" : "text-black",
              "flex justify-between items-center"
            )}>
              <span>{`${humanReadableRemainingTime}`}</span>
              {
                daysDiff >= 0 && daysDiff <= 15 ?
                  <FontAwesomeIcon icon={faTriangleExclamation} className="text-warning-500" />
                  :
                  null
              }
            </div>
          )

        case "auto_renew":
          return (
            <div>
              {
                team.active ?
                  <Chip radius={'sm'} size={'sm'} className={`text-tiny ${team.auto_renew ? 'bg-secondary-100' : 'bg-default-50'} ${team.auto_renew ? 'text-secondary-600' : 'text-default-500'}`}>
                    {
                      team.auto_renew ? 'AUTO' : 'MANUAL'
                    }
                  </Chip>
                  :
                  null
              }
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
}