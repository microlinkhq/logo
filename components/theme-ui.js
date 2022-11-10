import { Box, Text } from 'theme-ui'

export const Subhead = props => <Text as='h2' variant='subhead' {...props} />

export const Paragraph = ({ sx, ...props }) => (
  <Text as='p' variant='paragraph' sx={{ pt: 4, ...sx }} {...props} />
)

export const Heading = props => <Text as='h1' variant='heading' {...props} />

export const Svg = props => <Box as='svg' {...props} />

export {
  Button,
  Checkbox,
  Flex,
  Image,
  Input,
  NavLink,
  Select,
  Switch,
  ThemeUIProvider,
  useThemeUI
} from 'theme-ui'

export { Box, Text }
