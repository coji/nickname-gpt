import type { BoxProps } from '@chakra-ui/react'
import { Box, Heading } from '@chakra-ui/react'

interface AppHeaderProps extends BoxProps {
  layout?: 'normal' | 'shrink'
}
export const AppHeader = ({ layout = 'normal', ...rest }: AppHeaderProps) => {
  return (
    <Box {...rest}>
      <Heading
        transition="all"
        transitionDuration="1000ms"
        py={layout === 'normal' ? '16' : '2'}
        textAlign="center"
      >
        Nickname GPT
      </Heading>
    </Box>
  )
}
