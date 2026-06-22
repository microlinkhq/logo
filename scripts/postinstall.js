import { writeFile, mkdir } from 'fs/promises'

const API_KEY = process.env.MICROLINK_API_KEY

const getLogo = href => {
  const endpoint = `https://api.microlink.io?url=${encodeURIComponent(
    href
  )}&filter=logo.url`
  const options = API_KEY ? { headers: { 'x-api-key': API_KEY } } : undefined
  return fetch(endpoint, options)
    .then(res => res.json())
    .then(({ data }) => data.logo.url)
}

const safeGetLogo = href =>
  getLogo(href).catch(error => {
    console.warn(`[postinstall] skip logo for ${href}: ${error.message}`)
    return null
  })

const downloadLogo = (url, dist) => {
  if (!url) return Promise.resolve()
  return fetch(url)
    .then(async res => [
      Buffer.from(await res.arrayBuffer()),
      res.headers.get('content-type').split('image/')[1].replace('x-', '')
    ])
    .then(([buffer, extension]) => writeFile(`${dist}.${extension}`, buffer))
    .catch(error =>
      console.warn(`[postinstall] skip download ${dist}: ${error.message}`)
    )
}

const URLS = [
  {
    title: 'Observable universe',
    href: 'https://en.wikipedia.org/wiki/Observable_universe'
  },
  { title: 'Turbopack by Vercel', href: 'https://vercel.com/blog/turbopack' },
  {
    title: 'Why is Rosetta 2 fast',
    href: 'https://news.ycombinator.com/item?id=33533132'
  },
  {
    title: 'Tesla motors explained',
    href: 'https://kikobeats.com/tesla-motors-explained/'
  },
  {
    title: 'RolandMC-500.css',
    href: 'https://codepen.io/fossheim/pen/BaKQGZJ'
  },
  {
    title: 'WritableStream',
    href: 'https://developer.mozilla.org/en-US/docs/Web/API/WritableStream'
  },
  {
    title: 'Google is shutting down Stadia',
    href: 'https://www.theverge.com/2022/9/29/23378713/google-stadia-shutting-down-game-streaming-january-2023'
  },
  {
    title: 'Ex-Reddit CEO on Twitter moderation',
    href: 'https://twitter.com/yishan/status/1586955288061452289'
  },
  {
    title: 'Medium’s CSS is so good',
    href: 'https://medium.com/@fat/mediums-css-is-actually-pretty-fucking-good-b8e2a6c78b06'
  },
  {
    title: 'Compute shader 101',
    href: 'https://www.youtube.com/watch?v=DZRn_jNZjbw'
  },
  {
    title: 'Metascraper, unified metadata from websites',
    href: 'https://github.com/microlinkhq/metascraper'
  }
]

Promise.all([
  Promise.all(
    URLS.map(async props => {
      props.logo = await safeGetLogo(props.href)
      return props
    })
  )
    .then(async data => {
      await mkdir('data').catch(() => {})
      await writeFile('data/urls.json', JSON.stringify(data, null, 2))
    })
    .catch(error =>
      console.warn(`[postinstall] skip data/urls.json: ${error.message}`)
    ),
  downloadLogo('https://cdn.microlink.io/logo/logo.png', 'public/favicon'),
  safeGetLogo(
    'https://docs.google.com/spreadsheets/d/1YSD1qeP_fWxCQK1OY40Z2SKGtTg4XID8xDaY-w3C6oE/edit?usp=sharing'
  ).then(url => downloadLogo(url, 'public/spreadsheet')),
  // safeGetLogo('https://radar.cloudflare.com/domains').then(url =>
  //   downloadLogo(url, 'public/cloudflare')
  // ),
  safeGetLogo('https://metascraper.js.org/').then(url =>
    downloadLogo(url, 'public/metascraper')
  )
]).then(() => {
  process.exit(0)
})
