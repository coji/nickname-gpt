import { twMerge } from 'tailwind-merge'
export const AppShell = ({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={twMerge(
      'container grid h-screen grid-rows-[auto,auto,1fr,auto]',
      className,
    )}
    {...rest}
  >
    {children}
  </div>
)
