import { Heading } from '~/components/ui'

interface GenerateHeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
  provider: string
  model: string
}

export const GenerateHeader = ({
  provider,
  model,
  ...rest
}: GenerateHeaderProps) => (
  <Heading size="md" {...rest}>
    <span>{provider}</span>
    <span className="ml-2 text-xs text-slate-500">{model}</span>
  </Heading>
)
