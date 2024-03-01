import { Flex, Image } from './theme-ui'
import { Link } from './link'

const WIDTH = 250
const HEIGHT = 54
const SCALE = 0.8

export const ProductHunt = props => (
  <Flex sx={{ justifyContent: 'center' }} {...props}>
    <Link
      href='https://www.producthunt.com/posts/microlink-for-logo?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-microlink&#0045;for&#0045;logo'
      target='_blank'
      rel='noopener noreferrer'
    >
      <Image
        src='https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=442055&theme=light'
        alt='Microlink&#0032;for&#0032;Logo - Adding&#0032;logos&#0032;to&#0032;any&#0032;website&#0046; | Product Hunt'
        style={{ width: WIDTH * SCALE, height: HEIGHT * SCALE }}
      />
    </Link>
  </Flex>
)
