import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
// import { getTranslations } from "next-intl/server";
import UserDropdown from "./UserDropdown";

export default async function AuthButton() {
  const supabase = createClient();
  // const t = await getTranslations('Dashboard')

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const {
    data: userData,
  } = await supabase.from('user').select('*').single()

  // const signOut = async () => {
  //   "use server";

  //   const supabase = createClient();
  //   await supabase.auth.signOut();
  //   return redirect("/login");
  // };

  return user ? (
    <div className="flex items-center gap-4">
      <UserDropdown user={user} userData={userData} />
    </div>
  ) : (
    <div className="flex gap-2">
      <Link
        href="/login"
        className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover text-black"
      >
        {"Ingresar"}
      </Link>
      {/* <Link
        href="/register"
        className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
      >
        { "Registrarme" }
      </Link> */}
    </div>
  );
}
