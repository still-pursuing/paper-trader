
import { Pane, Heading, Spinner, Paragraph } from "evergreen-ui";
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import { decodeToken } from "react-jwt";

import PaperTraderApi from "../../Api";

interface token {
    username: string;
    iat: number;
}

/**
 * Props:
 * - None
 * 
 * State:
 * - user: Discord user information
 * 
 * Events:
 * - None
 * 
 * Login --> DiscordRedirect
 */

function DiscordRedirect() {
    const [searchParams] = useSearchParams();
    const [user, setUser] = useState('');

    /**
     * Validates if there is no CSRF attack and authenticates Discord user with
     * a valid OAuth code by communicating with PaperTraderApi
     */
    useEffect(function validateUserOnSearchParams() {
        async function validateUser() {
            try {
                if (localStorage['stateString'] !== searchParams.get('state')) {
                    throw new Error("Clickjacked!!");
                }

                const discordOAuthCode = searchParams.get('code');

                // todo: move this into a handleLogin function that gets passed down
                if (discordOAuthCode) {
                    const token = await PaperTraderApi.getDiscordUser(discordOAuthCode);
                    localStorage.setItem('userToken', token);

                    const decodedToken = decodeToken<token>(token);
                    if (decodedToken !== null) {
                        const username = decodedToken.username;
                        setUser(username);
                    }
                    // const username = decodedToken !== null ? decodedToken.username : "";
                    // const username = decodedToken?.username; //optional chaining
                    // console.log(decodedToken);
                    // setUser(username);

                } else {
                    throw new Error('Missing Discord OAuth code');
                }
            } catch (err) {
                console.error(err);
            }
        }
        validateUser();
    }, [searchParams]);

    return (
        <Pane display="flex" flexDirection="column" alignItems="center">
            <Heading is="h1" size={900}>
                Discord Redirect Page
            </Heading>
            {user.length === 0
                ? <Spinner />
                : <Paragraph> Hi {user}</Paragraph>
            }
        </Pane >
    );
}

export default DiscordRedirect;