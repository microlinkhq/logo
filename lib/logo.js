/* eslint-disable no-eval, no-template-curly-in-string */

export const javascript = ({ withCache = false, withApiKey } = {}) => {
  const retrieveCache =
    'let logoUrl = localStorage.getItem(`${logo}-url`)\n  if (logoUrl) return logoUrl\n'.trim()

  const setCache = `.then(({ data }) => {
      logoUrl = data.logo.url
      localStorage.setItem(\`\${logo}-url\`, logoUrl)
      return logoUrl
    })`

  const withFetch = (() => {
    const code = 'fetch(`https://api.microlink.io?url=${url}&filter=logo.url`'
    if (!withApiKey) return code + ')'
    return (
      code +
      `, { 
      headers: { 'x-api-key': 'YOUR_TOKEN' } 
  })`
    )
  })()

  return `url => {
  const { origin } = new URL(url)
  ${withCache && retrieveCache}
  return ${withFetch}
    .then(res => res.json())
    ${withCache && setCache} 
    ${!withCache && '.then(({ data }) => data.logo.url)'}
}`
    .split('\n')
    .filter(line => line.trim().replace(/\s{2,}/gu, ' ') !== 'false')
    .join('\n')
}

export const react = props => `
const getLogo = ${javascript(props).toString()}
  
const Link = ({ logo, children, ...props }) => {
  const [logoUrl, setLogoUrl] = useState('')

  useEffect(() => {
    if (logo === false) return
    if (typeof logo === 'string') return setLogoUrl(logo)
    getLogo(props.href).then(setLogoUrl)
  }, [props.href, logo])

  return (
    <span style={{ display: 'inline-flex' }}>
      <a variant='link' rel='noopener noreferrer' target='_blank' {...props}>
        {logo && (
          <img
            style={{
              width: 20,
              height: 20,
              borderRadius: '6px',
              position: 'relative',
              top: '4px',
              margin: '0 8px 0 0'
            }}
            src={logoUrl || 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='}
          />
        )}
        {children}
      </a>
    </span>
  )
}`

export const getLogo = eval(javascript())
