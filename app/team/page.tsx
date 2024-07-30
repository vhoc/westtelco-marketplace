import { Card } from "@nextui-org/react";
import { navigateToTeam } from "@/utils/team";
import FindTeamForm from "@/components/forms/FindTeamForm";
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation";

export default async function Home({ searchParams }: { searchParams: { message: string } }) {

  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if ( error || !data?.user ){
    redirect('/login')
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center pt-[40px] animate-in opacity-1 max-w-4xl px-3 text-black">
        <main className="flex-1 w-full flex flex-col gap-6 items-center">
          <Card radius={'none'} shadow="none" className={'p-[45px] color-[#00336A] text-center w-full max-w-[510px] flex flex-col gap-4'}>
            <div className={'text-xl'}>Encontrar cliente</div>
              <FindTeamForm
                formAction={navigateToTeam}
                className="flex flex-col gap-4"
                message={ searchParams?.message ? searchParams?.message : undefined }
              />
          </Card>
        </main>
    </div>
  );
}
