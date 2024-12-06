// import { ITransitionOutcome } from "@/types"
import { validateSKUTransition } from "@/utils/validators/sku/sku-transition-validator";

describe('validateSKUTransition', () => {

  /**
   * TESTING SKU: TEAM-AD3LVE1Y
   * attempting a transition to all other SKUs and itself
   */

  // Rule transitioning FROM "ADVANCED/ANNUAL" to "STANDARD/ANNUAL"
  it('should return { outcome: Scheduled, type: Downgrade }', () => {
    const result = validateSKUTransition('TEAM-AD3LVE1Y', 'TEAM-ST3L5TVD1Y')
    expect(result).toEqual({
      outcome: "Scheduled",
      type: "Downgrade",
    })
  })

  // Rule transitioning FROM "ADVANCED/ANNUAL" to "BUSINESS/ANNUAL"
  it('should return { outcome: Scheduled, type: Downgrade }', () => {
    const result = validateSKUTransition('TEAM-AD3LVE1Y', 'TEAM-BIZ3L1Y')
    expect(result).toEqual({
      outcome: "Scheduled",
      type: "Downgrade",
    })
  })

  // Rule transitioning FROM "ADVANCED/ANNUAL" to "ADVANCED/ANNUAL"
  it('should return { outcome: Not Allowed, type: None }', () => {
    const result = validateSKUTransition('TEAM-AD3LVE1Y', 'TEAM-AD3LVE1Y')
    expect(result).toEqual({
      outcome: "Not Allowed",
      type: "None",
    })
  })

  // Rule transitioning FROM "ADVANCED/ANNUAL" to "BUSINESS PLUS/ANNUAL"
  it('should return { outcome: Immediate , type: Upgrade }', () => {
    const result = validateSKUTransition('TEAM-AD3LVE1Y', 'TEAM-BIZPL3L1Y')
    expect(result).toEqual({
      outcome: "Immediate",
      type: "Upgrade",
    })
  })

  // Rule transitioning FROM "ADVANCED/ANNUAL" to "STANDARD/AC1M"
  it('should return { outcome: Scheduled , type: Downgrade  }', () => {
    const result = validateSKUTransition('TEAM-AD3LVE1Y', 'TEAM-ST3L5TVDAC1M')
    expect(result).toEqual({
      outcome: "Scheduled",
      type: "Downgrade",
    })
  })

  // Rule transitioning FROM "ADVANCED/ANNUAL" to "BUSINESS/AC1M"
  it('should return { outcome: Scheduled , type: Downgrade }', () => {
    const result = validateSKUTransition('TEAM-AD3LVE1Y', 'TEAM-BIZ3LAC1M')
    expect(result).toEqual({
      outcome: "Scheduled",
      type: "Downgrade",
    })
  })

  // Rule transitioning FROM "ADVANCED/ANNUAL" to "ADVANCED/AC1M"
  it('should return { outcome: Scheduled , type: Commitment change }', () => {
    const result = validateSKUTransition('TEAM-AD3LVE1Y', 'TEAM-AD3LVEAC1M')
    expect(result).toEqual({
      outcome: "Scheduled",
      type: "Commitment change",
    })
  })

  // Rule transitioning FROM "ADVANCED/ANNUAL" to "BUSINESS PLUS/AC1M"
  it('should return { outcome: Immediate, type: Upgrade}', () => {
    const result = validateSKUTransition('TEAM-AD3LVE1Y', 'TEAM-BIZPL3LAC1M')
    expect(result).toEqual({
      outcome: "Immediate",
      type: "Upgrade",
    })
  })

  // Rule transitioning FROM "ADVANCED/ANNUAL" to "STANDARD/M"
  it('should return { outcome: Scheduled , type: Downgrade }', () => {
    const result = validateSKUTransition('TEAM-AD3LVE1Y', 'TEAM-ST3L5TVD1M')
    expect(result).toEqual({
      outcome: "Scheduled",
      type: "Downgrade",
    })
  })
  
  // Rule transitioning FROM "ADVANCED/ANNUAL" to "BUSINESS/M"
  it('should return { outcome: Scheduled , type: Downgrade }', () => {
    const result = validateSKUTransition('TEAM-AD3LVE1Y', 'TEAM-BIZ3L1M')
    expect(result).toEqual({
      outcome: "Scheduled",
      type: "Downgrade",
    })
  })

  // Rule transitioning FROM "ADVANCED/ANNUAL" to "ADVANCED/M"
  it('should return { outcome: Scheduled , type: Commitment change }', () => {
    const result = validateSKUTransition('TEAM-AD3LVE1Y', 'TEAM-AD3LVE1M')
    expect(result).toEqual({
      outcome: "Scheduled",
      type: "Commitment change",
    })
  })

  // Rule transitioning FROM "ADVANCED/ANNUAL" to "BUSINESS PLUS/M"
  it('should return { outcome: Immediate , type: Upgrade }', () => {
    const result = validateSKUTransition('TEAM-AD3LVE1Y', 'TEAM-BIZPL3L1M')
    expect(result).toEqual({
      outcome: "Immediate",
      type: "Upgrade",
    })
  })

  /*************************************************************************** */

  

})