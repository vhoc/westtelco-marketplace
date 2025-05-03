import Image from "next/image"
import AuthButton from "@/components/auth/AuthButton"
import { Card } from "@/lib/hero-ui"
import { LockKeyhole } from 'lucide-react';
import { Link } from "@/lib/hero-ui";

export default async function UnauthorizedPage(props: { searchParams: Promise<{ message: string }> }) {

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">

      <nav className="w-full flex justify-center  h-16">
        <div className="w-full flex justify-between items-center p-3 text-sm px-[80px] bg-white">
          <div className="flex gap-4 items-center">
            <Image
              src={"https://www.westtelco.com.mx/wp-content/uploads/2022/01/West-Telco-Logo-Marca-Registrada-23.png"}
              width={109}
              height={17}
              alt="West Telco"
            />
            <h1 className="text-lg text-[#00336A] border-l-1 border-[#D9D9D9] pl-[15px]"> Dropbox License Manager</h1>
          </div>
          <AuthButton />
        </div>
      </nav>

      <div className="animate-in w-full flex-1 flex flex-col gap-20 opacity-1 max-w-4xl px-3 text-black">
        <main className="flex-1 w-full flex flex-col gap-6 items-center">
          <Card radius={'none'} shadow="none" className={'p-[45px] color-[#00336A] text-center w-full max-w-[510px] flex flex-col gap-4 items-center'}>
            <LockKeyhole color="#ffbf00" size={48} />
            <h1 className="text-xl leading-7 font-medium text-center text-[#ffbf00]">
              Acceso restringido
            </h1>
            <p>
            Tu usuario no tiene suficientes privilegios para acceder a esta funcionalidad. Contacta a un administrador para obtener más información.
            </p>
            <Link href="/teams">Regresar al inicio</Link>
          </Card>
        </main>
      </div>


    </div>
  )

}