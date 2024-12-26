
import { Chip, Button } from "@nextui-org/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRightFromBracket, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import LicenseBox from "@/components/containers/LicenseBox"
import { getTeam } from "../actions"
import { getSkuInfo } from "@/utils/licenses"
import { getPartners } from "@/utils/partner"
import { redirect } from "next/navigation"
import { ISku } from "@/types"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import CancelClientButton from "@/components/buttons/CancelClientButton"
import { getRemainingTime } from "@/utils/time"
import { getTeamFromDatabase } from "../actions"
import { getSkus } from "../actions"
import TeamAdminEmailField from "@/components/forms/TeamAdminEmailField"

export default async function TeamPage({ params, searchParams }: { params: { id: string }; searchParams?: { [key: string]: string | undefined | null, message?: string | undefined } }) {

  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }
  // Get all the team info from the API using the params.id, then render below.
  const teamId = decodeURIComponent(params.id)
  const team = await (await getTeam(teamId, searchParams?.resellerId)).json()
  const dbTeam = await getTeamFromDatabase(teamId)

  const baseSku: ISku | undefined = team.data?.current_state.skus.filter((sku: ISku) => sku.sku_id.startsWith('TEAM-') || sku.sku_id.startsWith('EDU-') || sku.sku_id.startsWith('ENT-'))[0]
  // console.log(`baseSku: `, baseSku)
  const skuInfo = await getSkuInfo(baseSku?.sku_id)
  const renewalSkuInfo = await getSkuInfo(team.data?.renewal_state?.skus[0]?.sku_id)

  const resellerIds = team.data?.reseller_ids
  const remainingTime = getRemainingTime(team.data?.end_datetime ?? 'Hoy')
  const partners = await getPartners(resellerIds || [])
  const { data: allSkus } = await getSkus()

  if (team.code === 409) {
    return redirect(`/team?message=No se tiene acceso a éste cliente, verifique el estatus de éste cliente con Dropbox.')}`)
  }

  if (team.code !== 200) {
    return redirect(`/team?message=${encodeURI(team.message || 'Error desconocido.')}`)
  }

  return (
    <div className="w-full flex flex-col">

      {/* TEAM INFO TOPBAR */}
      <div className={'py-4 px-[80px] bg-white w-full flex justify-between items-end border-b-1 border-b-default-200 gap-2'}>

        {/* TEAM INFO TOPBAR: LEFT SECTION */}
        <div className="flex flex-col">

          <span className={'text-primary-500 text-sm/[12px]'}>{teamId}</span>
          <span className={'text-default-900 text-lg font-medium mt-2'}>{team.data?.name || ''}</span>
          <TeamAdminEmailField admin_email={dbTeam.data?.admin_email} dbTeam={dbTeam.data} />
          
          <Chip radius={'sm'} size={'sm'} className={'bg-primary-100 text-primary-700 my-2'}>{team.data?.country_code}</Chip>          

        </div>

        {/* TEAM INFO TOPBAR: MIDDLE SECTION */}
        <div className="flex flex-col gap-2">
            <span className={'text-[#71717A] text-xs/[8px]'}>Gestionado por</span>
            {
              partners && partners.length >= 1 ?
                <ul className={'list-disc list-inside'}>
                  {
                    partners.map((partner, index) => <li key={`partner-id${index}`} className={'text-[#71717A] text-xs/[8px] leading-4'}>{`${partner.company_name} [${partner.dropbox_reseller_id}]`}</li>)
                  }
                </ul>
                :
                null
            }
          </div>

        {/* TEAM INFO TOPBAR: RIGHT SECTION */}
        <div className="flex gap-4">
          <CancelClientButton
            teamId={teamId}
            teamActive={team.data?.active || false}
            skus={team.data?.current_state.skus}
            resellerIds={team.data?.reseller_ids}
          />

          <Button
            size={'sm'}
            endContent={<FontAwesomeIcon icon={faRightFromBracket} size="lg" />}
            aria-label="Cerrar Cliente"
          >
            <Link href="/teams" aria-label="Cerrar cliente">Cerrar Cliente</Link>
          </Button>
        </div>

      </div>



      {/* TEAM CONTENT AND CONTROLS */}
      <div className={'py-4 w-full flex flex-col items-center justify-center px-[80px]'}>
        {
          searchParams && searchParams.message ?
          <div className="w-full flex justify-center rounded-md bg-danger-100 text-danger-800 mb-4 px-4 py-1">
            <div>{searchParams.message}</div>
          </div>          
        :
        null
        }
        
        <div className={'w-full max-w-[1280px] flex flex-col gap-y-4'}>
          {
            team.data.current_state.is_trial ?
              <div
                className="bg-warning-100 p-3 flex items-center rounded-sm gap-3"
              >
                <FontAwesomeIcon icon={faTriangleExclamation} className="text-warning-500" />
                <div className="flex flex-col items-center">
                  <span className="text-sm leading-5 font-semibold">La versión trial se convertirá a &quot;de paga&quot; automáticamente.</span>
                </div> 
              </div>
            :
              null
          }
          <LicenseBox
            baseSku={team.data?.sku_id || 'Unknown'}
            skuInfo={skuInfo}
            license_description={skuInfo && skuInfo.description ? skuInfo.description : 'SKU sin información'}
            skus={team.data?.current_state.skus || []}
            renewalStateSkus={team.data?.renewal_state?.skus || []}
            renewalSkuInfo={renewalSkuInfo}
            num_licensed_users={team.data?.num_licensed_users || 0}
            space_quota={team.data?.current_state?.space_quota || 0}
            auto_renew={team.data?.auto_renew || false}
            end_date={team.data?.end_date || 'Unknown'}
            end_datetime={team.data?.end_datetime || 'Unknown'}
            teamId={team.data?.id || teamId}
            teamName={team.data?.name || ''}
            active={team.data?.active || false}
            remainingTime={remainingTime}
            currentState={team.data.current_state}
            allSkus={allSkus}
            resellerIds={resellerIds}
          />

        </div>
      </div>
    </div>
  )

}