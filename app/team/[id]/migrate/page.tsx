import { getPartners } from "../../actions";
import { fetchTeamPageData } from "../../actions";
import { migrateTeam } from "./actions";
import { Link, Card } from "@/lib/hero-ui";
import MigrateTeamForm from "@/components/forms/MigrateTeamForm";

export default async function MigrateTeamPage(
  props: { params: Promise<{ id: string }>; searchParams?: Promise<{ [key: string]: string | undefined | null, message?: string | undefined }> }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const teamId = decodeURIComponent(params.id)
  const { data: partners } = await getPartners()

  const {
    data: teamData,
    error: teamDataError
  } = await fetchTeamPageData(teamId, searchParams?.resellerId)

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center pt-[40px] animate-in opacity-1 max-w-4xl px-3 text-black">
      <main className="flex-1 w-full flex flex-col gap-6 items-center">
        {
          searchParams && searchParams.message ?
            <div className="w-full flex justify-center rounded-md bg-danger-100 text-danger-800 mb-4 px-4 py-1">
              <div>{searchParams.message}</div>
            </div>
            :
            null
        }
        <Link href={`/team/${teamId}`}>Regresar al cliente</Link>
        <Card radius={'none'} shadow="none" className={'p-[45px] color-[#00336A] text-center w-full max-w-[510px] flex flex-col gap-4'}>
          <div className={'text-xl'}>Migrar Cliente</div>
          {
            partners && partners.length >= 1 && teamData?.teamDataFromDropbox ?
              <MigrateTeamForm
                teamName={teamData?.teamDataFromDropbox.name}
                teamId={teamData?.teamDataFromDropbox.id}
                formAction={migrateTeam}
                className="flex flex-col gap-4"
                message={searchParams?.message ? searchParams?.message : undefined}
                partners={partners}
                origin_reseller_id={teamData?.teamDataFromDropbox.reseller_ids[1] ?? teamData?.teamDataFromDropbox.reseller_ids[0]}
              />
              :
              <div>No se encontraron partners.</div>
          }

        </Card>
      </main>
    </div>
  )
}