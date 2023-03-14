import { useSession, signIn, signOut } from 'next-auth/react'
import { Box, Button, StackProps, Stack } from '@chakra-ui/react'

export const LoginPane = (props: StackProps) => {
  const { data: session, status } = useSession()

  if (status === 'loading')
    return (
      <Stack
        direction="row"
        justify="end"
        align="center"
        fontSize="sm"
        color="gray.500"
        {...props}
      >
        <Button isLoading={true} size="sm" variant="outline"></Button>
      </Stack>
    )

  return (
    <Stack
      direction="row"
      justify="end"
      align="center"
      fontSize="sm"
      color="gray.500"
      {...props}
    >
      {session && session.user ? (
        <>
          <Box>Signed in as {session.user.email} </Box>
          <Button size="sm" variant="outline" onClick={() => signOut()}>
            Sign out
          </Button>
        </>
      ) : (
        <>
          <Button size="sm" variant="outline" onClick={() => signIn('google')}>
            Sign in
          </Button>
        </>
      )}
    </Stack>
  )
}
