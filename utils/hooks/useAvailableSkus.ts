import { useState, useEffect } from "react"
import { ISkuInfo } from "@/types"

/**
 * Custom hook to fetch available SKUs based on the selected commitment type.
 *
 * @param {Array<ISkuInfo>} allSkus - The complete list of SKUs.
 * @param {string} selectedCommitmentType - The selected commitment type.
 * @param {Function} validateSKUTransition - Function to validate SKU transitions.
 * @returns {Object} An object containing compatible SKUs, loading state, and any error encountered.
 */

const useAvailableSkus = ( allSkus: Array<ISkuInfo>, selectedCommitmentType: string ) => {
  const [ availableSkus, setAvailableSkus ] = useState<Array<{ sku_base: string, description: string, commitment_type: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if ( !allSkus || !selectedCommitmentType ) {
      setAvailableSkus([])
      return
    }

    const fetchCompatibleSkus = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const skusOfThisCommitmentType = allSkus.filter((sku) => sku.commitment_type === selectedCommitmentType)
        const noEnterpriseSkus = skusOfThisCommitmentType.filter((sku) => !sku.license_type.startsWith('enterprise'))
        const onlyDropoxSkus = noEnterpriseSkus.filter((sku) => !sku.license_type.startsWith('sign_'))


        setAvailableSkus(onlyDropoxSkus)
      } catch (error) {
        console.error('Error fetching available SKUs: ', error)
        setError('Failed to fetch available SKUs. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompatibleSkus()
  }, [allSkus, selectedCommitmentType])

  return { availableSkus, isLoading, error }
}

export default useAvailableSkus