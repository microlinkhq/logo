import { Html, Head, Main, NextScript } from 'next/document'

const meta = {
  image: 'https://logo.microlink.io/share.jpg',
  description: 'Adding logos to any website powered by Microlink API.',
  title: 'Microlink for Logo',
  logo: 'https://cdn.microlink.io/logo/logo.png',
  url: 'https://logo.microlink.io'
}

export default function Document () {
  return (
    <Html lang='en'>
      <Head>
        <link rel='icon' type='image/png' href='/favicon.png' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='true'
        />
        <link
          href='https://fonts.googleapis.com/css?family=Lato:400,700|Lora|Playfair+Display:700i,900&display=swap'
          rel='stylesheet'
        />

        {/* <!-- Basic --> */}
        <meta charSet='utf-8' />
        <meta httpEquiv='x-ua-compatible' content='ie=edge' />
        <meta property='apple-mobile-web-app-capable' content='yes' />
        <meta property='mobile-web-app-capable' content='yes' />

        {/* <!-- Search Engine --> */}
        <meta name='description' content={meta.description} />
        <link rel='canonical' href={meta.url} />

        {/* <!-- Schema.org for Google --> */}
        <meta itemProp='name' content={meta.title} />
        <meta itemProp='description' content={meta.description} />
        <meta itemProp='image' content={meta.image} />

        {/* <!-- Twitter --> */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={meta.title} />
        <meta name='twitter:description' content={meta.description} />
        <meta name='twitter:image' content={meta.image} />

        {/* <!-- Open Graph general (Facebook, Pinterest & Google+) --> */}
        <meta property='og:title' content={meta.title} />
        <meta property='og:description' content={meta.description} />
        <meta property='og:image' content={meta.image} />
        <meta property='og:logo' content={meta.logo} />
        <meta property='og:url' content={meta.url} />
        <meta property='og:type' content='website' />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
