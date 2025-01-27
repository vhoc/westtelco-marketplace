import { IServerActionErrorResult, IServerActionSuccessResult, type IPartner, type ITeamData } from "@/types";


// export interface IGetAllTeamsFromPartnersResult extends IServerActionResult {
//   data?: { teams: Array<ITeamData>, partners: Array<IPartner> } | null
// }

export interface IGetAllTeamsFromPartnersSuccessResult extends Omit<IServerActionSuccessResult, 'data'> {
  data: {
    teams: Array<ITeamData>
    partners: Array<IPartner>
  }
}

export type TGetAllTeamsFromPartnersResult =  IGetAllTeamsFromPartnersSuccessResult
                                            | IServerActionErrorResult