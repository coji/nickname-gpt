import { twMerge } from 'tailwind-merge'

export const GenerateLayout = ({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={twMerge('grid w-full grid-cols-2 gap-4', className)}
    {...rest}
  >
    {children}
  </div>
)
