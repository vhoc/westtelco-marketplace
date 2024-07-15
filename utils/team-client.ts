"use client"

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