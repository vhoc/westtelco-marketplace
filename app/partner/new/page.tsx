import CreatePartnerForm from "@/components/forms/CreatePartnerForm"
import { Card } from "@/lib/hero-ui"
import { createNewPartner } from "./actions"

export default async function NewPartnerPage(props: { searchParams: Promise<{ message: string }> }) {
  const searchParams = await props.searchParams;


  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center pt-[40px] animate-in opacity-1 max-w-4xl px-3 text-black">
        <main className="flex-1 w-full flex flex-col gap-6 items-center">
          <Card radius={'none'} shadow="none" className={'p-[45px] color-[#00336A] text-center w-full max-w-[510px] flex flex-col gap-4'}>
            <div className={'text-xl'}>Crear Partner</div>
              <CreatePartnerForm
                formAction={createNewPartner}
                className="flex flex-col gap-4"
                message={ searchParams?.message ? searchParams?.message : undefined }
              />
          </Card>
        </main>
    </div>
  )
}