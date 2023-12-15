import { twMerge } from 'tailwind-merge'

export const BodyCopy = ({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={twMerge('text-center text-slate-700', className)} {...rest}>
      <p>
        AI がかっこいいニックネームを考えます。Email や ID を入力して
        Submitしてください。
      </p>
      <p>入力されたデータはどこにも一切保存されません。</p>
    </div>
  )
}
