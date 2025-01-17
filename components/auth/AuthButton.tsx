import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import UserDropdown from "./UserDropdown";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const {
    data: userData,
  } = await supabase.from('user').select('*').single()


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
    </div>
  );
}
