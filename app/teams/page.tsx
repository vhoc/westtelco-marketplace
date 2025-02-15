import { Card } from "@nextui-org/react";
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation";
import TeamsTable from "@/components/containers/TeamsTable/TeamsTable";
import { getAllTeamsFromPartners } from "@/app/teams/actions";
import { Alert } from "@nextui-org/react";
import {ITeamDataFromDatabase} from "@/types";
import { getSkus } from "../team/actions";

export default async function TeamsHome() {

  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  const { data: teamsData, error: partnersError } = await getAllTeamsFromPartners()
  const { data: allSkus } = await getSkus()
  // Teams that come from Supabase
  const { data: dbTeams = [] as ITeamDataFromDatabase[] } = await supabase.from('team').select('*') as { data: ITeamDataFromDatabase[] }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center pt-[16px] animate-in opacity-1 px-3 text-black">
      <main className="flex-1 w-full flex flex-col gap-6 items-center px-16">

        <Card radius={'none'} shadow="none" className={'w-full px-[24px] py-[22px] gap-y-4'}>

          {
            teamsData && teamsData.teams && teamsData.partners ?
              <TeamsTable
                teams={teamsData.teams}
                partners={teamsData.partners}
                dbTeams={dbTeams}
                allSkus={allSkus}
              />
              :
              <Alert
                color="danger"
                title={`${partnersError}`}
              />
          }

        </Card>
      </main>
    </div>
  );
}
