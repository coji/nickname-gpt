import { twMerge } from 'tailwind-merge'

export const GenerateLayout = ({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={twMerge('grid grid-cols-1 gap-4', className)} {...rest}>
    {children}
  </div>
)
