
import { Button, Pane, EditIcon, Heading } from "evergreen-ui";


/**
 * Props:
 * - None
 * 
 * State:
 * - csrfToken: string to append to Discord OAuth URL
 * 
 * Events:
 * - None
 * 
 * App --> Login
 */

function Login({ csrfToken }: { csrfToken: String }) {
  // do stuff with Discord
  // if a user is already logged in, redirect back to root

  console.log('login page receiving csrftoken', csrfToken);

  return (
    <Pane display="flex" flexDirection="column" alignItems="center">
      <Heading is="h1" size={900}>
        Login
      </Heading>
      <Pane>
        <Button
          is="a"
          href={`https://discord.com/api/oauth2/authorize?client_id=981788058833797171&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code&scope=identify&state=${csrfToken}`}
          marginY={8}
          marginRight={12}
          iconBefore={EditIcon}
          size="large"
        >
          Login With Discord
        </Button>
      </Pane>
    </Pane >
  )
}

export default Login;