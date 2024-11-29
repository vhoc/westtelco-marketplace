import { revalidateTag } from "next/cache";

export async function POST() {
  // Trigger revalidation for a specific tag
  revalidateTag('teams');

  return new Response('Revalidation triggered');
}

