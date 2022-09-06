
import { Pane, Heading, Spinner, Paragraph } from "evergreen-ui";
import { useEffect, useContext } from "react";
import UserContext from "../../UserContext";



/**
 * Props:
 * - handleLogin: a function to be called in parent
 * 
 * State:
 * - None
 * 
 * Events:
 * - None
 * 
 * Routes --> Profile
 */

function Profile() {
    const user = useContext(UserContext)


    /**
     * When component mounts and handleLogin's dependencies changes, load the
     * user's information
     */

    console.log('Profile user:', user, typeof user)

    return (
        <Pane display="flex" flexDirection="column" alignItems="center">
            <Heading is="h1" size={900}>
                Profile Page
            </Heading>
            {user === null
                ? <Spinner />
                : <Paragraph> Hi <>{user}</> </Paragraph>
            }
        </Pane >
    );
}

export default Profile;