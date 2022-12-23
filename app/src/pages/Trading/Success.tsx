import { Pane, Heading, Paragraph } from 'evergreen-ui';
import { Navigate, useLocation } from 'react-router-dom';

interface LocationState {
  state: {
    ticker: string;
    qty: number;
    price: number;
    total: number;
    remainingBalance: number;
    fromTrading: boolean;
  };
}

function SuccessPage() {
  const { state } = useLocation() as LocationState;

  if (!state) return <Navigate to='/trading' replace />;

  const { ticker, qty, price, total, remainingBalance } = state;

  return (
    <Pane display='flex' flexDirection='column' alignItems='center'>
      <Heading is='h1' size={900}>
        Successful Trade
      </Heading>
      <Paragraph>
        Successfully bought {qty} share{qty !== 1 && 's'} of {ticker} for{' '}
        {price.toLocaleString('en', {
          style: 'currency',
          currency: 'USD',
        })}{' '}
        each, for a total of{' '}
        {total.toLocaleString('en', { style: 'currency', currency: 'USD' })}.
      </Paragraph>
      <Paragraph>
        {' '}
        You now have{' '}
        {remainingBalance.toLocaleString('en', {
          style: 'currency',
          currency: 'USD',
        })}{' '}
        left to trade with.
      </Paragraph>
    </Pane>
  );
}

export default SuccessPage;
