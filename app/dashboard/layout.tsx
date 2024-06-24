import AuthButton from "@/components/auth/AuthButton";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if ( error || !data?.user ){
    redirect('/')
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center">
      <div className="w-full border-4 border-dashed border-blue-300">

        <nav className="w-full flex flex-col justify-center items-center border-b border-b-foreground/10">
          <div className="w-full flex justify-between items-center p-3 text-sm border-b border-b-black" >
            <div>
              West Telco Marketplace
            </div>
            <AuthButton />
          </div>
          <div className="flex w-full px-3 gap-3">
            <Link href={'/dashboard/catalog'}>CATALOGO</Link>
            <Link href={'/dashboard/pricing'}>PRICING</Link>
            <Link href={'/dashboard/partners'}>PARTNERS</Link>
            <Link href={'/dashboard/customers'}>CLIENTES</Link>
            <Link href={'/dashboard/licenses'}>LICENCIAS</Link>
            <Link href={'/dashboard/settings'}>SETTINGS</Link>
          </div>
        </nav>
      </div>

      <div className="w-full animate-in flex-1 flex flex-col gap-20 opacity-0 ">
        {children}
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs border-4 border-dashed border-red-300">
        Dashboard footer
      </footer>
    </div>
  );
}