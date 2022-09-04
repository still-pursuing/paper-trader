
import { Pane, Heading, Spinner, Paragraph } from "evergreen-ui";
import { useEffect, useContext } from "react";
import UserContext from "../../UserContext";



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
    const user = useContext(UserContext)

    /**
     * Validates if there is no CSRF attack and authenticates Discord user with
     * a valid OAuth code by communicating with PaperTraderApi
     */
    useEffect(function validateUserOnSearchParams() {
        handleLogin();
    }, []);

    console.log('DiscordRedirect user:', user, typeof user)

    return (
        <Pane display="flex" flexDirection="column" alignItems="center">
            <Heading is="h1" size={900}>
                Discord Redirect Page
            </Heading>
            {user === null
                ? <Spinner />
                : <Paragraph> Hi <>{user}</> </Paragraph>
            }
        </Pane >
    );
}

export default DiscordRedirect;