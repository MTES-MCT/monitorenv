import { isCypress } from '@utils/isCypress'

export const isDashboardEnabled = () =>
  isCypress()
    ? window.Cypress.env('CYPRESS_FRONTEND_DASHBOARD') === 'true'
    : import.meta.env.FRONTEND_DASHBOARD_ENABLED === 'true'
