import { getPartners } from "../../actions";
import { migrateTeam } from "./actions";
import { Link, Card } from "@nextui-org/react";
import MigrateTeamForm from "@/components/forms/MigrateTeamForm";

export default async function MigrateTeamPage({ params, searchParams }: { params: { id: string }; searchParams?: { [key: string]: string | undefined | null, message?: string | undefined } }) {

  const { data: partners } = await getPartners()

  console.log(`params: `, params)

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center pt-[40px] animate-in opacity-1 max-w-4xl px-3 text-black">
      <main className="flex-1 w-full flex flex-col gap-6 items-center">
        <Link href="/teams">Regresar al cliente</Link>
        <Card radius={'none'} shadow="none" className={'p-[45px] color-[#00336A] text-center w-full max-w-[510px] flex flex-col gap-4'}>
          <div className={'text-xl'}>Migrar Cliente</div>
          {
            partners && partners.length >= 1 ?
              <MigrateTeamForm
                formAction={migrateTeam}
                className="flex flex-col gap-4"
                message={searchParams?.message ? searchParams?.message : undefined}
                partners={partners}
                origin_reseller_id={params?.id}
                // originResellerId={params?.resellerId}
              />
              :
              <div>No se encontraron partners.</div>
          }

        </Card>
      </main>
    </div>
  )

}