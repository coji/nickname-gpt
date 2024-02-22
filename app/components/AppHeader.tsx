import type { HTMLAttributes } from 'react'
import { Heading } from '~/components/ui'

interface AppHeaderProps extends HTMLAttributes<HTMLElement> {
  layout?: 'normal' | 'shrink'
}
export const AppHeader = ({ layout = 'normal', ...rest }: AppHeaderProps) => {
  return (
    <header {...rest}>
      <Heading
        className={`text-center transition-transform duration-1000 ${
          layout === 'normal' ? 'py-16' : 'py-2'
        }`}
      >
        Nickname GPT
      </Heading>
    </header>
  )
}
