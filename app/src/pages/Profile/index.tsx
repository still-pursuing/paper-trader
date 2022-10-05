
import { Pane, Heading, Paragraph } from "evergreen-ui";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

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

    if (!user) return <Navigate to="/login" replace />

    return (
        <Pane display="flex" flexDirection="column" alignItems="center">
            <Heading is="h1" size={900}>
                Profile Page
            </Heading>
            <Paragraph> Hi <>{user}!</> </Paragraph>
        </Pane >
    );
}

export default Profile;