import { useState } from "react";
import { Link as ReactRouterLink } from 'react-router-dom'
import { Pane, Tab, TabNavigation, WaterfallChartIcon } from 'evergreen-ui';


function Navbar() {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [tabs] = useState(['Home', 'Profile', 'Login'])
    return (
        <Pane flex={10} display="flex" justifyContent="space-between" marginBottom={10} >
            <TabNavigation display="flex" alignItems="center" marginRight={10} paddingLeft={0}>
                <Tab is={ReactRouterLink} to="/" >
                    Paper Trader
                    <WaterfallChartIcon size={20} marginLeft={5} />
                </Tab>

            </TabNavigation>
            <TabNavigation alignItems="center" flexBasis={216} display="flex">
                {tabs.map((tab, index) => (
                    <Tab
                        key={tab}
                        is={ReactRouterLink}
                        to={tab}
                        id={tab}
                        onSelect={() => setSelectedIndex(index)}
                        isSelected={index === selectedIndex}>
                        {tab}
                    </Tab>
                ))}
            </TabNavigation>
        </Pane>
    )
}

export default Navbar;