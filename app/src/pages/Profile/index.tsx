import { Pane, Heading, Paragraph } from "evergreen-ui";
import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import PaperTraderApi from "../../helpers/PaperTraderApi";

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

interface Portfolio {
    username: string,
    balance: string
}

function Profile() {
    const user = useContext(UserContext);
    const [portfolio, setPortfolio] = useState<Portfolio | undefined>(undefined);

    // make requests to get username and balance, transactions
    // add a try catch in case accessing db has issues
    useEffect(() => {
        async function loadPortfolio() {
            const userProfile = await PaperTraderApi.getUserProfile();
            setPortfolio(userProfile);
        }
        if (user) loadPortfolio();
    }, [user])

    if (!user) return <Navigate to="/login" replace />

    return (
        <Pane display="flex" flexDirection="column" alignItems="center">
            <Heading is="h1" size={900}>
                Profile Page
            </Heading>
            {portfolio && <Paragraph> Hi <>{portfolio.username}!</> </Paragraph>}
            {portfolio && <Paragraph> You have <>${portfolio.balance} available funds to trade with!</> </Paragraph>}

        </Pane >
    );
}

export default Profile;