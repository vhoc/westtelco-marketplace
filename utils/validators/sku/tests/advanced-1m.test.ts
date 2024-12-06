// import { ITransitionOutcome } from "@/types"
import { validateSKUTransition } from "@/utils/validators/sku/sku-transition-validator";

describe('validateSKUTransition', () => {

  /**
   * TESTING SKU: TEAM-AD3LVE1M
   * attempting a transition to all other SKUs and itself
   */

  // Rule transitioning FROM "ADVANCED/1M" to "STANDARD/ANNUAL"
  it('should return { outcome: Scheduled, type: Downgrade }', () => {
    const result = validateSKUTransition('TEAM-AD3LVE1M', 'TEAM-ST3L5TVD1Y')
    expect(result).toEqual({
      outcome: "Scheduled",
      type: "Downgrade",
    })
  })

  // Rule transitioning FROM "ADVANCED/1M" to "BUSINESS/ANNUAL"
  it('should return { outcome: Scheduled, type: Downgrade }', () => {
    const result = validateSKUTransition('TEAM-AD3LVE1M', 'TEAM-BIZ3L1Y')
    expect(result).toEqual({
      outcome: "Scheduled",
      type: "Downgrade",
    })
  })

  // Rule transitioning FROM "ADVANCED/1M" to "ADVANCED/ANNUAL"
  it('should return { outcome: Immediate, type: Commitment change }', () => {
    const result = validateSKUTransition('TEAM-AD3LVE1M', 'TEAM-AD3LVE1Y')
    expect(result).toEqual({
      outcome: "Immediate",
      type: "Commitment change",
    })
  })

  // Rule transitioning FROM "ADVANCED/1M" to "BUSINESS PLUS/ANNUAL"
  it('should return { outcome: Immediate, type: Upgrade }', () => {
    const result = validateSKUTransition('TEAM-AD3LVE1M', 'TEAM-BIZPL3L1Y')
    expect(result).toEqual({
      outcome: "Immediate",
      type: "Upgrade",
    })
  })

  // Rule transitioning FROM "ADVANCED/1M" to "STANDARD/AC1M"
  it('should return { outcome: Scheduled, type: Downgrade }', () => {
    const result = validateSKUTransition('TEAM-AD3LVE1M', 'TEAM-ST3L5TVDAC1M')
    expect(result).toEqual({
      outcome: "Scheduled",
      type: "Downgrade",
    })
  })

  // Rule transitioning FROM "ADVANCED/1M" to "BUSINESS/AC1M"
  it('should return { outcome: Scheduled, type: Downgrade }', () => {
    const result = validateSKUTransition('TEAM-AD3LVE1M', 'TEAM-BIZ3LAC1M')
    expect(result).toEqual({
      outcome: "Scheduled",
      type: "Downgrade",
    })
  })

  // Rule transitioning FROM "ADVANCED/1M" to "ADVANCED/AC1M"
  it('should return { outcome: Immediate, type: Commitment change }', () => {
    const result = validateSKUTransition('TEAM-AD3LVE1M', 'TEAM-AD3LVEAC1M')
    expect(result).toEqual({
      outcome: "Immediate",
      type: "Commitment change",
    })
  })

  // Rule transitioning FROM "ADVANCED/1M" to "BUSINESS PLUS/AC1M"
  it('should return { outcome: Immediate, type: Upgrade }', () => {
    const result = validateSKUTransition('TEAM-AD3LVE1M', 'TEAM-BIZPL3LAC1M')
    expect(result).toEqual({
      outcome: "Immediate",
      type: "Upgrade",
    })
  })

  // Rule transitioning FROM "ADVANCED/1M" to "STANDARD/M"
  it('should return { outcome: Scheduled, type: Downgrade }', () => {
    const result = validateSKUTransition('TEAM-AD3LVE1M', 'TEAM-ST3L5TVD1M')
    expect(result).toEqual({
      outcome: "Scheduled",
      type: "Downgrade",
    })
  })
  
  // Rule transitioning FROM "ADVANCED/1M" to "BUSINESS/M"
  it('should return { outcome: Scheduled, type: Downgrade }', () => {
    const result = validateSKUTransition('TEAM-AD3LVE1M', 'TEAM-BIZ3L1M')
    expect(result).toEqual({
      outcome: "Scheduled",
      type: "Downgrade",
    })
  })

  // Rule transitioning FROM "ADVANCED/1M" to "ADVANCED/M"
  it('should return { outcome: Not Allowed, type: None }', () => {
    const result = validateSKUTransition('TEAM-AD3LVE1M', 'TEAM-AD3LVE1M')
    expect(result).toEqual({
      outcome: "Not Allowed",
      type: "None",
    })
  })

  // Rule transitioning FROM "ADVANCED/1M" to "BUSINESS PLUS/M"
  it('should return { outcome: Immediate, type: Upgrade }', () => {
    const result = validateSKUTransition('TEAM-AD3LVE1M', 'TEAM-BIZPL3L1M')
    expect(result).toEqual({
      outcome: "Immediate",
      type: "Upgrade",
    })
  })

})