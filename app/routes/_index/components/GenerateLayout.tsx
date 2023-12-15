import { twMerge } from 'tailwind-merge'

export const GenerateLayout = ({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={twMerge('grid grid-cols-2 gap-4 w-full', className)}
    {...rest}
  >
    {children}
  </div>
)
