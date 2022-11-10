import { useState, useEffect } from 'react'
import { Box, Text, Image } from './theme-ui'

export const Link = props => <Text as='a' variant='link' {...props} />

Link.External = ({ logo, children, ...props }) => {
  const [logoUrl, setLogoUrl] = useState('')

  useEffect(() => {
    if (!logo) return
    if (typeof logo === 'string') return setLogoUrl(logo)
    throw new Error('`logo` must be a string')
  }, [props.href, logo])

  const logoComponent = logo && (
    <Image
      alt={`logo for ${props.href}`}
      sx={{
        width: 20,
        height: 20,
        borderRadius: 3,
        position: 'relative',
        top: '4px',
        margin: '0 8px 0 0'
      }}
      src={
        logoUrl ||
        'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='
      }
    />
  )

  return (
    <Box
      suppressHydrationWarning
      as='span'
      css={
        logo &&
        `
        display: inline-flex;
        &:hover {
          opacity: 0.8;
        }
      `
      }
    >
      <Link variant='link' rel='noopener noreferrer' target='_blank' {...props}>
        {logoComponent}
        {children}
      </Link>
    </Box>
  )
}

Link.External.displayName = 'Link.External'

export const Microlink = ({ logo, ...props }) => (
  <Link.External logo={logo && '/favicon.png'} {...props} />
)

export const CloudFlare = ({ logo, ...props }) => (
  <Link.External logo={logo && '/cloudflare.png'} {...props} />
)

export const Spreadsheet = ({ logo, ...props }) => (
  <Link.External logo={logo && '/spreadsheet.icon'} {...props} />
)

export const Metascraper = ({ logo, ...props }) => (
  <Link.External data-debug logo={logo && '/metascraper.png'} {...props} />
)
