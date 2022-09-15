
import { useEffect, useContext } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom'
import { Button, Pane, EditIcon, Heading, Spinner } from "evergreen-ui";
import UserContext from "../../UserContext";

import UserSession from '../../helpers/UserSession';
import { DISCORD_REDIRECT_URI } from "../../config";

/**
 * Props:
 * - None
 * 
 * State:
 * - searchParams: null or string
 * 
 * Events:
 * - None
 * 
 * App --> Login
 */

function Login({ handleLogin }: any) {
  const user = useContext(UserContext)

  const [searchParams] = useSearchParams()

  console.debug("Login", { user });

  const authCode = searchParams.get('code') ?? undefined;

  /** Checks if this component is mounted after a Discord OAuth redirect */
  useEffect(function loadUser() {
    if (authCode !== undefined) {
      handleLogin();
    }
  }, [handleLogin, authCode]);

  if (user) return <Navigate to="/profile" replace />

  /** Makes a request to Discord's OAuth authorization page */
  async function getDiscordOAuthCode() {
    const storedCsrfStateString = localStorage.getItem('csrfStateString');
    if (storedCsrfStateString !== null) {
      const encodedCsrfStateString = encodeURIComponent(storedCsrfStateString)
      const encodedRedirectURI = encodeURIComponent(DISCORD_REDIRECT_URI);
      window.location.href = `https://discord.com/api/oauth2/authorize?client_id=981788058833797171&redirect_uri=${encodedRedirectURI}&response_type=code&scope=identify&state=${encodedCsrfStateString}`;
    } else {
      UserSession.storeCsrfStateString();
      getDiscordOAuthCode();
    }
  }

  return (
    <Pane display="flex" flexDirection="column" alignItems="center">
      {authCode &&
        <Pane display="flex" flexDirection="column" alignItems="center">
          <Heading is="h1" size={900}>
            Logging In...
          </Heading>
          <Spinner marginX="auto" marginY={50} />
        </Pane>}
      {!authCode &&
        <Pane display="flex" flexDirection="column" alignItems="center">
          <Heading is="h1" size={900}>
            Login
          </Heading>
          <Pane>
            <Button
              marginY={8}
              marginX="auto"
              iconBefore={EditIcon}
              size="large"
              onClick={getDiscordOAuthCode}
            >
              Login With Discord
            </Button>
          </Pane>
        </Pane>}
    </Pane>
  )
}

export default Login;