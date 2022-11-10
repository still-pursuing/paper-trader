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

function Success() {
  const { state } = useLocation() as LocationState;

  if (!state) return <Navigate to='/trading' replace />;

  const { ticker, qty, price, total } = state;

  return (
    <Pane display='flex' flexDirection='column' alignItems='center'>
      <Heading is='h1' size={900}>
        Successful Trade
      </Heading>
      <Paragraph>
        Successfully bought {qty} share(s) of {ticker} for ${price.toFixed(2)}{' '}
        each, for a total of ${total.toFixed(2)}!
      </Paragraph>
    </Pane>
  );
}

export default Success;
