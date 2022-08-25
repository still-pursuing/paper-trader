
import { useEffect, useState } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom'
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
  const [discordRedirected, setDiscordRedirected] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // console.log('login page receiving csrftoken', csrfToken);
  // console.log('url code param?', searchParams.get('code'))

  useEffect(function loadDiscord() {
    if (searchParams.get('code') !== null) {
      setDiscordRedirected(true);
    }
  }, [searchParams.get('code')]);


  // note: change button to use an onClick function which makes request to URL (via axios or window.location)
  // then need to update browser to show the URL (axios call may not update browser)

  return (
    <Pane display="flex" flexDirection="column" alignItems="center">
      {!discordRedirected && <Pane display="flex" flexDirection="column" alignItems="center">
        <Heading is="h1" size={900}>
          Login
        </Heading>
        <Pane>
          <Button
            is="a"
            href={`https://discord.com/api/oauth2/authorize?client_id=981788058833797171&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin%2Fdiscord-redirect&response_type=code&scope=identify&state=${csrfToken}`}
            marginY={8}
            marginRight={12}
            iconBefore={EditIcon}
            size="large"
          >
            Login With Discord
          </Button>
        </Pane>
      </Pane>
      }
      {discordRedirected && <Outlet />}
    </Pane>
  )
}

export default Login;