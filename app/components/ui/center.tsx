import { cn } from '~/utils/cn'

export interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}
export const Center = ({ className, children, ...rest }: CenterProps) => {
  return (
    <div
      className={cn('flex h-full items-center justify-center', className)}
      {...rest}
    >
      {children}
    </div>
  )
}
