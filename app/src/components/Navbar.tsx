import { useState } from "react";
import { Pane, Tab, TabNavigation } from 'evergreen-ui';

function Navbar() {
    const [selectedIndex, setSelectedIndex] = useState(0) // currently component reloads again resetting selectedIndex
    const [tabs] = useState(['Home', 'Profile', 'Login'])
    return (
        <Pane height={40}>
            <TabNavigation marginBottom={10} flexBasis={240} marginRight={24}>
                {tabs.map((tab, index) => (
                    <Tab
                        key={tab}
                        is="a"
                        href={tab}
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