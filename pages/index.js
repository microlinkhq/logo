import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { useEffect, useState } from 'react'
import { highlight } from 'sugar-high'
import Head from 'next/head'

import { speed } from '@/theme'

import {
  Box,
  CloudFlare,
  Flex,
  GitHubCorner,
  Heading,
  Link,
  Metascraper,
  Microlink,
  Paragraph,
  ProductHunt,
  Select,
  Spreadsheet,
  Subhead,
  Switch,
  Text
} from '@/components'

import * as implementations from '../lib/logo'
import URLS from '../data/urls'

const variants = {
  visible: { opacity: 1, scale: 1 },
  hidden: { opacity: 0, scale: 0.5 }
}

const nextFavicon = (() => {
  const FAVICONS = ['/favicon.png'].concat(URLS.map(({ logo }) => logo))
  let index = 0
  return () => FAVICONS[index++ % FAVICONS.length]
})()

const take = (arr, qty = 1) => [...arr].splice(0, qty)

const drop = (arr, n = 1) => arr.slice(n)

export default function Index () {
  const [useLogo, setUseLogo] = useState(false)
  const [withCache, setWithCache] = useState(false)
  const [withApiKey, setWithApiKey] = useState(false)
  const [favicon, setFavicon] = useState('/favicon.png')
  const [selectedValue, setSelectedValue] = useState('JavaScript')
  const [copying, setCopying] = useState(0)

  useEffect(() => {
    const changeFavicon = () => setFavicon(nextFavicon())
    const interval = setInterval(changeFavicon, speed.slowly)
    return () => clearInterval(interval)
  }, [])

  const code = (() => {
    if (selectedValue === 'JavaScript') {
      return `
const getLogo = ${implementations
        .javascript({ withCache, withApiKey })
        .toString()}

const getLogos = urls => Promise.all(urls.map(getLogo))`.trim()
    }

    return `
const getLogo = ${implementations
      .javascript({ withCache, withApiKey })
      .toString()}
  
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
              margin: '0 8px'
            }}
            src={logoUrl || 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='}
          />
        )}
        {children}
      </a>
    </span>
  )
}`.trim()
  })()

  return (
    <>
      <Head>
        <title>Microlink for Logo</title>
        <meta
          name='viewport'
          content='width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0'
        />
        <link rel='icon' type='image/png' href={favicon} />
      </Head>
      <GitHubCorner href='https://github.com/microlinkhq/logo' />
      <Box as='header'>
        <ProductHunt sx={{ pt: 4 }} />
        <Heading sx={{ pb: 3 }}>Microlink for Logo</Heading>
        <Subhead
          as='h2'
          sx={{
            p: 0,
            color: 'black60'
          }}
        >
          <Flex>
            <Switch
              sx={{ top: '3px' }}
              label='Adding logos to any website.'
              checked={useLogo}
              onChange={() => setUseLogo(!useLogo)}
            />
          </Flex>
        </Subhead>
      </Box>
      <Box as='section'>
        <Paragraph>
          When browsing the internet, you might come across websites such as{' '}
          {(() => {
            const collection = take(URLS, 4)
            return collection.map((props, index) => {
              const isLast = index === collection.length - 1
              const isSecondToLast = index === collection.length - 2
              const suffix = isSecondToLast ? ', or ' : isLast ? '.' : ', '
              const logo = useLogo && props.logo
              return (
                <Text as='span' key={props.href}>
                  <Text as='span'>
                    <Link.External href={props.href} logo={logo}>
                      {props.title}
                    </Link.External>
                    {suffix}
                  </Text>
                </Text>
              )
            })
          })()}
        </Paragraph>
        <Paragraph as='div'>
          Have you noticed those external URLs have a favicon next to them?
          Microlink for Logo uses {selectedValue} to interact with the{' '}
          <Microlink href='https://api.microlink.io' logo={useLogo}>
            Microlink API
          </Microlink>{' '}
          to fetch logos.
        </Paragraph>
        <Paragraph as='div'>
          <Flex
            sx={{
              fontSize: 1,
              fontFamily: 'subhead',
              alignItems: 'center',
              flexDirection: ['column-reverse', 'row']
            }}
          >
            <Box sx={{ pt: [3, 0], width: ['100%', '160px'] }}>
              <Select
                value={selectedValue}
                onChange={event => setSelectedValue(event.target.value)}
              >
                <option value='JavaScript'>JavaScript</option>
                <option value='React'>React</option>
              </Select>
            </Box>
            <Flex
              sx={{
                px: [0, 3],
                width: '100%',
                justifyContent: ['inherit', 'space-around']
              }}
            >
              <Box sx={{ pr: 3, display: ['none', 'inherit'] }}>
                <Switch
                  label='enable for the site'
                  checked={useLogo}
                  onChange={() => setUseLogo(!useLogo)}
                />
              </Box>
              <Box sx={{ pr: 3 }}>
                <Switch
                  label='use localStorage'
                  checked={withCache}
                  onChange={() => setWithCache(!withCache)}
                />
              </Box>
              <Box>
                <Switch
                  label='pass apiKey'
                  checked={withApiKey}
                  onChange={() => setWithApiKey(!withApiKey)}
                />
              </Box>
            </Flex>
          </Flex>

          <Box sx={{ pt: 3, position: 'relative' }}>
            <Box
              as='button'
              onClick={() => {
                navigator.clipboard.writeText(code)
                setCopying(c => c + 1)
                setTimeout(() => setCopying(c => c - 1), 500)
              }}
              aria-label='Copy code'
              css={`
                position: absolute;
                top: 32px;
                background: none;
                border: none;
              `}
              sx={{ right: ['8px', '-24px'] }}
            >
              <MotionConfig transition={{ duration: 0.15 }}>
                <AnimatePresence initial={false} mode='wait'>
                  {copying
                    ? (
                      <motion.div
                        animate='visible'
                        exit='hidden'
                        initial='hidden'
                        key='check'
                        variants={variants}
                      >
                        <svg
                          viewBox='0 0 24 24'
                          width='14'
                          height='14'
                          stroke='currentColor'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          fill='none'
                          shapeRendering='geometricPrecision'
                        >
                          <path d='M20 6L9 17l-5-5' />
                        </svg>
                      </motion.div>
                      )
                    : (
                      <motion.div
                        animate='visible'
                        exit='hidden'
                        initial='hidden'
                        key='copy'
                        variants={variants}
                      >
                        <svg
                          viewBox='0 0 24 24'
                          width='14'
                          height='14'
                          stroke='currentColor'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          fill='none'
                          shapeRendering='geometricPrecision'
                        >
                          <path d='M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z' />
                        </svg>
                      </motion.div>
                      )}
                </AnimatePresence>
              </MotionConfig>
            </Box>

            <Box
              as='pre'
              css={`
                overflow: auto;
                zoom: 0.8;
                user-select: all;
                cursor: pointer;
                background-color: rgb(255, 255, 255);
                color: rgb(0, 0, 0);
                border: 1px solid #999;
                border-radius: 8px;
                font-size: 18px;
              `}
              sx={{
                my: 0,
                p: 3,
                border: 1,
                ml: [0, '-5%'],
                mr: [0, '-5%']
              }}
            >
              <code
                suppressHydrationWarning
                dangerouslySetInnerHTML={{ __html: highlight(code) }}
              />
            </Box>
          </Box>
        </Paragraph>
        <Paragraph>Some extra links for showcasing how it performs:</Paragraph>
        <Paragraph as='ul' sx={{ pt: 3, pb: 3 }}>
          {drop(URLS, 4).map(props => (
            <Paragraph as='li' sx={{ pt: 2 }} key={props.href}>
              <Link.External href={props.href} logo={useLogo && props.logo}>
                {props.title}
              </Link.External>
            </Paragraph>
          ))}
        </Paragraph>
      </Box>
      <Box as='section'>
        <Heading>Benchmark</Heading>
        <Paragraph>
          We've created{' '}
          <Spreadsheet
            href='https://docs.google.com/spreadsheets/d/e/2PACX-1vRcOpu8P8oenyBno_RCYnkzU1Gl5peNAekPZuqCQbbws-qRd3ofD8Zlzpnt2E3IkQatFXCmdy-LhQb0/pubhtml?gid=1006523580&single=true'
            logo={useLogo}
          >
            Microlink logo benchmark
          </Spreadsheet>{' '}
          to measure and compare the accuracy of{' '}
          <Microlink href='https://api.microlink.io' logo={useLogo}>
            Microlink API
          </Microlink>{' '}
          and similar solutions against{' '}
          <CloudFlare
            href='https://radar.cloudflare.com/domains'
            logo={useLogo}
          >
            Top 500 domains
          </CloudFlare>
          :
        </Paragraph>
        <Box sx={{ pt: 4, pb: 3 }}>
          <Box
            sx={{
              ml: [0, '-5%'],
              mr: [0, '-5%']
            }}
            css={`
              position: relative;
              overflow: auto;
              aspect-ratio: 16 / 9;
            `}
          >
            <iframe
              css={`
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                width: 100%;
                height: 100%;
              `}
              frameBorder='0'
              target='_parent'
              src='https://docs.google.com/spreadsheets/d/e/2PACX-1vRcOpu8P8oenyBno_RCYnkzU1Gl5peNAekPZuqCQbbws-qRd3ofD8Zlzpnt2E3IkQatFXCmdy-LhQb0/pubhtml?gid=1006523580&amp;single=true&amp;widget=true&amp;headers=false'
            />
          </Box>
        </Box>
      </Box>
      <Box as='section' sx={{ pb: 5 }}>
        <Heading>FAQ</Heading>
        <Subhead sx={{ fontWeight: 'bold' }}>
          What is the Microlink API?
        </Subhead>
        <Paragraph>
          The{' '}
          <Microlink href='https://api.microlink.io' logo={useLogo}>
            Microlink API
          </Microlink>{' '}
          is a service that provides a simple way to fetch metadata from any
          website.
        </Paragraph>
        <Subhead sx={{ fontWeight: 'bold' }}>How does it work?</Subhead>
        <Paragraph>
          We developed{' '}
          <Metascraper href='https://metascraper.js.org/#/' logo={useLogo}>
            Metascraper
          </Metascraper>{' '}
          for getting unified & normalized HTML markup. We use it for getting
          the logo in the best quality possible in each situation.
        </Paragraph>
        <Subhead sx={{ fontWeight: 'bold' }}>How much it cost?</Subhead>
        <Paragraph>
          There is a forever free plan that is reset daily based on IP address.
          If you need more, check{' '}
          <Microlink href='https://microlink.io/pricing/' logo={useLogo}>
            Microlink Pricing
          </Microlink>
          .
        </Paragraph>
      </Box>
    </>
  )
}
