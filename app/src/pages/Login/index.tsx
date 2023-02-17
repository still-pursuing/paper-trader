import { useEffect, useContext, useState } from 'react';
import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { Button, Pane, EditIcon, Heading, Spinner, Alert } from 'evergreen-ui';
import UserContext from '../../UserContext';

import UserSession from '../../helpers/UserSession';
import { DISCORD_REDIRECT_URI } from '../../config';
import { CsrfStateError } from '../../errors/errors';

interface LoginParams {
  handleLogin: () => Promise<void>;
}

interface LocationStateMessage {
  state: {
    message: string;
  };
}

/**
 * Props:
 * - handleLogin: function to be called in App
 *
 * State:
 * - errors: undefined or string
 * - searchParams: undefined or string
 *
 * Events:
 * - None
 *
 * App --> Login
 */

function Login({ handleLogin }: LoginParams) {
  const user = useContext(UserContext);
  const [errors, setErrors] = useState<string | undefined>(undefined);
  const [searchParams, setSearchParams] = useSearchParams();

  const authCode = searchParams.get('code') ?? undefined;
  const { state } = useLocation() as LocationStateMessage;

  /**
   * If this component is mounted after a Discord OAuth redirect,
   * make a request to get user's information
   */
  useEffect(() => {
    async function loadUser() {
      try {
        await handleLogin();
      } catch (error) {
        if (error instanceof CsrfStateError) {
          localStorage.removeItem('csrfStateString');
          UserSession.storeCsrfStateString();
          setErrors('There was an issue with your request. Please try again.');
        } else {
          setErrors(
            "There's an issue with getting your profile information. Please try again later."
          );
        }
        setSearchParams('');
      }
    }
    if (authCode !== undefined) loadUser();

    if (state !== null) {
      const { message } = state;
      setErrors(message);
    }
  }, [authCode, handleLogin, setSearchParams, state]);

  if (user) return <Navigate to='/investments' replace />;

  /** Makes a request to Discord's OAuth authorization page */
  async function getDiscordOAuthCode() {
    const storedCsrfStateString = localStorage.getItem('csrfStateString');
    if (storedCsrfStateString !== null) {
      const encodedCsrfStateString = encodeURIComponent(storedCsrfStateString);
      const encodedRedirectURI = encodeURIComponent(DISCORD_REDIRECT_URI);
      window.location.href = `https://discord.com/api/oauth2/authorize?client_id=981788058833797171&redirect_uri=${encodedRedirectURI}&response_type=code&scope=identify&state=${encodedCsrfStateString}`;
    } else {
      UserSession.storeCsrfStateString();
      getDiscordOAuthCode();
    }
  }

  return (
    <Pane display='flex' flexDirection='column' alignItems='center'>
      {errors && (
        <Alert intent='danger' title='Something went wrong.'>
          {errors}
        </Alert>
      )}
      {authCode && (
        <Pane display='flex' flexDirection='column' alignItems='center'>
          <Heading is='h1' size={900}>
            Logging In...
          </Heading>
          <Spinner marginX='auto' marginY={50} />
        </Pane>
      )}
      {!authCode && (
        <Pane display='flex' flexDirection='column' alignItems='center'>
          <Heading is='h1' size={900}>
            Login
          </Heading>
          <Pane>
            <Button
              marginY={8}
              marginX='auto'
              iconBefore={EditIcon}
              size='large'
              onClick={getDiscordOAuthCode}
            >
              Login With Discord
            </Button>
          </Pane>
        </Pane>
      )}
    </Pane>
  );
}

export default Login;
