'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function createNewPartner(formData: FormData) {

  const partnerData = {
    company_name: formData.get('company_name') as string,
    dropbox_reseller_id: formData.get('dropbox_reseller_id') as string,
    dropbox_admin_email: formData.get('dropbox_admin_email') as string,
    address_1: formData.get('address_1') as string,
    address_2: formData.get('address_2') as string,
    address_city: formData.get('address_city') as string,
    address_state: formData.get('address_state') as string,
    address_postal_code: formData.get('address_postal_code') as string,
    address_country: formData.get('address_country') as string,
    currency: formData.get('currency') as string,
  }

  console.log(`partnerData: `, partnerData)

  const supabase = createClient()
  const { data, error } = await supabase
    .from('partner')
    .insert([
      {
        company_name: partnerData.company_name,
        dropbox_reseller_id: partnerData.dropbox_reseller_id,
        dropbox_admin_email: partnerData.dropbox_admin_email,
        address_1: partnerData.address_1,
        address_2: partnerData.address_2,
        address_city: partnerData.address_city,
        address_state: partnerData.address_state,
        address_postal_code: partnerData.address_postal_code,
        address_country: partnerData.address_country,
        currency: partnerData.currency,
        distribuitor_id: process.env.DISTRIBUITOR_INTERNAL_ID,
      }
    ])
    .select()
    .single()


  if (error) {
    console.error(error)
    return redirect(`/partner/new?message=El partner no pudo ser creado. Por favor contactar a soporte de UX Neighbor. Mensaje: ${ error.message }`);
  }

  if (data && data.id) {
    // TODO: INDIVIDUAL PARTNER PAGE
    return redirect(`/partners`)
  }

  return redirect(`/partner/new?message=Hubo un error desconocido, por favor contacte a soporte de UX Neighbor.`);
  
}
