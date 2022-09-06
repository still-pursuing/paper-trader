
import { Pane, Heading, Spinner, Paragraph } from "evergreen-ui";
import { useContext } from "react";
import UserContext from "../../UserContext";

/**
 * Props:
 * - None
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
    const user = useContext(UserContext);
    console.log('Profile user:', user, typeof user);

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