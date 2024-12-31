import { Card } from "@nextui-org/react";
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation";
import TeamsTable from "@/components/containers/TeamsTable";
import { getAllTeamsFromPartners } from "@/app/teams/actions";

export default async function TeamsHome() {

  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  const { teams, partners, error: partnersError } = await getAllTeamsFromPartners()
  // console.log(`partners: `, partners)

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center pt-[16px] animate-in opacity-1 px-3 text-black">
      <main className="flex-1 w-full flex flex-col gap-6 items-center px-16">

        <Card radius={'none'} shadow="none" className={'w-full px-[24px] py-[22px] gap-y-4'}>
            
          <TeamsTable
            teams={teams}
            partners={partners}
          />

        </Card>
      </main>
    </div>
  );
}
