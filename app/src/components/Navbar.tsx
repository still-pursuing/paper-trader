import { useContext } from "react";
import { Link as ReactRouterLink, useLocation } from 'react-router-dom'
import { Pane, Tab, TabNavigation, WaterfallChartIcon } from 'evergreen-ui';

import UserContext from "../UserContext";

interface LogoutParams {
    handleLogout: () => void;
}

function Navbar({ handleLogout }: LogoutParams) {
    const user = useContext(UserContext)
    const { pathname } = useLocation();

    return (
        <Pane flex={10} display="flex" justifyContent="space-between" marginBottom={10} >
            <TabNavigation display="flex" alignItems="center" marginRight={10} paddingLeft={0}>
                <Tab is={ReactRouterLink} to="/" >
                    Paper Trader
                    <WaterfallChartIcon size={20} marginLeft={5} />
                </Tab>
            </TabNavigation>
            <TabNavigation alignItems="center" display="flex">
                {user && <>
                    <Tab is={ReactRouterLink} to="home" isSelected={pathname === "/home" || pathname === "/"}>
                        Home
                    </Tab>
                    <Tab is={ReactRouterLink} to="profile" isSelected={pathname === "/profile"}>
                        Profile
                    </Tab>
                    <Tab is={ReactRouterLink} to="login" onSelect={handleLogout}>
                        Logout
                    </Tab>
                </>}
                {!user &&
                    <Tab is={ReactRouterLink} to="login" isSelected={pathname === "/login"}>
                        Login
                    </Tab>}
            </TabNavigation>
        </Pane >
    )
}

export default Navbar;