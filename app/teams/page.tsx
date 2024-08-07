import { Card } from "@nextui-org/react";
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation";
import TeamsTable from "@/components/containers/TeamsTable";
import { getAllTeams } from "@/utils/team";
import { ITeamData } from "@/types";

export default async function TeamsHome({ searchParams }: { searchParams: { message: string } }) {

  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  // let isLoading = false
  // let teams: Array<ITeamData> = []

  // try {
  //   isLoading = true
  //   teams = await getAllTeams()

  // } catch (error) {
  //   console.error(error)
  // } finally {
  //   isLoading = false
  // }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center pt-[16px] animate-in opacity-1 px-3 text-black">
      <main className="flex-1 w-full flex flex-col gap-6 items-center px-16">

        <Card radius={'none'} shadow="none" className={'w-full px-[24px] py-[22px] gap-y-4'}>

          <TeamsTable />

        </Card>

        {/* <Card radius={'none'} shadow="none" className={'p-[45px] color-[#00336A] text-center w-full max-w-[510px] flex flex-col gap-4'}>
          <div className={'text-xl'}>Encontrar cliente</div>
          <FindTeamForm
            formAction={navigateToTeam}
            className="flex flex-col gap-4"
            message={searchParams?.message ? searchParams?.message : undefined}
          />
        </Card> */}
      </main>
    </div>
  );
}
