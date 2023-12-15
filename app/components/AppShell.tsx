import { twMerge } from 'tailwind-merge'
export const AppShell = ({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={twMerge(
      'container grid grid-rows-[auto,auto,1fr,auto] h-screen',
      className,
    )}
    {...rest}
  >
    {children}
  </div>
)
