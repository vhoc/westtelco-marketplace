/**
 * Tranlates the commitment type from the database
 * to human friendly language ready to display in the UI
 */
export const commitmentTypesMapHF: Record<string,string> = {
  'annual-annual-payment': 'Costo anual, licencia por año',
  'month-annual-payment': 'Costo mensual, licencia por año',
  'month-monthly-payment': 'Costo mensual, licencia por mes',
}