import { Paragraph, Table, Pane, Alert } from 'evergreen-ui';
import { useEffect, useState } from 'react';

import PaperTraderApi from '../helpers/PaperTraderApi';

const tableHeaders = [
  'Ticker',
  'Quantity',
  'Price',
  'Transaction Type',
  'Time',
]; // note will need better key prop

const INITIAL_ACT = [
  {
    ticker: 'AAPL',
    quantity: '1',
    price: '500',
    transactionType: 'buy',
    from: 'a few seconds ago',
  },
  {
    ticker: 'AAPL',
    quantity: '2',
    price: '500',
    transactionType: 'sell',
    from: '2 minutes ago',
  },
];

interface ActivityList extends Array<Activity> {}

interface Activity {
  ticker?: string;
  quantity?: number;
  price?: number;
  transactionType?: string;
  from?: string;
}

function DataTable() {
  const [tradeActivity, setTradeActivity] = useState<ActivityList>([]);
  const [errors, setErrors] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function loadActivity() {
      try {
        const activity = await PaperTraderApi.getHomeFeed();
        setTradeActivity(activity);
      } catch (error) {
        setErrors(
          'There was an issue with accessing the activity database. Please try again later.'
        );
      }
    }
    loadActivity();
  }, []);

  return (
    <Pane>
      {errors ? (
        <Pane>
          {' '}
          <Alert intent='danger' title='Something went wrong'>
            {errors}
          </Alert>
        </Pane>
      ) : (
        <Pane>
          {tradeActivity.length === 0 ? (
            <Paragraph>No activity! Login and start trading!</Paragraph>
          ) : (
            <Table>
              <Table.Head>
                {tableHeaders.map((header) => (
                  <Table.TextHeaderCell key={header}>
                    {header}
                  </Table.TextHeaderCell>
                ))}
              </Table.Head>
              {tradeActivity.length && (
                <Table.VirtualBody height={240}>
                  {tradeActivity.map((transaction, idx) => (
                    <Table.Row
                      key={idx}
                      isSelectable
                      onSelect={() => alert(transaction.ticker)}
                    >
                      <Table.TextCell>{transaction.ticker}</Table.TextCell>
                      <Table.TextCell isNumber>
                        {transaction.quantity}
                      </Table.TextCell>
                      <Table.TextCell isNumber>
                        ${transaction.price}
                      </Table.TextCell>
                      <Table.TextCell>
                        {transaction.transactionType}
                      </Table.TextCell>
                      <Table.TextCell>{transaction.from}</Table.TextCell>
                    </Table.Row>
                  ))}
                </Table.VirtualBody>
              )}
            </Table>
          )}
        </Pane>
      )}
    </Pane>
  );
}

export default DataTable;
