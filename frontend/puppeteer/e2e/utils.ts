import assert from 'assert'

import type { Browser, Page } from 'puppeteer'

export function listenToConsole(page, index) {
  page
    .on('console', message => {
      const messageType = message.type().substr(0, 3).toUpperCase()
      console.log(`[Page ${index}] ${messageType}: ${message.text()}`)

      if (messageType === 'ERR') {
        console.log(message.args(), message.stackTrace())
        throw new Error(message.text())
      }
    })
    .on('response', response => {
      if (response.url().includes('/bff/') || response.url().includes('/api/')) {
        console.log(`[Page ${index}] HTTP ${response.request().method()} ${response.status()}: ${response.url()}`)
      }
    })
}

export async function assertContains(page, selector, text) {
  const nodes = await page.$$eval(selector, elements => elements.map(element => element.textContent))
  const node = nodes.find(content => content.includes(text))

  assert.ok(node, `${selector} of value ${text} not found in array ${nodes}.`)
}

export async function getTextContent(page: Page, selector: string) {
  const element = await page.waitForSelector(selector)
  if (!element) {
    throw new Error('`element` is undefined.')
  }

  return element.evaluate(el => el.textContent)
}

export async function getInputContent(page: Page, selector: string) {
  const element = await page.waitForSelector(selector)
  if (!element) {
    throw new Error('`element` is undefined.')
  }

  return element.evaluate(el => (el as HTMLInputElement).value)
}

export async function getFirstTab(browser: Browser) {
  const [firstTab] = await browser.pages()

  return firstTab
}

export function setPuppeteerEnvironment(page: Page) {
  page.evaluate(() => {
    localStorage.setItem('IS_PUPPETEER', 'true')
  })
}

export function wait(ms) {
  /* eslint-disable no-promise-executor-return */
  return new Promise(resolve => setTimeout(resolve, ms))
}
