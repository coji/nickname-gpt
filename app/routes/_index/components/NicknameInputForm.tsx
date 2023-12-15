import { HStack, Input, Button } from '~/components/ui'

interface NicknameInputFormProps extends React.HTMLAttributes<HTMLFormElement> {
  isLoading: boolean
}
export const NicknameInputForm = ({
  isLoading,
  ...rest
}: NicknameInputFormProps) => {
  return (
    <form noValidate autoComplete="off" {...rest}>
      <fieldset>
        <HStack>
          <Input
            name="input"
            autoFocus
            data-1p-ignore
            placeholder="あなたの名前、メールアドレス、ID などを入力してください"
          />
          <Button type="submit" disabled={isLoading}>
            Submit
          </Button>
        </HStack>
      </fieldset>
    </form>
  )
}
