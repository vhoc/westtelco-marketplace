"use server"
import { type ITransitionOutcome } from "@/types"
import { getSkuTypes } from "@/utils/licenses"


export const validateSKUTransition = async (originalSku: string, newSku: string): Promise<ITransitionOutcome> => {
  const originalInfo = await getSkuTypes(originalSku)
  // console.log("originalInfo: ", originalInfo)
  const newInfo = await getSkuTypes(newSku)
  // console.log("newInfo: ", newInfo)

  // DA RULES ↴

  /***************************************************************************************
    * FROM STANDARD/ANNUAL
    ***************************************************************************************/

  // --- Start of Transitioning to ANNUAL rules ---------------------------------------- //
  
  // Rule transitioning FROM "STANDARD/ANNUAL" to "STANDARD/ANNUAL"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Not Allowed",
      type: "None"
    }
  }

  // Rule transitioning FROM "STANDARD/ANNUAL" to "BUSINESS/ANNUAL"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade"
    }
  }

  // Rule transitioning FROM "STANDARD/ANNUAL" to "ADVANCED/ANNUAL"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade"
    }
  }

  // Rule transitioning FROM "STANDARD/ANNUAL" to "BUSINESS PLUS/ANNUAL"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade"
    }
  }

  // --- End of Transitioning to ANNUAL rules ------------------------------------------ //

  // --- Start of Transitioning to AC1M rules ------------------------------------------ //

  // Rule transitioning FROM "STANDARD/ANNUAL" to "STANDARD/AC1M"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Commitment change"
    }
  }

  // Rule transitioning FROM "STANDARD/ANNUAL" to "BUSINESS/AC1M"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade"
    }
  }

  // Rule transitioning FROM "STANDARD/ANNUAL" to "ADVANCED/AC1M"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }

  // Rule transitioning FROM "STANDARD/ANNUAL" to "BUSINESS PLUS/AC1M"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }

  // --- End of Transitioning to AC1M rules -------------------------------------------- //

  // --- Start of Transitioning to M rules --------------------------------------------- //
  // Rule transitioning FROM "STANDARD/ANNUAL" to "STANDARD/M"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Commitment change",
    }
  }

  // Rule transitioning FROM "STANDARD/ANNUAL" to "BUSINESS/M"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade"
    }
  }

  // Rule transitioning FROM "STANDARD/ANNUAL" to "ADVANCED/M"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }

  // Rule transitioning FROM "STANDARD/ANNUAL" to "BUSINESS PLUS/M"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade"
    }
  }
  // --- End of Transitioning to M rules ----------------------------------------------- //

  /************************************************************************************* */



  /***************************************************************************************
    * FROM BUSINESS/ANNUAL
    ***************************************************************************************/

  // --- Start of Transitioning to ANNUAL rules ---------------------------------------- //

  // Rule transitioning FROM "BUSINESS/ANNUAL" to "STANDARD/ANNUAL"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Not Allowed",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS/ANNUAL" to "BUSINESS/ANNUAL"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Not Allowed",
      type: "None",
    }
  }

  // Rule transitioning FROM "BUSINESS/ANNUAL" to "ADVANCED/ANNUAL"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS/ANNUAL" to "BUSINESS PLUS/ANNUAL"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }

  // --- End of Transitioning to ANNUAL rules ------------------------------------------ //

  // --- Start of Transitioning to AC1M rules ------------------------------------------ //

  // Rule transitioning FROM "BUSINESS/ANNUAL" to "STANDARD/AC1M"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS/ANNUAL" to "BUSINESS/AC1M"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Commitment change",
    }
  }

  // Rule transitioning FROM "BUSINESS/ANNUAL" to "ADVANCED/AC1M"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS/ANNUAL" to "BUSINESS PLUS/AC1M"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }

  // --- End of Transitioning to AC1M rules -------------------------------------------- //

  // --- Start of Transitioning to M rules --------------------------------------------- //

  // Rule transitioning FROM "BUSINESS/ANNUAL" to "STANDARD/M"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS/ANNUAL" to "BUSINESS/M"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Commitment change",
    }
  }

  // Rule transitioning FROM "BUSINESS/ANNUAL" to "ADVANCED/M"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS/ANNUAL" to "BUSINESS PLUS/M"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }

  // --- End of Transitioning to M rules ----------------------------------------------- //

  /************************************************************************************* */



  /***************************************************************************************
    * FROM ADVANCED/ANNUAL
    ***************************************************************************************/

  // --- Start of Transitioning to ANNUAL rules ---------------------------------------- //
  // Rule transitioning FROM "ADVANCED/ANNUAL" to "STANDARD/ANNUAL"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "ADVANCED/ANNUAL" to "BUSINESS/ANNUAL"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "ADVANCED/ANNUAL" to "ADVANCED/ANNUAL"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Not Allowed",
      type: "None",
    }
  }

  // Rule transitioning FROM "ADVANCED/ANNUAL" to "BUSINESS PLUS/ANNUAL"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }
  // --- End of Transitioning to ANNUAL rules ------------------------------------------ //

  // --- Start of Transitioning to AC1M rules ------------------------------------------ //

  // Rule transitioning FROM "ADVANCED/ANNUAL" to "STANDARD/AC1M"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "ADVANCED/ANNUAL" to "BUSINESS/AC1M"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "ADVANCED/ANNUAL" to "ADVANCED/AC1M"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Commitment change",
    }
  }

  // Rule transitioning FROM "ADVANCED/ANNUAL" to "BUSINESS PLUS/AC1M"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }

  // --- End of Transitioning to AC1M rules -------------------------------------------- //

  // --- Start of Transitioning to M rules --------------------------------------------- //

  // Rule transitioning FROM "ADVANCED/ANNUAL" to "STANDARD/M"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "ADVANCED/ANNUAL" to "BUSINESS/M"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "ADVANCED/ANNUAL" to "ADVANCED/M"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Commitment change",
    }
  }

  // Rule transitioning FROM "ADVANCED/ANNUAL" to "BUSINESS PLUS/M"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }

  // --- End of Transitioning to M rules ----------------------------------------------- //

  /************************************************************************************* */



  /***************************************************************************************
    * FROM BUSINESS PLUS/ANNUAL
    ***************************************************************************************/

  // --- Start of Transitioning to ANNUAL rules ---------------------------------------- //
  // Rule transitioning FROM "BUSINESS PLUS/ANNUAL" to "STANDARD/ANNUAL"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS PLUS/ANNUAL" to "BUSINESS/ANNUAL"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS PLUS/ANNUAL" to "ADVANCED/ANNUAL"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS PLUS/ANNUAL" to "BUSINESS PLUS/ANNUAL"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Not Allowed",
      type: "None",
    }
  }
  // --- End of Transitioning to ANNUAL rules ------------------------------------------ //

  // --- Start of Transitioning to AC1M rules ------------------------------------------ //
  // Rule transitioning FROM "BUSINESS PLUS/ANNUAL" to "STANDARD/AC1M"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS PLUS/ANNUAL" to "BUSINESS/AC1M"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS PLUS/ANNUAL" to "ADVANCED/AC1M"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS PLUS/ANNUAL" to "BUSINESS PLUS/AC1M"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Commitment change",
    }
  }
  // --- End of Transitioning to AC1M rules -------------------------------------------- //

  // --- Start of Transitioning to M rules --------------------------------------------- //
  // Rule transitioning FROM "BUSINESS PLUS/ANNUAL" to "STANDARD/M"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS PLUS/ANNUAL" to "BUSINESS/M"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS PLUS/ANNUAL" to "ADVANCED/M"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS PLUS/ANNUAL" to "BUSINESS PLUS/M"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "Y") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Commitment change",
    }
  }
  // --- End of Transitioning to M rules ----------------------------------------------- //

  /************************************************************************************* */



  /***************************************************************************************
    * FROM STANDARD/AC1M
    ***************************************************************************************/

  // --- Start of Transitioning to ANNUAL rules ---------------------------------------- //
  // Rule transitioning FROM "STANDARD/AC1M" to "STANDARD/ANNUAL"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Not Allowed",
      type: "None",
    }
  }

  // Rule transitioning FROM "STANDARD/AC1M" to "BUSINESS/ANNUAL"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }

  // Rule transitioning FROM "STANDARD/AC1M" to "ADVANCED/ANNUAL"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }

  // Rule transitioning FROM "STANDARD/AC1M" to "BUSINESS PLUS/ANNUAL"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }
  // --- End of Transitioning to ANNUAL rules ------------------------------------------ //

  // --- Start of Transitioning to AC1M rules ------------------------------------------ //
  // Rule transitioning FROM "STANDARD/AC1M" to "STANDARD/AC1M"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Not Allowed",
      type: "None",
    }
  }

  // Rule transitioning FROM "STANDARD/AC1M" to "BUSINESS/AC1M"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }

  // Rule transitioning FROM "STANDARD/AC1M" to "ADVANCED/AC1M"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }

  // Rule transitioning FROM "STANDARD/AC1M" to "BUSINESS PLUS/AC1M"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }
  // --- End of Transitioning to AC1M rules -------------------------------------------- //

  // --- Start of Transitioning to M rules --------------------------------------------- //
  // Rule transitioning FROM "STANDARD/AC1M" to "STANDARD/1M"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Commitment change",
    }
  }

  // Rule transitioning FROM "STANDARD/AC1M" to "BUSINESS/1M"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }

  // Rule transitioning FROM "STANDARD/AC1M" to "ADVANCED/1M"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Upgrade",
    }
  }

  // Rule transitioning FROM "STANDARD/AC1M" to "BUSINESS PLUS/1M"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }
  // --- End of Transitioning to M rules ----------------------------------------------- //

  /************************************************************************************* */



  /***************************************************************************************
    * FROM BUSINESS/AC1M
    ***************************************************************************************/

  // --- Start of Transitioning to ANNUAL rules ---------------------------------------- //
  // Rule transitioning FROM "BUSINESS/AC1M" to "STANDARD/ANNUAL"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS/AC1M" to "BUSINESS/ANNUAL"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Immediate",
      type: "Commitment change",
    }
  }

  // Rule transitioning FROM "BUSINESS/AC1M" to "ADVANCED/ANNUAL"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS/AC1M" to "BUSINESS PLUS/ANNUAL"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }
  // --- End of Transitioning to ANNUAL rules ------------------------------------------ //

  // --- Start of Transitioning to AC1M rules ------------------------------------------ //
  // Rule transitioning FROM "BUSINESS/AC1M" to "STANDARD/AC1M"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS/AC1M" to "BUSINESS/AC1M"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Not Allowed",
      type: "None",
    }
  }

  // Rule transitioning FROM "BUSINESS/AC1M" to "ADVANCED/AC1M"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS/AC1M" to "BUSINESS PLUS/AC1M"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }
  // --- End of Transitioning to AC1M rules -------------------------------------------- //

  // --- Start of Transitioning to M rules --------------------------------------------- //
  // Rule transitioning FROM "BUSINESS/AC1M" to "STANDARD/1M"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS/AC1M" to "BUSINESS/1M"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Commitment change",
    }
  }

  // Rule transitioning FROM "BUSINESS/AC1M" to "ADVANCED/1M"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS/AC1M" to "BUSINESS PLUS/1M"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }
  
  // --- End of Transitioning to M rules ----------------------------------------------- //

  /************************************************************************************* */



  /***************************************************************************************
    * FROM ADVANCED/AC1M
    ***************************************************************************************/

  // --- Start of Transitioning to ANNUAL rules ---------------------------------------- //
  // Rule transitioning FROM "ADVANCED/AC1M" to "STANDARD/ANNUAL"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "ADVANCED/AC1M" to "BUSINESS/ANNUAL"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "ADVANCED/AC1M" to "ADVANCED/ANNUAL"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Immediate",
      type: "Commitment change",
    }
  }

  // Rule transitioning FROM "ADVANCED/AC1M" to "BUSINESS PLUS/ANNUAL"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }
  // --- End of Transitioning to ANNUAL rules ------------------------------------------ //

  // --- Start of Transitioning to AC1M rules ------------------------------------------ //
  // Rule transitioning FROM "ADVANCED/AC1M" to "STANDARD/AC1M"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "ADVANCED/AC1M" to "BUSINESS/AC1M"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "ADVANCED/AC1M" to "ADVANCED/AC1M"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Not Allowed",
      type: "None",
    }
  }

  // Rule transitioning FROM "ADVANCED/AC1M" to "BUSINESS PLUS/AC1M"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }
  // --- End of Transitioning to AC1M rules -------------------------------------------- //

  // --- Start of Transitioning to M rules --------------------------------------------- //
  // Rule transitioning FROM "ADVANCED/AC1M" to "STANDARD/1M"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "ADVANCED/AC1M" to "BUSINESS/1M"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "ADVANCED/AC1M" to "ADVANCED/1M"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Commitment change",
    }
  }

  // Rule transitioning FROM "ADVANCED/AC1M" to "BUSINESS PLUS/1M"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }
  // --- End of Transitioning to M rules ----------------------------------------------- //

  /************************************************************************************* */



  /***************************************************************************************
    * FROM BUSINESS PLUS/AC1M
    ***************************************************************************************/

  // --- Start of Transitioning to ANNUAL rules ---------------------------------------- //
  // Rule transitioning FROM "BUSINESS PLUS/AC1M" to "STANDARD/ANNUAL"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS PLUS/AC1M" to "BUSINESS/ANNUAL"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS PLUS/AC1M" to "ADVANCED/ANNUAL"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS PLUS/AC1M" to "BUSINESS PLUS/ANNUAL"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Immediate",
      type: "Commitment change",
    }
  }
  // --- End of Transitioning to ANNUAL rules ------------------------------------------ //

  // --- Start of Transitioning to AC1M rules ------------------------------------------ //
  // Rule transitioning FROM "BUSINESS PLUS/AC1M" to "STANDARD/AC1M"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS PLUS/AC1M" to "BUSINESS/AC1M"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS PLUS/AC1M" to "ADVANCED/AC1M"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS PLUS/AC1M" to "BUSINESS PLUS/AC1M"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Not Allowed",
      type: "None",
    }
  }
  // --- End of Transitioning to AC1M rules -------------------------------------------- //

  // --- Start of Transitioning to M rules --------------------------------------------- //
  // Rule transitioning FROM "BUSINESS PLUS/AC1M" to "STANDARD/1M"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS PLUS/AC1M" to "BUSINESS/1M"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS PLUS/AC1M" to "ADVANCED/1M"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS PLUS/AC1M" to "BUSINESS PLUS/1M"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "AC1M") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Commitment change",
    }
  }
  // --- End of Transitioning to M rules ----------------------------------------------- //

  /************************************************************************************* */



  /***************************************************************************************
    * FROM STANDARD/M
    ***************************************************************************************/

  // --- Start of Transitioning to ANNUAL rules ---------------------------------------- //
  // Rule transitioning FROM "STANDARD/1M" to "STANDARD/ANNUAL"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "Y")
  ) {
    // console.log({
    //   originalLicenseType: originalInfo.licenseType,
    //   originalCommitmentType: originalInfo.commitmentType,
    //   newLicenseType: newInfo.licenseType,
    //   newCommitmentType: newInfo.commitmentType
    // })
    return {
      outcome: "Immediate",
      type: "Commitment change",
    }
  }

  // Rule transitioning FROM "STANDARD/1M" to "BUSINESS/ANNUAL"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }

  // Rule transitioning FROM "STANDARD/1M" to "ADVANCED/ANNUAL"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }

  // Rule transitioning FROM "STANDARD/1M" to "BUSINESS PLUS/ANNUAL"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }
  // --- End of Transitioning to ANNUAL rules ------------------------------------------ //

  // --- Start of Transitioning to AC1M rules ------------------------------------------ //
  // Rule transitioning FROM "STANDARD/1M" to "STANDARD/AC1M"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Commitment change",
    }
  }

  // Rule transitioning FROM "STANDARD/1M" to "BUSINESS/AC1M"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }

  // Rule transitioning FROM "STANDARD/1M" to "ADVANCED/AC1M"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }

  // Rule transitioning FROM "STANDARD/1M" to "BUSINESS PLUS/AC1M"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }
  // --- End of Transitioning to AC1M rules -------------------------------------------- //

  // --- Start of Transitioning to M rules --------------------------------------------- //
  // Rule transitioning FROM "STANDARD/1M" to "STANDARD/1M"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Not Allowed",
      type: "None",
    }
  }

  // Rule transitioning FROM "STANDARD/1M" to "BUSINESS/1M"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }

  // Rule transitioning FROM "STANDARD/1M" to "ADVANCED/1M"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }

  // Rule transitioning FROM "STANDARD/1M" to "BUSINESS PLUS/1M"
  if (
    (originalInfo.licenseType === "Standard" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }
  // --- End of Transitioning to M rules ----------------------------------------------- //

  /************************************************************************************* */



  /***************************************************************************************
    * FROM BUSINESS/M
    ***************************************************************************************/

  // --- Start of Transitioning to ANNUAL rules ---------------------------------------- //
  // Rule transitioning FROM "BUSINESS/1M" to "STANDARD/ANNUAL"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS/1M" to "BUSINESS/ANNUAL"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Immediate",
      type: "Commitment change",
    }
  }

  // Rule transitioning FROM "BUSINESS/1M" to "ADVANCED/ANNUAL"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS/1M" to "BUSINESS PLUS/ANNUAL"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }
  // --- End of Transitioning to ANNUAL rules ------------------------------------------ //

  // --- Start of Transitioning to AC1M rules ------------------------------------------ //
  // Rule transitioning FROM "BUSINESS/1M" to "STANDARD/AC1M"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS/1M" to "BUSINESS/AC1M"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Commitment change",
    }
  }

  // Rule transitioning FROM "BUSINESS/1M" to "ADVANCED/AC1M"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS/1M" to "BUSINESS PLUS/AC1M"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }
  // --- End of Transitioning to AC1M rules -------------------------------------------- //

  // --- Start of Transitioning to M rules --------------------------------------------- //
  // Rule transitioning FROM "BUSINESS/1M" to "STANDARD/1M"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS/1M" to "BUSINESS/1M"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Not Allowed",
      type: "None",
    }
  }

  // Rule transitioning FROM "BUSINESS/1M" to "ADVANCED/1M"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS/1M" to "BUSINESS PLUS/1M"
  if (
    (originalInfo.licenseType === "Business" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }
  // --- End of Transitioning to M rules ----------------------------------------------- //

  /************************************************************************************* */



  /***************************************************************************************
    * FROM ADVANCED/M
    ***************************************************************************************/

  // --- Start of Transitioning to ANNUAL rules ---------------------------------------- //
  // Rule transitioning FROM "ADVANCED/1M" to "STANDARD/ANNUAL"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "ADVANCED/1M" to "BUSINESS/ANNUAL"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "ADVANCED/1M" to "ADVANCED/ANNUAL"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Immediate",
      type: "Commitment change",
    }
  }

  // Rule transitioning FROM "ADVANCED/1M" to "BUSINESS PLUS/ANNUAL"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }
  // --- End of Transitioning to ANNUAL rules ------------------------------------------ //

  // --- Start of Transitioning to AC1M rules ------------------------------------------ //
  // Rule transitioning FROM "ADVANCED/1M" to "STANDARD/AC1M"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "ADVANCED/1M" to "BUSINESS/ANNUAL"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "ADVANCED/1M" to "ADVANCED/ANNUAL"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Commitment change",
    }
  }

  // Rule transitioning FROM "ADVANCED/1M" to "BUSINESS PLUS/ANNUAL"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }
  // --- End of Transitioning to AC1M rules -------------------------------------------- //

  // --- Start of Transitioning to M rules --------------------------------------------- //
  // Rule transitioning FROM "ADVANCED/1M" to "STANDARD/1M"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "ADVANCED/1M" to "BUSINESS/1M"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "ADVANCED/1M" to "ADVANCED/1M"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Not Allowed",
      type: "None",
    }
  }

  // Rule transitioning FROM "ADVANCED/1M" to "BUSINESS PLUS/1M"
  if (
    (originalInfo.licenseType === "Advanced" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Upgrade",
    }
  }
  // --- End of Transitioning to M rules ----------------------------------------------- //

  /************************************************************************************* */



  /***************************************************************************************
    * FROM BUSINESS PLUS/M
    ***************************************************************************************/

  // --- Start of Transitioning to ANNUAL rules ---------------------------------------- //
  // Rule transitioning FROM "BUSINESS PLUS/1M" to "STANDARD/ANNUAL"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS PLUS/1M" to "BUSINESS/ANNUAL"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS PLUS/1M" to "ADVANCED/ANNUAL"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS PLUS/1M" to "BUSINESS PLUS/ANNUAL"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "Y")
  ) {
    return {
      outcome: "Immediate",
      type: "Commitment change",
    }
  }
  // --- End of Transitioning to ANNUAL rules ------------------------------------------ //

  // --- Start of Transitioning to AC1M rules ------------------------------------------ //
  // Rule transitioning FROM "BUSINESS PLUS/1M" to "STANDARD/AC1M"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS PLUS/1M" to "BUSINESS/AC1M"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS PLUS/1M" to "ADVANCED/AC1M"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS PLUS/1M" to "BUSINESS PLUS/AC1M"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "AC1M")
  ) {
    return {
      outcome: "Immediate",
      type: "Commitment change",
    }
  }
  // --- End of Transitioning to AC1M rules -------------------------------------------- //

  // --- Start of Transitioning to M rules --------------------------------------------- //
  // Rule transitioning FROM "BUSINESS PLUS/1M" to "STANDARD/1M"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Standard" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS PLUS/1M" to "BUSINESS/1M"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Business" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS PLUS/1M" to "ADVANCED/1M"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Advanced" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Scheduled",
      type: "Downgrade",
    }
  }

  // Rule transitioning FROM "BUSINESS PLUS/1M" to "BUSINESS PLUS/1M"
  if (
    (originalInfo.licenseType === "Business Plus" && originalInfo.commitmentType === "1M") &&
    (newInfo.licenseType === "Business Plus" && newInfo.commitmentType === "1M")
  ) {
    return {
      outcome: "Not Allowed",
      type: "None",
    }
  }
  // --- End of Transitioning to M rules ----------------------------------------------- //

  /************************************************************************************* */


  // EVERYTHING ELSE IS "NOT ALLOWED"
  // Including attempting to transition to the same SKU.
  return {
    outcome: "Not Allowed",
    type: "None"
  }
}