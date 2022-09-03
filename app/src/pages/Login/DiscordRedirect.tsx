
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

function DiscordRedirect({ handleLogin }: any) {
    // const [searchParams] = useSearchParams();
    // const [user, setUser] = useState('');

    /**
     * Validates if there is no CSRF attack and authenticates Discord user with
     * a valid OAuth code by communicating with PaperTraderApi
     */
    useEffect(function validateUserOnSearchParams() {
        handleLogin();
    }, []);

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