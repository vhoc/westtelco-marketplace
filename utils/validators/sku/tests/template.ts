// import { ITransitionOutcome } from "@/types"
import { validateSKUTransition } from "@/utils/validators/sku/sku-transition-validator";

describe('validateSKUTransition', () => {

  /**
   * TESTING SKU: TEAM-######
   * attempting a transition to all other SKUs and itself
   */

  // Rule transitioning FROM "XXXXX/AC1M" to "STANDARD/ANNUAL"
  it('should return { outcome: , type: }', () => {
    const result = validateSKUTransition('TEAM-######', 'TEAM-ST3L5TVD1Y')
    expect(result).toEqual({
      
    })
  })

  // Rule transitioning FROM "XXXXX/AC1M" to "BUSINESS/ANNUAL"
  it('should return { outcome: , type: }', () => {
    const result = validateSKUTransition('TEAM-######', 'TEAM-BIZ3L1Y')
    expect(result).toEqual({

    })
  })

  // Rule transitioning FROM "XXXXX/AC1M" to "ADVANCED/ANNUAL"
  it('should return { outcome: , type:  }', () => {
    const result = validateSKUTransition('TEAM-######', 'TEAM-AD3LVE1Y')
    expect(result).toEqual({

    })
  })

  // Rule transitioning FROM "XXXXX/AC1M" to "BUSINESS PLUS/ANNUAL"
  it('should return { outcome: , type:  }', () => {
    const result = validateSKUTransition('TEAM-######', 'TEAM-BIZPL3L1Y')
    expect(result).toEqual({
      
    })
  })

  // Rule transitioning FROM "XXXXX/AC1M" to "STANDARD/AC1M"
  it('should return { outcome: , type:  }', () => {
    const result = validateSKUTransition('TEAM-######', 'TEAM-ST3L5TVDAC1M')
    expect(result).toEqual({
      
    })
  })

  // Rule transitioning FROM "XXXXX/AC1M" to "BUSINESS/AC1M"
  it('should return { outcome: , type:  }', () => {
    const result = validateSKUTransition('TEAM-######', 'TEAM-BIZ3LAC1M')
    expect(result).toEqual({
      
    })
  })

  // Rule transitioning FROM "XXXXX/AC1M" to "ADVANCED/AC1M"
  it('should return { outcome: , type:  }', () => {
    const result = validateSKUTransition('TEAM-######', 'TEAM-AD3LVEAC1M')
    expect(result).toEqual({
      
    })
  })

  // Rule transitioning FROM "XXXXX/AC1M" to "BUSINESS PLUS/AC1M"
  it('should return { outcome: , type:  }', () => {
    const result = validateSKUTransition('TEAM-######', 'TEAM-BIZPL3LAC1M')
    expect(result).toEqual({
      
    })
  })

  // Rule transitioning FROM "XXXXX/AC1M" to "STANDARD/M"
  it('should return { outcome: , type:  }', () => {
    const result = validateSKUTransition('TEAM-######', 'TEAM-ST3L5TVD1M')
    expect(result).toEqual({
      
    })
  })
  
  // Rule transitioning FROM "XXXXX/AC1M" to "BUSINESS/M"
  it('should return { outcome: , type: }', () => {
    const result = validateSKUTransition('TEAM-######', 'TEAM-BIZ3L1M')
    expect(result).toEqual({
      
    })
  })

  // Rule transitioning FROM "XXXXX/AC1M" to "ADVANCED/M"
  it('should return { outcome: , type:  }', () => {
    const result = validateSKUTransition('TEAM-######', 'TEAM-AD3LVE1M')
    expect(result).toEqual({
      
    })
  })

  // Rule transitioning FROM "XXXXX/AC1M" to "BUSINESS PLUS/M"
  it('should return { outcome: , type:  }', () => {
    const result = validateSKUTransition('TEAM-######', 'TEAM-BIZPL3L1M')
    expect(result).toEqual({
      
    })
  })

})