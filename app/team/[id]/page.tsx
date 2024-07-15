
import { Chip, Button } from "@nextui-org/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCirclePlus, faRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import LicenseBox from "@/components/containers/LicenseBox"
import { getTeam } from "@/utils/team"
import { getSkuInfo } from "@/utils/licenses"
import { redirect } from "next/navigation"
import { ISku } from "@/types"
import Link from "next/link"

export default async function TeamPage({ params }: { params: { id: string } }) {

  // Get all the team info from the API using the params.id, then render below.
  const teamId = decodeURIComponent(params.id)
  const team = await getTeam(teamId)
  const baseSku: ISku | undefined = team.data?.current_state.skus.filter((sku) => sku.sku_id.startsWith('TEAM-') || sku.sku_id.startsWith('EDU-'))[0]
  const skuInfo = await getSkuInfo(baseSku?.sku_id)

  // const licensedUsersTotal = team.data?.current_state.skus.reduce((total, sku) => total + sku.quantity, 0)
  if ( team.code !== 200 ) {
    return redirect(`/team?message=${ encodeURI( team.message || 'Error desconocido.' ) }`)
  }

  return (
    <div className="w-full">

      {/* TEAM INFO TOPBAR */}
      <div className={'py-4 px-[80px] bg-white w-full flex justify-between items-end border-b-1 border-b-default-200'}>

        {/* TEAM INFO TOPBAR: LEFT SECTION */}
        <div className="flex flex-col gap-2">
          <span className={'text-primary-500 text-sm/[12px]'}>{teamId}</span>
          <span className={'text-default-900 text-md'}>{team.data?.name || ''}</span>
          <Chip radius={'sm'} size={'sm'} className={'bg-primary-100 text-primary-700'}>{team.data?.country_code}</Chip>
        </div>

        {/* TEAM INFO TOPBAR: RIGHT SECTION */}
        <div className="flex gap-4">
          <Button color="primary" size={'sm'} endContent={<FontAwesomeIcon icon={faCirclePlus} size="lg" aria-label="Añadir SKU" />}>
            Añadir SKU
          </Button>

          <Button
            size={'sm'}
            endContent={<FontAwesomeIcon icon={faRightFromBracket} size="lg" />}
            aria-label="Cerrar Cliente"
          >
            <Link href="/team" aria-label="Cerrar cliente">Cerrar Cliente</Link>
          </Button>
        </div>

      </div>

      {/* TEAM CONTENT AND CONTROLS */}
      <div className={'py-4 w-full flex justify-center px-[80px]'}>
        <div className={'border-1 w-full max-w-[1280px]'}>

          <LicenseBox
            baseSku={team.data?.sku_id || 'Unknown'}
            license_description={skuInfo.description}
            skus={team.data?.current_state.skus}
            renewalStateSkus={team.data?.renewal_state.skus}
            num_licensed_users={ team.data?.num_licensed_users || 0 }
            space_quota={team.data?.current_state?.space_quota || 0}
            auto_renew={team.data?.auto_renew || false}
            end_datetime={team.data?.end_datetime || 'Unknown'}
            teamId={team.data?.id || teamId}
          />

        </div>
      </div>
    </div>
  )

}