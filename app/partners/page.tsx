import { Card } from "@/lib/hero-ui";
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation";
import { getPartners } from "@/utils/partner";
import PartnersTable from "@/components/containers/PartnersTable";

export default async function PartnersHome() {

  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  const partners = await getPartners()

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center pt-[16px] animate-in opacity-1 px-3 text-black">
      <main className="flex-1 w-full flex flex-col gap-6 items-center px-16">

        <Card radius={'none'} shadow="none" className={'w-full px-[24px] py-[22px] gap-y-4'}>
            
          <PartnersTable partners={partners} />

        </Card>

      </main>
    </div>
  );
}
