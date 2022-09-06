
import { Pane, Heading, Spinner, Paragraph } from "evergreen-ui";
import { useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../../UserContext";



/**
 * Props:
 * - handleLogin
 * 
 * State:
 * - None
 * 
 * Events:
 * - None
 * 
 * Login --> DiscordRedirect
 */

function DiscordRedirect({ handleLogin }: any) {
    const user = useContext(UserContext)


    /**
     * When component mounts and handleLogin's dependencies changes, load the
     * user's information
     */
    useEffect(function loadUser() {
        if (!user) {
            handleLogin();
        }
    }, [handleLogin, user]);

    if (user) return <Navigate to="/profile" replace />


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