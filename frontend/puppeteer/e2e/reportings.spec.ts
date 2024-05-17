import { beforeEach, expect, it, jest } from '@jest/globals'

import { getFirstTab, getInputContent, listenToConsole, setPuppeteerEnvironment, wait } from './utils'

import type { Page } from 'puppeteer'

const TIMEOUT = 120 * 1000

const IS_CI = Boolean(process.env.CI)
const WEBAPP_PORT = IS_CI ? 8880 : 3000
const WEBAPP_HOST = 'localhost'

const URL = `http://${WEBAPP_HOST}:${WEBAPP_PORT}/side_window`

let pageA: Page
let pageB: Page

jest.retryTimes(2)

describe('Reportings Form', () => {
  beforeEach(async () => {
    // @ts-ignore
    pageA = await getFirstTab(browsers[0])
    listenToConsole(pageA, 1)

    // @ts-ignore
    pageB = await getFirstTab(browsers[1])
    listenToConsole(pageB, 2)

    await wait(1000)
    /* eslint-disable no-restricted-syntax */
    for (const page of [pageA, pageB]) {
      await page.goto(URL)
      await wait(1000)

      setPuppeteerEnvironment(page)

      await page.click('[title="signalements"]')
      await wait(1000)
      await page.click('[data-cy="edit-reporting-6"]')
      await wait(2000)
    }
  }, 50000)

  it(
    'Two reportings must be synchronized on form update',
    async () => {
      /**
       * User A modify "Target details"
       */
      const operatorName = await pageA.waitForSelector('[name="targetDetails.0.operatorName"]')
      await operatorName.click({ clickCount: 10 })
      await operatorName.type('A new company name', { delay: 50 })
      // Wait for the update to be sent
      await wait(2000)
      // Should send the update to the second page
      expect(await getInputContent(pageB, '[name="targetDetails.0.operatorName"]')).toBe('A new company name')

      /**
       * User B delete attached mission
       */
      await pageB.click('[data-cy="unattach-mission-button"]')
      // Wait for the update to be sent
      await wait(2000)
      // Should send the update to the second page
      await pageA.waitForSelector('[data-cy="attach-mission-button"]')
      await wait(2000)
    },
    TIMEOUT
  )
})
