import { Paragraph, Table, Pane } from 'evergreen-ui';

import { Activity } from '../interfaces/activity';
import { Holdings } from '../interfaces/holdings';

interface DataTableParams {
  tableContent: Activity[] | Holdings[];
  tableHeaders: string[];
}

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
function DataTable({ tableContent, tableHeaders }: DataTableParams) {
  return (
    <Pane>
      {tableContent.length === 0 ? (
        <Paragraph>No activity! Login and start trading!</Paragraph>
      ) : (
        <Table>
          <Table.Head textAlign='center'>
            {tableHeaders.map((header) => (
              <Table.TextHeaderCell key={header}>{header}</Table.TextHeaderCell>
            ))}
          </Table.Head>
          {tableContent.length && (
            <Table.VirtualBody height={240} textAlign='center'>
              {tableContent.map((transaction, idx) => (
                <Table.Row key={idx}>
                  {Object.values(transaction).map((val, idx) => (
                    <Table.TextCell key={idx}>{val}</Table.TextCell>
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
