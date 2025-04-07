import ImportTeamForm from "@/components/forms/ImportTeamForm"
import { Card } from "@heroui/react"
import { getPartners } from "../actions"
import { importTeam } from "./actions"
import { Link } from "@heroui/react"

export default async function ImportTeamPage(props: { searchParams: Promise<{ message: string }> }) {
  const searchParams = await props.searchParams;

  const { data: partners } = await getPartners()

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center pt-[40px] animate-in opacity-1 max-w-4xl px-3 text-black">
      <main className="flex-1 w-full flex flex-col gap-6 items-center">
        <Link href="/teams">Regresar a lista de clientes</Link>
        <Card radius={'none'} shadow="none" className={'p-[45px] color-[#00336A] text-center w-full max-w-[510px] flex flex-col gap-4'}>
          <div className={'text-xl'}>Importar Cliente</div>
          {
            partners && partners.length >= 1 ?
              <ImportTeamForm
                formAction={importTeam}
                className="flex flex-col gap-4"
                message={searchParams?.message ? searchParams?.message : undefined}
                partners={partners}
              />
              :
              <div>No se encontraron partners.</div>
          }

        </Card>
      </main>
    </div>
  )
}