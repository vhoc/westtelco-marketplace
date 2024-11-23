import { differenceInMonths, differenceInDays } from 'date-fns'

/**
 * Returns a human-readable string representing the remaining time
 * until the given future date in months or days.
 * 
 * @param futureDate - The future date to calculate the remaining time for.
 * @returns A string like "in X months" or "in Y days".
 */
export const getRemainingTime = ( futureDate: Date ): string => {

  const now = new Date()

  const monthsDiff: number = differenceInMonths(futureDate, now)
  const daysDiff: number = differenceInDays(futureDate, now)

  return monthsDiff >= 1
    ? `${monthsDiff} mes${monthsDiff > 1 ? 'es' : ''}`
    : `${daysDiff} día${daysDiff < 0 || daysDiff <= -1 ? 's' : daysDiff > 1 ? 's' : ''}`
  
}