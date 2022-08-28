
import { Pane, Heading, Spinner, Paragraph } from "evergreen-ui";
import { useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from "react";

import PaperTraderApi from "../../Api";

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
     * a valid OAuth code 
     */

    const memoizedUser = useCallback(
        async function validateUser() {
            try {
                if (localStorage['token'] !== searchParams.get('state')) {
                    throw new Error("Clickjacked!!");
                }

                const discordOAuthCode = searchParams.get('code');

                if (discordOAuthCode) {
                    const userInfo = await PaperTraderApi.getDiscordUser(discordOAuthCode);
                    setUser(userInfo);
                } else {
                    throw new Error('Missing Discord OAuth code');
                }
            } catch (err) {
                console.error(err);
            }
        }, [searchParams]
    )

    /** 
     * Call memoizedUser which is memoized validateUser 
     * to prevent infinite rendering from having a function in dependency array
     */
    useEffect(() => {
        memoizedUser()
    }, [memoizedUser]);

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