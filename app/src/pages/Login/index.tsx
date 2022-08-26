
import { useEffect, useState } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom'
import { Button, Pane, EditIcon, Heading } from "evergreen-ui";

import { DISCORD_REDIRECT_URI } from "../../config";

/**
 * Props:
 * - None
 * 
 * State:
 * - discordRedirected: true/false
 * - searchParams: null or string
 * 
 * Events:
 * - None
 * 
 * App --> Login --> DsicordRedirect
 */

function Login() {
  // do stuff with Discord
  // if a user is already logged in, redirect back to root
  const [fromDiscordRedirect, setFromDiscordRedirect] = useState(false);
  const [searchParams] = useSearchParams();

  const authCode = searchParams.get('code')

  /** Checks if this component is mounted after a Discord OAuth redirect */
  useEffect(function checkIfDiscordRedirected() {
    if (authCode !== null) {
      setFromDiscordRedirect(true);
    }
  }, [authCode]);

  /** Makes a request to Discord's OAuth authorization page */
  async function getDiscordOAuthCode() {
    const encodedToken = encodeURIComponent(localStorage['token'])
    const encodedRedirectURI = encodeURIComponent(DISCORD_REDIRECT_URI);
    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=981788058833797171&redirect_uri=${encodedRedirectURI}&response_type=code&scope=identify&state=${encodedToken}`;
  }

  return (
    <Pane display="flex" flexDirection="column" alignItems="center">
      {!fromDiscordRedirect && <Pane display="flex" flexDirection="column" alignItems="center">
        <Heading is="h1" size={900}>
          Login
        </Heading>
        <Pane>
          <Button
            marginY={8}
            marginRight={12}
            iconBefore={EditIcon}
            size="large"
            onClick={getDiscordOAuthCode}
          >
            Login With Discord
          </Button>
        </Pane>
      </Pane>
      }
      {fromDiscordRedirect && <Outlet />}
    </Pane>
  )
}

export default Login;