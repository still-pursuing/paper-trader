import React from "react";
import { Button, Pane, EditIcon, Heading } from "evergreen-ui";


/**
 * Props:
 * handleLogin: comes from src index.tsx
 * 
 * index.tsx --> Login
 */

function Login({ handleLogin }: any) {
  // do stuff with Discord
  // if a user is already logged in, redirect back to root


  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    handleLogin("Redirect to Discord")
  }

  return (
    <Pane display="flex" flexDirection="column" alignItems="center">
      <Heading is="h1" size={900}>
        Login
      </Heading>
      <Pane >
        <Button
          marginY={8}
          marginRight={12}
          iconBefore={EditIcon}
          size="large"
          onClick={handleClick}>
          Login With Discord
        </Button>
      </Pane>
    </Pane>
  )
}

export default Login;