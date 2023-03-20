import type { StackProps } from '@chakra-ui/react'
import { Button, Stack } from '@chakra-ui/react'
import { useFetcher } from '@remix-run/react'

export const AppLoginPane = (props: StackProps) => {
  const fetcher = useFetcher()
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
      <fetcher.Form method="get" action="/api/auth/login/google">
        <Button size="sm" type="submit" variant="outline">
          Sign in
        </Button>
      </fetcher.Form>
    </Stack>
  )
}
