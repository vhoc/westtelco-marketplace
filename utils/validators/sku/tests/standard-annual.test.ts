// import { ITransitionOutcome } from "@/types"
import { validateSKUTransition } from "@/utils/validators/sku/sku-transition-validator";

describe('validateSKUTransition', () => {

  /**
   * TESTING SKU: TEAM-ST3L5TVD1Y
   * attempting a transition to all other SKUs and itself
   */

  // Rule transitioning FROM "STANDARD/ANNUAL" to "STANDARD/ANNUAL"
  it('should return { outcome: Not Allowed, type: None }', () => {
    const result = validateSKUTransition('TEAM-ST3L5TVD1Y', 'TEAM-ST3L5TVD1Y')
    expect(result).toEqual({
      outcome: "Not Allowed",
      type: "None"
    })
  })

  // Rule transitioning FROM "STANDARD/ANNUAL" to "BUSINESS/ANNUAL"
  it('should return { outcome: Immediate, type: Upgrade  }', () => {
    const result = validateSKUTransition('TEAM-ST3L5TVD1Y', 'TEAM-BIZ3L1Y')
    expect(result).toEqual({
      outcome: "Immediate",
      type: "Upgrade"
    })
  })

  // Rule transitioning FROM "STANDARD/ANNUAL" to "ADVANCED/ANNUAL"
  it('should return { outcome: Immediate, type: Upgrade }', () => {
    const result = validateSKUTransition('TEAM-ST3L5TVD1Y', 'TEAM-AD3LVE1Y')
    expect(result).toEqual({
      outcome: "Immediate",
      type: "Upgrade"
    })
  })

  // Rule transitioning FROM "STANDARD/ANNUAL" to "BUSINESS PLUS/ANNUAL"
  it('should return { outcome: Immediate , type: Upgrade }', () => {
    const result = validateSKUTransition('TEAM-ST3L5TVD1Y', 'TEAM-BIZPL3L1Y')
    expect(result).toEqual({
      outcome: "Immediate",
      type: "Upgrade"
    })
  })

  // Rule transitioning FROM "STANDARD/ANNUAL" to "STANDARD/AC1M"
  it('should return { outcome: Scheduled , type: Commitment change  }', () => {
    const result = validateSKUTransition('TEAM-ST3L5TVD1Y', 'TEAM-ST3L5TVDAC1M')
    expect(result).toEqual({
      outcome: "Scheduled",
      type: "Commitment change"
    })
  })

  // Rule transitioning FROM "STANDARD/ANNUAL" to "BUSINESS/AC1M"
  it('should return { outcome: Immediate , type: Upgrade }', () => {
    const result = validateSKUTransition('TEAM-ST3L5TVD1Y', 'TEAM-BIZ3LAC1M')
    expect(result).toEqual({
      outcome: "Immediate",
      type: "Upgrade"
    })
  })

  // Rule transitioning FROM "STANDARD/ANNUAL" to "ADVANCED/AC1M"
  it('should return { outcome: Immediate , type: Upgrade }', () => {
    const result = validateSKUTransition('TEAM-ST3L5TVD1Y', 'TEAM-AD3LVEAC1M')
    expect(result).toEqual({
      outcome: "Immediate",
      type: "Upgrade",
    })
  })

  // Rule transitioning FROM "STANDARD/ANNUAL" to "BUSINESS PLUS/AC1M"
  it('should return { outcome: Immediate , type: Upgrade }', () => {
    const result = validateSKUTransition('TEAM-ST3L5TVD1Y', 'TEAM-BIZPL3LAC1M')
    expect(result).toEqual({
      outcome: "Immediate",
      type: "Upgrade",
    })
  })

  // Rule transitioning FROM "STANDARD/ANNUAL" to "STANDARD/M"
  it('should return { outcome: Scheduled , type: Commitment change }', () => {
    const result = validateSKUTransition('TEAM-ST3L5TVD1Y', 'TEAM-ST3L5TVD1M')
    expect(result).toEqual({
      outcome: "Scheduled",
      type: "Commitment change",
    })
  })
  
  // Rule transitioning FROM "STANDARD/ANNUAL" to "BUSINESS/M"
  it('should return { outcome: Immediate , type: Upgrade }', () => {
    const result = validateSKUTransition('TEAM-ST3L5TVD1Y', 'TEAM-BIZ3L1M')
    expect(result).toEqual({
      outcome: "Immediate",
      type: "Upgrade"
    })
  })

  // Rule transitioning FROM "STANDARD/ANNUAL" to "ADVANCED/M"
  it('should return { outcome: Immediate , type: Upgrade }', () => {
    const result = validateSKUTransition('TEAM-ST3L5TVD1Y', 'TEAM-AD3LVE1M')
    expect(result).toEqual({
      outcome: "Immediate",
      type: "Upgrade",
    })
  })

  // Rule transitioning FROM "STANDARD/ANNUAL" to "BUSINESS PLUS/M"
  it('should return { outcome: Immediate , type: Upgrade }', () => {
    const result = validateSKUTransition('TEAM-ST3L5TVD1Y', 'TEAM-BIZPL3L1M')
    expect(result).toEqual({
      outcome: "Immediate",
      type: "Upgrade"
    })
  })

})