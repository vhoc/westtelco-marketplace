"use client"

// This is wrong. To be refactored.
export const isInGracePeriod = (currentDate: Date, endDate: Date): boolean => {
  "use client"
  const timeDifference: number = currentDate.getTime() - endDate.getTime()
  const millisecondsPerDay: number = 24 * 60 * 60 * 1000
  const dayDifference: number = timeDifference / millisecondsPerDay

  if (dayDifference >= 0 && dayDifference <= Number(process.env.NEXT_PUBLIC_DROPBOX_GRACE_PERIOD_DAYS)) {
    return true
  } else {
    return false
  }
}