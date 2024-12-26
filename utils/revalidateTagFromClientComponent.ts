'use server'
import { revalidateTag } from "next/cache"

export async function revalidateTagFromClientComponent(tag: string) {
  revalidateTag(tag)
}