import { Pane, Heading, Paragraph, Spinner, Alert } from "evergreen-ui";
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

type Portfolio = {
    username: string,
    balance: string
}

type Logout = {
    logout: () => void
}

function Profile({ logout }: Logout) {
    const user = useContext(UserContext);
    const [portfolio, setPortfolio] = useState<Portfolio | undefined>(undefined);

    // make requests to get username and balance, transactions
    // add a try catch in case accessing db has issues
    useEffect(() => {
        async function loadPortfolio() {
            try {
                const userProfile = await PaperTraderApi.getUserProfile();
                setPortfolio(userProfile);
            } catch (error) {
                logout(); // need to change - considering react error boundary
            }
        }
        if (user) loadPortfolio();
    }, [user, logout])

    if (!user) return <Navigate to="/login" replace />

    return (
        <Pane display="flex" flexDirection="column" alignItems="center">
            <Heading is="h1" size={900}>
                Profile Page
            </Heading>
            {portfolio && <Paragraph> Hi <>{portfolio.username}!</> </Paragraph>}
            {portfolio && <Paragraph> You have <>${portfolio.balance} available funds to trade with!</> </Paragraph>}
            {!portfolio &&
                <Pane display="flex" flexDirection="column" alignItems="center">
                    <Paragraph>Loading...</Paragraph>
                    <Spinner marginX="auto" marginY={30} />
                </Pane>
            }

        </Pane >
    );
}

export default Profile;