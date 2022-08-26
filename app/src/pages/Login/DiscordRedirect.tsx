
import { Pane, Heading, Spinner, Paragraph } from "evergreen-ui";
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from "react";

import PaperTraderApi from "../../Api";
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

function DiscordRedirect() {
    // note:
    // pull url params, then make an axios call to backend
    // needed when redirecting back from Discord
    const [searchParams] = useSearchParams();
    const [user, setUser] = useState('');

    useEffect(function callBackend() {
        async function accessBackend() {
            try {
                if (localStorage['token'] !== searchParams.get('state')) {
                    throw new Error("Clickjacked!!");
                }

                // could potentially have this be passed down from Login component instead?
                const discordOAuthCode = searchParams.get('code');

                if (discordOAuthCode) {
                    const userInfo = await PaperTraderApi.getDiscordUser(discordOAuthCode);
                    // console.log('effect', userInfo);
                    setUser(userInfo);
                } else {
                    throw new Error('Missing Discord OAuth code');
                }
            } catch (err) {
                console.error(err);
            }
        }
        accessBackend();
    }, [searchParams]);

    // console.log(`The current user is: ${user}`)

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