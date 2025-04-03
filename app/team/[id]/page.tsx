
import { Chip, Button, Tooltip, } from "@nextui-org/react"
import TeamDropDown from "@/components/buttons/TeamDropDown"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRightFromBracket, faTriangleExclamation, faEllipsisV } from "@fortawesome/free-solid-svg-icons"
import LicenseBox from "@/components/containers/LicenseBox"
import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import CancelClientButton from "@/components/buttons/CancelClientButton"
import TeamAdminEmailField from "@/components/forms/TeamAdminEmailField"
import { fetchTeamPageData } from "../actions"
import { CustomAlert } from "@/components/feedback/CustomAlert"
import FixMissingTeamDataButton from "@/components/buttons/FixMissingTeamDataButton"
import PlanChangeDrawer from "@/components/drawers/PlanChangeDrawer/PlanChangeDrawer"

export default async function TeamPage({ params, searchParams }: { params: { id: string }; searchParams?: { [key: string]: string | undefined | null, message?: string | undefined } }) {

  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  const teamId = decodeURIComponent(params.id)

  const {
    data: teamData,
    error: teamDataError
  } = await fetchTeamPageData(teamId, searchParams?.resellerId)

  if (!teamData) {
    return redirect(`/team?message=${teamDataError}`)
  }

  const {
    teamDataFromDropbox: team,
    teamDataFromDatabase: dbTeam,
    skuInfo,
    renewalSkuInfo,
    allSkus,
    resellerIds,
    remainingTime,
    partners
  } = teamData


  return (
    <div className="w-full flex flex-col">

      {
        !dbTeam ?
          <CustomAlert
            color={'danger'}
            title="ERROR: La información de éste cliente existe en Dropbox pero no se encontró en la base de datos."
          >
            <div className="flex items-center gap-1 mt-3">
              <FixMissingTeamDataButton team={team} />

              <Tooltip placement={'top-end'} color={'warning'} content="Éste error suele generarse cuando se da de alta un cliente nuevo por medio de la API de Dropbox directamente, en lugar de usar el Marketplace para darlo de alta." >
                <Button color={'primary'} variant={'light'} size="sm" >¿Por qué sucede ésto?</Button>
              </Tooltip>
            </div>
          </CustomAlert>
          :
          null
      }

      {/* TEAM INFO TOPBAR */}
      <div className={'py-4 px-[80px] bg-white w-full flex justify-between items-end border-b-1 border-b-default-200 gap-2'}>

        {/* TEAM INFO TOPBAR: LEFT SECTION */}
        <div className="flex flex-col">

          <span className={'text-primary-500 text-sm/[12px]'}>{teamId}</span>
          <span className={'text-default-900 text-lg font-medium mt-2'}>{team?.name || ''}</span>
          {dbTeam ? <TeamAdminEmailField dbTeam={dbTeam} /> : null}

          <Chip radius={'sm'} size={'sm'} className={'bg-primary-100 text-primary-700 my-2'}>{team.country_code}</Chip>

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
        <div className="flex gap-4 items-center">
          {
            team.active ?
              <CancelClientButton
                teamId={teamId}
                teamActive={team.active || false}
                skus={team.current_state.skus}
                resellerIds={team.reseller_ids}
              />
              :
              skuInfo && team.num_licensed_users ?
                <PlanChangeDrawer
                  teamId={teamId}
                  teamName={team.name}
                  end_date={team.end_date}
                  currentSkuInfo={skuInfo}
                  num_licensed_users={team.num_licensed_users}
                  allSkus={allSkus}
                  license_description={skuInfo.description}
                  current_skus={team.current_state.skus}
                  resellerIds={team.reseller_ids}
                  isReinstatement={true}
                />
                :
                null
          }


          <Button
            size={'sm'}
            endContent={<FontAwesomeIcon icon={faRightFromBracket} size="lg" />}
            aria-label="Cerrar Cliente"
          >
            <Link href="/teams" aria-label="Cerrar cliente">Cerrar Cliente</Link>
          </Button>

          <TeamDropDown teamId={teamId} />
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
            team.current_state.is_trial ?
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
            baseSku={team.sku_id || 'Unknown'}
            skuInfo={skuInfo}
            license_description={skuInfo && skuInfo.description ? skuInfo.description : 'SKU sin información'}
            skus={team.current_state.skus || []}
            renewalStateSkus={team.renewal_state?.skus || []}
            renewalSkuInfo={renewalSkuInfo}
            num_licensed_users={team.num_licensed_users || 0}
            space_quota={team.current_state?.space_quota || 0}
            auto_renew={team.auto_renew || false}
            end_date={team.end_date || 'Unknown'}
            end_datetime={team.end_datetime || 'Unknown'}
            teamId={team.id || teamId}
            teamName={team.name || ''}
            active={team.active || false}
            remainingTime={remainingTime}
            currentState={team.current_state}
            allSkus={allSkus}
            resellerIds={resellerIds}
          />

        </div>
      </div>
    </div>
  )

}