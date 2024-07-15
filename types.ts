export interface ISku {
  sku_id: string
  quantity: number
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
  message?: string | undefined
}

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
}