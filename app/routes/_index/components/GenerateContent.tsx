import nl2br from 'react-nl2br'

interface GenerateContentProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string
}
export const GenerateContent = ({
  className,
  children,
  content,
  ...rest
}: GenerateContentProps) => {
  return (
    <div className={className} {...rest}>
      {nl2br(content)}
    </div>
  )
}
