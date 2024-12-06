// import { ITransitionOutcome } from "@/types"
import { validateSKUTransition } from "@/utils/validators/sku/sku-transition-validator";

describe('validateSKUTransition', () => {

  /**
   * TESTING SKU: TEAM-BIZ3L1Y
   * attempting a transition to all other SKUs and itself
   */

  // Rule transitioning FROM "BUSINESS/ANNUAL" to "STANDARD/ANNUAL"
  it('should return { outcome: Not Allowed, type: Downgrade }', () => {
    const result = validateSKUTransition('TEAM-BIZ3L1Y', 'TEAM-ST3L5TVD1Y')
    expect(result).toEqual({
      outcome: "Not Allowed",
      type: "Downgrade"
    })
  })

  // Rule transitioning FROM "BUSINESS/ANNUAL" to "BUSINESS/ANNUAL"
  it('should return { outcome: Not Allowed, type: None  }', () => {
    const result = validateSKUTransition('TEAM-BIZ3L1Y', 'TEAM-BIZ3L1Y')
    expect(result).toEqual({
      outcome: "Not Allowed",
      type: "None",
    })
  })

  // Rule transitioning FROM "BUSINESS/ANNUAL" to "ADVANCED/ANNUAL"
  it('should return { outcome: Immediate, type: Upgrade }', () => {
    const result = validateSKUTransition('TEAM-BIZ3L1Y', 'TEAM-AD3LVE1Y')
    expect(result).toEqual({
      outcome: "Immediate",
      type: "Upgrade"
    })
  })

  // Rule transitioning FROM "BUSINESS/ANNUAL" to "BUSINESS PLUS/ANNUAL"
  it('should return { outcome: Immediate , type: Upgrade }', () => {
    const result = validateSKUTransition('TEAM-BIZ3L1Y', 'TEAM-BIZPL3L1Y')
    expect(result).toEqual({
      outcome: "Immediate",
      type: "Upgrade"
    })
  })

  // Rule transitioning FROM "BUSINESS/ANNUAL" to "STANDARD/AC1M"
  it('should return { outcome: Scheduled , type: Downgrade  }', () => {
    const result = validateSKUTransition('TEAM-BIZ3L1Y', 'TEAM-ST3L5TVDAC1M')
    expect(result).toEqual({
      outcome: "Scheduled",
      type: "Downgrade"
    })
  })

  // Rule transitioning FROM "BUSINESS/ANNUAL" to "BUSINESS/AC1M"
  it('should return { outcome: Immediate , type: Commitment change }', () => {
    const result = validateSKUTransition('TEAM-BIZ3L1Y', 'TEAM-BIZ3LAC1M')
    expect(result).toEqual({
      outcome: "Immediate",
      type: "Commitment change",
    })
  })

  // Rule transitioning FROM "BUSINESS/ANNUAL" to "ADVANCED/AC1M"
  it('should return { outcome: Immediate , type: Upgrade }', () => {
    const result = validateSKUTransition('TEAM-BIZ3L1Y', 'TEAM-AD3LVEAC1M')
    expect(result).toEqual({
      outcome: "Immediate",
      type: "Upgrade",
    })
  })

  // Rule transitioning FROM "BUSINESS/ANNUAL" to "BUSINESS PLUS/AC1M"
  it('should return { outcome: Immediate , type: Upgrade }', () => {
    const result = validateSKUTransition('TEAM-BIZ3L1Y', 'TEAM-BIZPL3LAC1M')
    expect(result).toEqual({
      outcome: "Immediate",
      type: "Upgrade",
    })
  })

  // Rule transitioning FROM "BUSINESS/ANNUAL" to "STANDARD/M"
  it('should return { outcome: Scheduled , type: Downgrade }', () => {
    const result = validateSKUTransition('TEAM-BIZ3L1Y', 'TEAM-ST3L5TVD1M')
    expect(result).toEqual({
      outcome: "Scheduled",
      type: "Downgrade",
    })
  })
  
  // Rule transitioning FROM "BUSINESS/ANNUAL" to "BUSINESS/M"
  it('should return { outcome: Immediate , type: Commitment change  }', () => {
    const result = validateSKUTransition('TEAM-BIZ3L1Y', 'TEAM-BIZ3L1M')
    expect(result).toEqual({
      outcome: "Immediate",
      type: "Commitment change",
    })
  })

  // Rule transitioning FROM "BUSINESS/ANNUAL" to "ADVANCED/M"
  it('should return { outcome: Immediate , type: Upgrade }', () => {
    const result = validateSKUTransition('TEAM-BIZ3L1Y', 'TEAM-AD3LVE1M')
    expect(result).toEqual({
      outcome: "Immediate",
      type: "Upgrade",
    })
  })

  // Rule transitioning FROM "BUSINESS/ANNUAL" to "BUSINESS PLUS/M"
  it('should return { outcome: Immediate , type: Upgrade }', () => {
    const result = validateSKUTransition('TEAM-BIZ3L1Y', 'TEAM-BIZPL3L1M')
    expect(result).toEqual({
      outcome: "Immediate",
      type: "Upgrade",
    })
  })

  /*************************************************************************** */

  

})