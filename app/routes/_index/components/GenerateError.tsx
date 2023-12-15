import { twMerge } from 'tailwind-merge'

interface GenerateErrorProps extends React.HTMLAttributes<HTMLDivElement> {}
export const GenerateError = ({
  className,
  children,
  ...rest
}: GenerateErrorProps) => {
  return (
    <div
      className={twMerge('text-center text-destructive', className)}
      {...rest}
    >
      {children}
    </div>
  )
}
