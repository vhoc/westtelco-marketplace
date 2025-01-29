import { type IPartner, type ITeamData, type ISkuInfo, type ISku, type ITeamDataFromDatabase } from "@/types";

export interface IServerActionSuccessResult {
  ok: true
  data: Record<string, unknown>
  error?: never
}

export interface IServerActionErrorResult {
  ok: false
  error: string
  data?: never
}

export type TServerActionResult = IServerActionSuccessResult | IServerActionErrorResult

export interface IGetAllTeamsFromPartnersSuccessResult extends Omit<IServerActionSuccessResult, 'data'> {
  data: {
    teams: Array<ITeamData>
    partners: Array<IPartner>
  }
}

export type TGetAllTeamsFromPartnersResult =  IGetAllTeamsFromPartnersSuccessResult | IServerActionErrorResult

export interface IGetTeamDataSuccessResult extends Omit<IServerActionSuccessResult, 'data'> {
  data: {
    teamDataFromDropbox: ITeamData
    teamDataFromDatabase: ITeamDataFromDatabase
    baseSku: ISku
    skuInfo: ISkuInfo | null
    renewalSkuInfo: ISkuInfo | null
    allSkus: Array<ISkuInfo>
    resellerIds: Array<string>
    remainingTime: string
    partners: Array<IPartner>
  }
}

export type TGetTeamDataResult = IGetTeamDataSuccessResult | IServerActionErrorResult