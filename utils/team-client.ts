"use client"
import { ITeamApiResponse } from "@/types"
import { revalidateTag } from "next/cache"

export const isInGracePeriod = (currentDate: Date, endDate: Date): boolean => {
  "use client"
  // console.log(`isInGradePeriod/currentDate: `, currentDate)
  // console.log(`isInGradePeriod/endDate: `, endDate)
  const timeDifference: number = currentDate.getTime() - endDate.getTime()
  const millisecondsPerDay: number = 24 * 60 * 60 * 1000
  const dayDifference: number = timeDifference / millisecondsPerDay
  // console.log(`isInGradePeriod/dayDifference: `, dayDifference)
  // console.log(`isInGradePeriod/NEXT_PUBLIC_DROPBOX_GRACE_PERIOD_DAYS: `, Number(process.env.NEXT_PUBLIC_DROPBOX_GRACE_PERIOD_DAYS))  

  if (dayDifference >= 0 && dayDifference <= Number(process.env.NEXT_PUBLIC_DROPBOX_GRACE_PERIOD_DAYS)) {
    return true
  } else {
    return false
  }
}

// export const cancelTeam = async (teamId: string): Promise<ITeamApiResponse> => {
//   const username = 'cwpduqevlw5jwrd';
//   const password = '4fg7r9k3htx4nem';


//   console.log(`body: `, JSON.stringify({
//     "id": teamId,
//     "reseller_ids": []
//   }))
//   try {
//     // const response = await fetch(`https://api.dropboxapi.com/2/resellers/team/cancel`, {

//     // })
//     const response = await fetch(`https://api.dropboxapi.com/2/resellers/team/cancel`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//           'Authorization': `Basic ${ Buffer.from(`${ username }:${ password }`).toString(`base64`) }`,
//         },
//         body: JSON.stringify({
//           "id": teamId,
//           "reseller_ids": []
//         })
//       }
//     )

//     if (!response.ok) {
//       const error = await response.json()
//       console.log(error)
//       return { code: error.code, message: error.error_summary }
//     }
//     revalidateTag('team')
//     const responseObject = await response.json()
//     return responseObject

//   } catch (error) {
//     console.error('There was an error!', error);
//     //@ts-ignore
//     return { code: 400, message: error.message }
//   }
// }