import { revalidateTag } from "next/cache";

export async function POST(req) {
  // Trigger revalidation for a specific tag
  revalidateTag('teams');

  return new Response('Revalidation triggered');
}

