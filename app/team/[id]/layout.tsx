
export default async function TeamLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="flex-1 w-full flex flex-col items-center">
      {children}
    </div>
  );
}