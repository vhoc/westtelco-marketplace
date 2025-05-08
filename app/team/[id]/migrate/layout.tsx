import ProtectedPage from "@/components/authorization/ProtectedPage";

export default async function TeamMigrateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <ProtectedPage roles={['westtelco-admin', 'westtelco-agent']}>
      {children}
    </ProtectedPage>
  )

}