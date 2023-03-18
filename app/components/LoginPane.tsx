import type { StackProps } from '@chakra-ui/react'
import { Box, Button, Stack } from '@chakra-ui/react'

export const LoginPane = (props: StackProps) => {
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
      <>
        <Button size="sm" variant="outline">
          Sign in
        </Button>
      </>
    </Stack>
  )
}
