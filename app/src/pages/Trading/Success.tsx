import { Pane, Heading, Paragraph } from 'evergreen-ui';
import { Navigate, useLocation } from 'react-router-dom';

interface LocationState {
  state: {
    ticker: string;
    qty: number;
    price: number;
    total: number;
    fromTrading: boolean;
  };
}

function SuccessPage() {
  const { state } = useLocation() as LocationState;

  if (!state) return <Navigate to='/trading' replace />;

  const { ticker, qty, price, total } = state;

  return (
    <Pane display='flex' flexDirection='column' alignItems='center'>
      <Heading is='h1' size={900}>
        Successful Trade
      </Heading>
      <Paragraph>
        Successfully bought {qty} share{qty > 1 ? 's' : ''} of {ticker} for{' '}
        {price.toLocaleString('en', {
          style: 'currency',
          currency: 'USD',
        })}{' '}
        each, for a total of{' '}
        {total.toLocaleString('en', { style: 'currency', currency: 'USD' })}.
      </Paragraph>
    </Pane>
  );
}

export default SuccessPage;
