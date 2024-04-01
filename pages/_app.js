import { css, Global } from '@emotion/react'
import { ThemeUIProvider } from 'theme-ui'

import { theme } from '../theme'

const globalStyles = (
  <Global
    styles={css`
      :root {
        --sh-class: #0550ae;
        --sh-identifier: ${theme.colors.black80};
        --sh-sign: ${theme.colors.black40};
        --sh-property: #0550ae;
        --sh-entity: #249a97;
        --sh-jsxliterals: #6266d1;
        --sh-string: #1d856f;
        --sh-keyword: #cf222e;
        --sh-comment: #a19595;
      }
    `}
  />
)

export default function App ({ Component, pageProps }) {
  return (
    <ThemeUIProvider theme={theme}>
      {globalStyles}
      <main
        css={`
          max-width: 68ch;
          padding: 1rem;
          margin: auto;
          line-height: 1.75;
          font-size: 1.25em;
        `}
      >
        <Component {...pageProps} />
      </main>
    </ThemeUIProvider>
  )
}
