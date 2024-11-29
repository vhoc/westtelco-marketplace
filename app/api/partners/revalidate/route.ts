import { revalidateTag } from "next/cache";

export async function POST(request: Request) {

  revalidateTag('partners')

  return new Response('Revalidation for each team triggered');
}