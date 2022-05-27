import { Table } from "evergreen-ui"

function DataTable() {
    const tableHeaders = ["User", "Total Value", "Last Activity"]; // note will need better key prop

    const userData = [
        {
            id: "1",
            name: "User 1",
            totalValue: "500",
            lastActivity: "a few seconds ago"
        },
        {
            id: "2",
            name: "User 2",
            totalValue: "400",
            lastActivity: "2 minutes ago"
        },
    ];

    return (
        <Table>
            <Table.Head>
                {tableHeaders.map((header) => (
                    <Table.TextHeaderCell key={header}>{header}</Table.TextHeaderCell>
                ))}
            </Table.Head>
            <Table.VirtualBody height={240} display="flex">
                {userData.map((user) => (
                    <Table.Row key={user.id} isSelectable onSelect={() => alert(user.name)}>
                        <Table.TextCell>{user.name}</Table.TextCell>
                        <Table.TextCell isNumber>${user.totalValue}</Table.TextCell>
                        <Table.TextCell>{user.lastActivity}</Table.TextCell>
                    </Table.Row>
                ))}
            </Table.VirtualBody>
        </Table>
    )
}

export default DataTable;
