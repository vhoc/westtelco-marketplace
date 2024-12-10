export interface ISkuValidationResponse {
  status: "success" | "error"
  message?: string | undefined
}

export interface ISku {
  sku_id: string
  quantity: number | string
}

export interface ISkuInfo {
  id: number
  sku_base: string
  sku_license: string
  description: string
  usd: number
  eur: number
  gbp: number
  cad: number
  aud: number
  jpy: number
  license_type: string
  commitment_type: string
}

export interface ILicenseState {
  skus: Array<ISku>
  num_licensed_users: number
  space_quota: number
  is_trial?: boolean
}

export interface IUsage {
  num_provisioned_users: number
  space_quota_used: number
}

export interface IAddon {
  id: number
  created_at: string
  sku_addon: string
  description: string
  compatible_plan: Array<string>
  commitment_type: string
  usd: number
  eur: number
  gbp: number
  cad: number
  aud: number
  jpy: number
}

export interface IAddonApiResponse {
  code: number
  data?: IAddon | undefined
  message?: string | undefined
}

export interface ITeamApiResponse {
  code: number
  data?: ITeamData | undefined
  error?: string
  // message?: string | { error_summary: string, error: any } | undefined
  message?: any
}

export interface ITeamsApiResponse {
  code: number
  status?: string | undefined
  data?: { teams: Array<ITeamData> }
  message?: string | undefined
}

export interface IPartnerApiResponse {
  code: number
  data?: IPartner | undefined
  message?: string | undefined
}

export interface IPartner {
  id: number
  created_at: string
  company_name: string
  address_1?: string | undefined
  address_2?: string | undefined
  address_city?: string | undefined
  address_state?: string | undefined
  address_country?: string | undefined
  address_postal_code?: string | undefined
  invoice_data?: object | undefined
  dropbox_reseller_id?: string | undefined
  dropbox_admin_email?: string | undefined
  currency?: TCurrency | undefined
}

export type TCurrency = "mxn" | "usd" | "brl"

export interface ISkuInfoResponse {
  code: number
  data?: ISkuInfo | undefined
  message?: string | undefined
}

export interface IApiErrorResponse {
  code: number,
  status: string
  data: {
    error_summary: string
    error: {
      [key: string]: string
    }
  },
}

export interface ITeamData {
  id: string
  name: string
  num_licensed_users?: number | undefined
  num_provisioned_users?: number | undefined
  sku_id?: string | undefined
  current_state: ILicenseState
  auto_renew: boolean
  renewal_state: ILicenseState
  end_date: string
  end_datetime: string
  active: boolean
  country_code: string
  usage: IUsage
  data_residency: string
  reseller_ids: Array<string>
}

export interface ICreateTeamFormFields {
  name: string
  country_code: string
  invite_admin: string
  invite_admin_confirmation: string
  sku_id: string
  distribuitor_id?: number | undefined
}

export interface INewTeamData {
  name: string
  country_code: string
  invite_admin: string
  skus: Array<ISku>
  distribuitor_id?: number | undefined
}

export type TLicense = "Standard" | "Business" | "Advanced" | "Business Plus" | "Education" | "Enterprise" | "Unknown"
export type TCommitment = "Y" | "AC1M" | "1M" | "Unknown"
export type TTransition = "Upgrade"  | "Downgrade" | "None" | "Commitment change" | "Cancellation"

export interface ISkuType {
  licenseType: TLicense
  commitmentType: TCommitment
}

export interface ITransitionOutcome {
  outcome: "Scheduled" | "Immediate" | "Not Allowed"
  type: TTransition
}