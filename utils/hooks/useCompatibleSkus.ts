import { useState, useEffect } from "react"
import { validateSKUTransition } from "../validators/sku/sku-transition-validator"
import { ISkuInfo, ITransitionOutcome } from "@/types"

/**
 * Custom hook to fetch compatible SKUs based on the current SKU and selected commitment type.
 *
 * @param {Array<ISkuInfo>} allSkus - The complete list of SKUs.
 * @param {string} currentSkuBase - The `sku_base` of the current SKU.
 * @param {string} selectedCommitmentType - The selected commitment type.
 * @param {Function} validateSKUTransition - Function to validate SKU transitions.
 * @returns {Object} An object containing compatible SKUs, loading state, and any error encountered.
 */

const useCompatibleSkus = ( allSkus: Array<ISkuInfo>, currentSkuBase: string, selectedCommitmentType: string ) => {
  const [ compatibleSkus, setCompatibleSkus ] = useState<Array<{ sku_base: string, description: string, commitment_type: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if ( !allSkus || !currentSkuBase || !selectedCommitmentType ) {
      setCompatibleSkus([])
      return
    }

    const fetchCompatibleSkus = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const skusOfThisCommitmentType = allSkus.filter((sku) => sku.commitment_type === selectedCommitmentType)

        const validationPromises = skusOfThisCommitmentType.map((sku) =>
          validateSKUTransition(currentSkuBase, sku.sku_base)
            .then((result) => ({
              sku_base: sku.sku_base,
              description: sku.description,
              commitment_type: sku.commitment_type,
              isAllowed: result.outcome !== 'Not Allowed',
              transitionType: result.type
            }))
            .catch((error) => {
              console.error(`Error validating SKU ${sku.sku_base}: `, error)
              return { sku_base: sku.sku_base, isAllowed: false, transitionType: 'None', description: sku.description, commitment_type: sku.commitment_type }
            })
        )

        const validationResults = await Promise.all(validationPromises)

        const allowedSkus = validationResults
          .filter((result) => result.isAllowed)
          .map((result) => ({
            sku_base: result.sku_base,
            description: result.description,
            commitment_type: result.commitment_type,
          }))

        setCompatibleSkus(allowedSkus)
      } catch (error) {
        console.error('Error fetching compatible SKUs: ', error)
        setError('Failed to fetch compatible SKUs. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompatibleSkus()
  }, [allSkus, currentSkuBase, selectedCommitmentType])

  return { compatibleSkus, isLoading, error }
}

export default useCompatibleSkus