/**
 * Results at https://docs.google.com/spreadsheets/d/e/2PACX-1vRcOpu8P8oenyBno_RCYnkzU1Gl5peNAekPZuqCQbbws-qRd3ofD8Zlzpnt2E3IkQatFXCmdy-LhQb0/pubhtml?gid=1006523580&single=true
 */

import { GoogleSpreadsheet } from 'google-spreadsheet'
import { extension } from '@metascraper/helpers'
import { JWT } from 'google-auth-library'
import reachableUrl from 'reachable-url'
import { readFile } from 'fs/promises'
import mql from '@microlink/mql'

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: Buffer.from(process.env.GOOGLE_PRIVATE_KEY, 'base64').toString('utf8'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
})

const gotOpts = {
  timeout: 8000,
  throwHttpErrors: false,
  followRedirect: true
}

const PROVIDER = {
  google: (domain, query = '') =>
    `https://www.google.com/s2/favicons?domain_url=${domain}${query}`,
  duckduckgo: domain => `https://icons.duckduckgo.com/ip3/${domain}.ico`,
  favicon: (domain, { ext }) => `https://${domain}/favicon.${ext}`
}

const fetchFavicon = provider => async (input, opts) => {
  const domain = input.startsWith('http') ? new URL(input).hostname : input
  const url = PROVIDER[provider](domain, opts)
  try {
    const response = await reachableUrl(url, gotOpts)
    const isContentType = opts?.contentTypes
      ? opts.contentTypes.some(contentType =>
        response.headers['content-type']?.includes(contentType)
      )
      : true
    return isContentType && reachableUrl.isReachable(response)
      ? response.url
      : undefined
  } catch (error) {
    console.error(input, error)
    return undefined
  }
}

const fromDuckDuckGo = fetchFavicon('duckduckgo')
const fromFavicon = fetchFavicon('favicon')
const fromGoogle = fetchFavicon('google')

const spreadsheet = async type => {
  const doc = new GoogleSpreadsheet(
    process.env.GOOGLE_SPREASHEET_ID,
    serviceAccountAuth
  )
  await doc.loadInfo()
  const title = type === 'url' ? 'by URL' : 'by domain'
  return doc.sheetsByTitle[title]
}

const toHttps = input => (input.startsWith('http') ? input : `https://${input}`)

const fromMicrolink = input =>
  mql(toHttps(input), {
    meta: true,
    endpoint: 'http://localhost:3000'
    // apiKey: process.env.MICROLINK_API_KEY
  }).then(({ data }) => {
    if (data.logo?.size === 0) return undefined
    return data.logo?.url
  })

const toImage = url => {
  if (!url) return undefined
  // Google spreadhseet doesn't support svg
  if (extension(url) === 'svg') {
    url = `https://images.weserv.nl/?${new URLSearchParams({
      url,
      output: 'png'
    }).toString()}`
  }
  return `=IMAGE("${url}")`
}

const main = async ({ type }) => {
  const sheet = await spreadsheet(type)
  await sheet.clear('A6:J1004')
  await sheet.loadHeaderRow(5)

  // https://radar.cloudflare.com/domains
  const filename = type === 'url' ? './urls.csv' : './domains.csv'
  const dataset = (await readFile(filename, 'utf8')).split('\n')

  for (const [index, input] of dataset.entries()) {
    if (
      !reachableUrl.isReachable(
        await reachableUrl(toHttps(input), {
          ...gotOpts,
          timeout: gotOpts.timeout / 2
        })
      )
    ) {
      console.log(`#${index}/${dataset.length} – ${input} (skipped)`)
      continue
    }

    const [
      google,
      google128,
      google256,
      google512,
      duckduckgo,
      faviconICO,
      faviconPNG,
      faviconSVG,
      microlink
    ] = await Promise.all([
      toImage(await fromGoogle(input)),
      toImage(await fromGoogle(input, '&sz=128')),
      toImage(await fromGoogle(input, '&sz=256')),
      toImage(await fromGoogle(input, '&sz=512')),
      toImage(await fromDuckDuckGo(input)),
      toImage(
        await fromFavicon(input, {
          ext: 'ico',
          contentTypes: ['image/x-icon', 'image/vnd.microsoft.icon']
        })
      ),
      toImage(
        await fromFavicon(input, { ext: 'png', contentType: ['image/png'] })
      ),
      toImage(
        await fromFavicon(input, { ext: 'svg', contentType: ['image/svg+xml'] })
      ),
      toImage(await fromMicrolink(input))
    ])

    if (
      [
        google,
        google,
        google128,
        google256,
        google512,
        duckduckgo,
        microlink
      ].every(url => url === undefined)
    ) {
      console.log(`#${index}/${dataset.length} – ${input} (skipped)`)
      continue
    }

    console.log(`#${index}/${dataset.length} – ${input}`)

    const row = {
      [type]: input,
      google,
      google128,
      google256,
      google512,
      duckduckgo,
      'favicon.ico': faviconICO,
      'favicon.png': faviconPNG,
      'favicon.svg': faviconSVG,
      microlink
    }

    await sheet.addRow(row)
  }
}

const type = process.argv[2]

if (!['url', 'domain'].includes(type)) {
  throw new TypeError('Expected type to be "url" or "domain".')
}

main({ type }).then(() => process.exit())
