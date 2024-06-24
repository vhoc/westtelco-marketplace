import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
// import { getTranslations } from "next-intl/server";

export default async function AuthButton() {
  const supabase = createClient();
  // const t = await getTranslations('Dashboard')

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <form action={signOut}>
        <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
          { "Cerrar sesión" }
        </button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Link
        href="/login"
        className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
      >
        { "Ingresar" }
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
