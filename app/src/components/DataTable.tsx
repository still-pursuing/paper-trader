import { Paragraph, Table, Pane } from 'evergreen-ui';

import { Activity } from '../interfaces/activity';

interface DataTableParams {
  tradeActivity: Activity[];
}

const tableHeaders = [
  'Ticker',
  'Quantity',
  'Price',
  'Transaction Type',
  'From',
];

/**
 * Props:
 * - tradeActivity
 *
 * State:
 * - None
 *
 * Effects:
 * - None
 *
 * Splash -> DataTable
 */
function DataTable({ tradeActivity }: DataTableParams) {
  return (
    <Pane>
      {tradeActivity.length === 0 ? (
        <Paragraph>No activity! Login and start trading!</Paragraph>
      ) : (
        <Table>
          <Table.Head>
            {tableHeaders.map((header) => (
              <Table.TextHeaderCell key={header}>{header}</Table.TextHeaderCell>
            ))}
          </Table.Head>
          {tradeActivity.length && (
            <Table.VirtualBody height={240}>
              {tradeActivity.map((transaction, idx) => (
                <Table.Row key={idx}>
                  {Object.values(transaction).map((val) => (
                    <Table.TextCell>{val}</Table.TextCell>
                  ))}
                </Table.Row>
              ))}
            </Table.VirtualBody>
          )}
        </Table>
      )}
    </Pane>
  );
}

export default DataTable;
