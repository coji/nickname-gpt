import {
  Avatar,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
} from '~/components/ui'
import { Link, useNavigation } from '@remix-run/react'
import { useSessionUser } from '~/hooks/use-session-user'

export const AppLoginPane = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const navigation = useNavigation()
  const user = useSessionUser()

  if (!user) {
    return (
      <div {...props}>
        <Button
          asChild
          variant="outline"
          size="xs"
          disabled={
            navigation.state !== 'idle' &&
            navigation.location.pathname === '/auth/google'
          }
        >
          <Link to="/auth/google">Sign in</Link>
        </Button>
      </div>
    )
  }

  return (
    <div {...props}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoUrl} alt={user.displayName} />
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem>
            <div>
              <p>{user.displayName}</p>
              <p className="text-xs">{user.email}</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/admin/system-prompt">システムプロンプトの編集</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/auth/logout">Sign Out</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
