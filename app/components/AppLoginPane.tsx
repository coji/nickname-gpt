import type { StackProps } from '@chakra-ui/react'
import { Button, Stack } from '@chakra-ui/react'
import { Link, useNavigation } from '@remix-run/react'
import { useUser } from '~/hooks/use-user'

export const AppLoginPane = (props: StackProps) => {
  const navigation = useNavigation()
  const user = useUser()

  if (!user) {
    return (
      <Stack
        direction="row"
        justify="end"
        align="center"
        fontSize="sm"
        color="gray.500"
        {...props}
      >
        <Button
          as={Link}
          to="/auth/google"
          size="sm"
          type="submit"
          variant="outline"
          isLoading={
            navigation.state !== 'idle' &&
            navigation.location.pathname === '/auth/google'
          }
        >
          Sign in
        </Button>
      </Stack>
    )
  }

  return (
    <Stack
      direction="row"
      justify="end"
      align="center"
      fontSize="sm"
      color="gray.500"
      {...props}
    >
      <Button
        as={Link}
        to="/auth/logout"
        size="sm"
        type="submit"
        variant="outline"
        isLoading={
          navigation.state !== 'idle' &&
          navigation.location.pathname === '/auth/logout'
        }
      >
        Sign Out
      </Button>

      {/* <>
        <Box>Signed in as {session.user.email} </Box>
        <Button size="sm" variant="outline" onClick={() => signOut()}>
          Sign out
        </Button>
      </> */}
    </Stack>
  )
}
