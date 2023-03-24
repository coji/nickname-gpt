import type { StackProps } from '@chakra-ui/react'
import { Button, Stack } from '@chakra-ui/react'
import { Link, useNavigation } from '@remix-run/react'

export const AppLoginPane = (props: StackProps) => {
  const navigation = useNavigation()

  // if (status === 'loading')
  //   return (
  //     <Stack
  //       direction="row"
  //       justify="end"
  //       align="center"
  //       fontSize="sm"
  //       color="gray.500"
  //       {...props}
  //     >
  //       <Button isLoading={true} size="sm" variant="outline"></Button>
  //     </Stack>
  //   )

  return (
    <Stack
      direction="row"
      justify="end"
      align="center"
      fontSize="sm"
      color="gray.500"
      {...props}
    >
      {/* <>
        <Box>Signed in as {session.user.email} </Box>
        <Button size="sm" variant="outline" onClick={() => signOut()}>
          Sign out
        </Button>
      </> */}
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
