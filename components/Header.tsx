
export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="flex gap-8 justify-center items-center">
        
        <a href="https://nextjs.org/" target="_blank" rel="noreferrer">
          Something here.
        </a>
      </div>
      <h1 className="sr-only">West Telco Marketplace homepage</h1>
      
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
