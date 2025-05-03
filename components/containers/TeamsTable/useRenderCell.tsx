//@ts-nocheck
"use client"
import { useCallback } from 'react'
import { Button } from "@heroui/react"
import { Link } from "@heroui/react"
import { Chip } from "@heroui/react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTriangleExclamation, faEye } from '@fortawesome/free-solid-svg-icons'
import { differenceInDays } from 'date-fns'
import { getRemainingTime } from '@/utils/time'
import clsx from 'clsx'
import { ITeamData } from '@/types'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { Key } from 'react'
import { commitmentTypesMapHF } from '@/utils/human-friendly/commitment-types'
import ProtectedElement from '@/components/authorization/ProtectedElement'

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
  // setIsLoadingTeamPage,
  isLoading,
  router
}: RenderCellHookProps) => {
  return useCallback((team: ITeamData, columnKey: string | Key | number, currentTeam?: ITeamDataFromDatabase, currentSkuInfo?: ISkuInfo) => {
    const cellValue = team[columnKey]
    const currentResellerId = team.reseller_ids.filter(item => item !== process.env.NEXT_PUBLIC_DISTRIBUITOR_ID)
    const urlEncodedId = encodeURIComponent(team.id as string)

    const humanReadableRemainingTime = getRemainingTime(new Date(team.end_date))
    const daysDiff = differenceInDays(new Date(team.end_date), new Date())

    if (currentResellerId) {
      const currentPartner = partners.find(item => item.dropbox_reseller_id === currentResellerId[0])
      switch (columnKey) {

        case "name":
          return (
            <div className={'flex flex-col'}>
              <span className='font-medium'>{team.name}</span>
              <span className={'text-tiny text-default-500'}>{team.id}</span>
            </div>
          )

        case "reseller_ids":
          return (
            <div className="text-black flex flex-col">
              {
                currentPartner ?
                  <>
                    <span className='font-medium'>{currentPartner.company_name}</span>
                    <span className={'text-tiny text-default-500'}>{`[${currentResellerId[0]}]`}</span>
                  </>
                  :
                  'N/A'
              }
            </div>
          )

        case "admin_email":
          return (
            <div className={currentTeam && currentTeam.admin_email ? 'text-primary-500' : 'text-default-400'}>
              {
                currentTeam && currentTeam.admin_email ?
                  `${currentTeam.admin_email}`
                  :
                  'No disponible'
              }
            </div>
          )

        case "sku_id":
          return (
            <div className="text-black flex flex-col">
              {
                currentSkuInfo ?
                  <>
                    <span className='font-medium text-[#0061FE]'>{currentSkuInfo.description}</span>
                    <span className={'text-tiny text-default-800'}>{commitmentTypesMapHF[currentSkuInfo.commitment_type]}</span>
                    <span className={'text-tiny text-default-500'}>{`[${currentSkuInfo.sku_base}]`}</span>
                  </>
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
          return (
            <div className={clsx(
              new Date(team.end_date) <= new Date() ? "text-red-600" : "text-black",
              "flex justify-between items-center"
            )}>
              <div className='flex flex-col'>
                <span>
                  {`${new Date(team.end_date).toLocaleString(process.env.NEXT_PUBLIC_LOCALE, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    timeZone: process.env.NEXT_PUBLIC_TIMEZONE
                  })}`}
                </span>
                <span className={'text-tiny text-default-500'}>{`(${humanReadableRemainingTime})`}</span>
              </div>

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
            <div className={'flex justify-center items-center'}>

              <Button
                size={'sm'}
                variant={'light'}
                as={Link}
                href={`/team/${urlEncodedId}?resellerId=${currentResellerId[0]}`}
              >
                <ProtectedElement
                  roles={['westtelco-admin', 'westtelco-agent']}
                  deniedFallback={<FontAwesomeIcon icon={faEye} color={'#71717A'} size={'lg'} />}
                >
                  <FontAwesomeIcon icon={faPencil} color={'#71717A'} size={'lg'} />
                </ProtectedElement>
              </Button>
            </div>
          )

        default:
          return cellValue

      }
    }
  }, [partners, isLoadingTeamPage, isLoading, router])
}