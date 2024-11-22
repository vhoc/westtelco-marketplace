import CreateTeamForm from "@/components/forms/CreateTeamForm"
import { createNewTeam } from "./actions"
import { getPartners, getSkus } from "../actions"

export default async function NewTeamPage({ searchParams }: { searchParams: { message: string } }) {

  const { data: partners } = await getPartners()
  const { data: skus } = await getSkus()
  const commitmentTypes = [
    {
      description: "Costo anual, por licencia por año",
      value: "annual-annual-payment",
    },
    {
      description: "Costo mensual, por licencia por año",
      value: "month-annual-payment",
    },
    {
      description: "Costo mensual, por licencia por mes",
      value: "month-monthly-payment",
    },
  ]

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center pt-[40px] animate-in opacity-1 max-w-4xl px-3 text-black">
      
          {
            partners && partners.length >= 1 ?
              <CreateTeamForm
                formAction={createNewTeam}
                className="w-full flex flex-col gap-4 max-w-[510px]"
                message={searchParams?.message ? searchParams?.message : undefined}
                partners={partners}
                commitmentTypes={commitmentTypes}
                skus={skus}
              />
              :
              <div>No se encontraron partners.</div>
          }

    </div>
  )
}