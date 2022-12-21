import { AxiosError } from 'axios';
import {
  Pane,
  Heading,
  TextInputField,
  Button,
  RadioGroup,
  Alert,
  Paragraph,
} from 'evergreen-ui';
import { ChangeEvent, FormEvent, useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import PaperTraderApi from '../../helpers/PaperTraderApi';
import UserContext from '../../UserContext';

interface StockQuote {
  ticker: string;
  price: number;
  quantity: number;
  total: number;
}

const options = [
  { label: 'Buy', value: 'buy' },
  { label: 'Sell', value: 'sell' },
  { label: 'Get Quote', value: 'quote' },
];

function TradingPage() {
  const user = useContext(UserContext);
  const [errors, setErrors] = useState<string | undefined>(undefined);
  const [formData, setFormData] = useState({ ticker: '', quantity: 0 });
  const [transactionType, setTransactionType] = useState<string>('quote');
  const [quoteData, setQuoteData] = useState<StockQuote | undefined>(undefined);
  const navigate = useNavigate();

  if (!user) return <Navigate to='/login' replace />;

  /** Update form data field */
  function handleChange(evt: ChangeEvent<HTMLInputElement>) {
    const { name, value } = evt.target;
    setFormData((data) => ({ ...data, [name]: value }));
  }

  async function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();

    const { ticker, quantity } = formData;
    const cleanTicker = ticker.trim().toUpperCase();

    if (cleanTicker.length === 0) {
      console.log('Throw an error: Ticker needs to be length > 0');
    } else {
      if (transactionType === 'quote') {
        quoteRequest(ticker, quantity);
      } else if (quantity <= 0) {
        console.log('Throw an error: Quantity needs to be > 0');
      } else if (transactionType === 'buy') {
        buyRequest(cleanTicker, quantity);
      } else {
        sellRequest(cleanTicker);
      }
    }

    setFormData((data) => ({ ...data, ticker: cleanTicker }));
  }

  async function buyRequest(ticker: string, quantity: number) {
    try {
      const { price, qty, total, remainingBalance } =
        await PaperTraderApi.buyStock(ticker, quantity);

      return navigate('/success', {
        state: { ticker, qty, price, total, remainingBalance },
        replace: true,
      });
    } catch (error) {
      if (error instanceof AxiosError && error.code === 'ERR_BAD_REQUEST') {
        setErrors(error.response?.data.error.message);
      } else {
        setErrors('There was an issue with your request. Please try again.');
      }
    }
  }

  async function sellRequest(ticker: string) {
    console.log('To implement sell');
  }

  async function quoteRequest(ticker: string, quantity: number) {
    try {
      const { c: price } = await PaperTraderApi.getStock(ticker);
      const total = price * quantity;
      setQuoteData({ ticker, price, quantity, total });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Pane display='flex' flexDirection='column' alignItems='center'>
      <Heading is='h1' size={900}>
        Trade Stocks
      </Heading>
      {errors && (
        <Alert intent='danger' title='Something went wrong.'>
          {errors}
        </Alert>
      )}
      <Pane>
        <form onSubmit={handleSubmit}>
          <TextInputField
            label='Please enter a stock symbol:'
            name='ticker'
            value={formData.ticker}
            onChange={handleChange}
            maxLength={5}
          />
          <TextInputField
            label='Please enter a quantity:'
            name='quantity'
            value={formData.quantity}
            type='number'
            onChange={handleChange}
            min={0}
          />
          <Pane display='flex' justifyContent='center'>
            <RadioGroup
              label='Transction Type:'
              size={16}
              value={transactionType}
              options={options}
              onChange={(event) => setTransactionType(event.target.value)}
            />
          </Pane>
          <Pane display='flex' justifyContent='center'>
            <Button>Submit</Button>
          </Pane>
        </form>
      </Pane>
      {quoteData && (
        <Pane paddingTop={12}>
          <Paragraph>
            {' '}
            <strong>{quoteData.quantity}</strong> share
            {quoteData.quantity > 1 ? 's' : ''} of{' '}
            <strong>{quoteData.ticker}</strong> at a price of{' '}
            <strong>
              {quoteData.price.toLocaleString('en', {
                style: 'currency',
                currency: 'USD',
              })}
            </strong>{' '}
            will cost a total of{' '}
            <strong>
              {quoteData.total.toLocaleString('en', {
                style: 'currency',
                currency: 'USD',
              })}
            </strong>
            .
          </Paragraph>
        </Pane>
      )}
    </Pane>
  );
}

export default TradingPage;
