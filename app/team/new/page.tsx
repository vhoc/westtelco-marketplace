import CreateTeamForm from "@/components/forms/CreateTeamForm"
import { createNewTeam } from "./actions"
import { getPartners, getSkus } from "../actions"
import { commitmentTypes } from "@/utils/commitmentTypes"

export default async function NewTeamPage(props: { searchParams: Promise<{ message: string }> }) {
  const searchParams = await props.searchParams;

  const { data: partners } = await getPartners()
  const { data: skus } = await getSkus()

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