import { makeTheme } from '@theme-ui/css/utils'

export const speed = {
  quickly: 150,
  normal: 300,
  slowly: 450
}

export const transitions = {
  short: `${speed.quickly}ms cubic-bezier(.25,.8,.25,1)`,
  medium: `${speed.normal}ms cubic-bezier(.25,.8,.25,1)`,
  long: `${speed.slowly}ms cubic-bezier(.4, 0, .2, 1)`
}

export const letterSpacings = {
  body: 'normal',
  caps: '0.2em'
}

export const fontWeights = {
  body: 400,
  heading: 700,
  bold: 700
}

export const fontSizes = [12, 14, 16, 20, 24, 32, 48, 64, 96]

export const fonts = {
  heading: '"Playfair Display", serif',
  subhead: '"Lato", sans-serif',
  body: "'Lora', serif",
  monospace: 'Menlo, monospace'
}

export const colors = {
  text: '#000',
  background: '#fff',
  primary: '#067DF7',
  secondary: '#b0b',
  black: '#000',
  black95: 'rgba(0,0,0,0.95)',
  black90: 'rgba(0,0,0,0.9)',
  black80: 'rgba(0,0,0,0.8)',
  black70: 'rgba(0,0,0,0.7)',
  black60: 'rgba(0,0,0,0.6)',
  black50: 'rgba(0,0,0,0.5)',
  black40: 'rgba(0,0,0,0.4)',
  black30: 'rgba(0,0,0,0.3)',
  black20: 'rgba(0,0,0,0.2)',
  black10: 'rgba(0,0,0,0.1)',
  black05: 'rgba(0,0,0,0.05)',
  black025: 'rgba(0,0,0,0.025)',
  black0125: 'rgba(0,0,0,0.0125)',
  white: '#fff',
  white95: 'rgba(255,255,255,0.95)',
  white90: 'rgba(255,255,255,0.9)',
  white80: 'rgba(255,255,255,0.8)',
  white70: 'rgba(255,255,255,0.7)',
  white60: 'rgba(255,255,255,0.6)',
  white50: 'rgba(255,255,255,0.5)',
  white40: 'rgba(255,255,255,0.4)',
  white30: 'rgba(255,255,255,0.3)',
  white20: 'rgba(255,255,255,0.2)',
  white10: 'rgba(255,255,255,0.1)',
  white05: 'rgba(255,255,255,0.05)',
  white025: 'rgba(255,255,255,0.025)',
  white0125: 'rgba(255,255,255,0.0125)'
}

export const theme = makeTheme({
  config: {
    initialColorModeName: 'light',
    useColorSchemeMediaQuery: 'initial'
  },
  speed,
  transitions,
  colors,
  fonts,
  fontSizes,
  borders: [0, '1px solid', '2px solid'],
  fontWeights,
  lineHeights: {
    body: 1.8,
    heading: 1.125
  },
  letterSpacings,
  radii: [0, 2, 4, 6, 8],
  forms: {
    switch: {
      backgroundColor: 'black30'
    }
  },
  text: {
    link: {
      color: 'black80',
      cursor: 'pointer',
      textDecoration: 'underline',
      transition: 'short',
      '&:hover': {
        color: 'primary'
      }
    },
    heading: {
      color: 'black80',
      lineHeight: 'heading',
      fontSize: [5, 6, 7],
      fontFamily: 'heading',
      fontWeight: 'bold',
      pt: 4
    },
    subhead: {
      variant: 'text.heading',
      fontSize: 4,
      fontFamily: 'subhead',
      fontWeight: 'normal'
    },
    paragraph: {
      lineHeight: 'body',
      fontFamily: 'body',
      fontSize: 3
    }
  }
})
