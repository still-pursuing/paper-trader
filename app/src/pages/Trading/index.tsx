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
  const [isInputInvalid, setIsInputInvalid] = useState({
    ticker: false,
    quantity: false,
  });
  const [transactionType, setTransactionType] = useState<string>('quote');
  const [quoteData, setQuoteData] = useState<StockQuote | undefined>(undefined);
  const [isProcessingRequest, setIsProcessingRequest] = useState(false);
  const navigate = useNavigate();

  if (!user) return <Navigate to='/login' replace />;

  /** Update form data field */
  function handleChange(evt: ChangeEvent<HTMLInputElement>) {
    const { name, value } = evt.target;
    setFormData((data) => ({ ...data, [name]: value }));
  }

  async function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    setIsProcessingRequest(true);

    setIsInputInvalid((inputValidity) => ({
      ...inputValidity,
      ticker: false,
      quantity: false,
    }));

    const { ticker, quantity } = formData;
    const cleanTicker = ticker.trim().toUpperCase();

    if (cleanTicker.length === 0) {
      setIsInputInvalid((inputValidity) => ({
        ...inputValidity,
        ticker: true,
      }));
    } else {
      if (transactionType === 'quote') {
        await quoteRequest(cleanTicker, quantity);
      } else if (quantity <= 0) {
        setIsInputInvalid((inputValidity) => ({
          ...inputValidity,
          quantity: true,
        }));
      } else if (transactionType === 'buy') {
        await buyRequest(cleanTicker, quantity);
      } else {
        await sellRequest(cleanTicker, quantity);
      }
    }

    setFormData((data) => ({ ...data, ticker: cleanTicker }));
    setIsProcessingRequest(false);
  }

  async function buyRequest(ticker: string, quantity: number) {
    try {
      const { price, qty, total, balance } = await PaperTraderApi.buyStock(
        ticker,
        quantity
      );

      return navigate('/success', {
        state: {
          ticker,
          qty,
          price,
          total,
          balance,
          buyTransaction: true,
        },
        replace: true,
      });
    } catch (error) {
      if (error instanceof AxiosError && error.code === 'ERR_BAD_REQUEST') {
        setErrors(error.response?.data.error.message);
      } else {
        setErrors(
          'There was an issue with your request. Please try again later.'
        );
      }
    }
  }

  async function sellRequest(ticker: string, quantity: number) {
    try {
      console.log('Sell request');

      const { price, qty, total, balance } = await PaperTraderApi.sellStock(
        ticker,
        quantity
      );

      return navigate('/success', {
        state: {
          ticker,
          price,
          qty,
          total,
          balance,
          buyTransaction: false,
        },
        replace: true,
      });
    } catch (error) {
      if (error instanceof AxiosError && error.code === 'ERR_BAD_REQUEST') {
        setErrors(error.response?.data.error.message);
      } else {
        setErrors(
          'There was an issue with your request. Please try again later.'
        );
      }
    }
  }

  async function quoteRequest(ticker: string, quantity: number) {
    try {
      const { c: price } = await PaperTraderApi.getStock(ticker);
      const total = price * quantity;
      setQuoteData({ ticker, price, quantity, total });
    } catch (error) {
      if (error instanceof AxiosError && error.code === 'ERR_BAD_REQUEST') {
        setErrors(error.response?.data.error.message);
      } else {
        setErrors(
          'There was an issue with your request. Please try again later.'
        );
      }
    }
  }

  return (
    <Pane display='flex' flexDirection='column' alignItems='center'>
      <Heading is='h1' size={900}>
        Trade Stocks
      </Heading>
      {errors && (
        <Alert
          intent='danger'
          title='Something went wrong.'
          marginTop={12}
          marginBottom={12}
        >
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
            required
            isInvalid={isInputInvalid.ticker}
            validationMessage={
              isInputInvalid.ticker ? 'Missing stock symbol' : undefined
            }
          />
          <TextInputField
            label='Please enter a quantity:'
            name='quantity'
            value={formData.quantity}
            type='number'
            onChange={handleChange}
            min={0}
            isInvalid={isInputInvalid.quantity}
            validationMessage={
              isInputInvalid.quantity
                ? 'Please enter a quantity greater than zero.'
                : undefined
            }
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
            <Button isLoading={isProcessingRequest}>Submit</Button>
          </Pane>
        </form>
      </Pane>
      {quoteData && (
        <Pane marginTop={12}>
          <Paragraph>
            {' '}
            <strong>{quoteData.quantity}</strong> share
            {quoteData.quantity !== 1 && 's'} of{' '}
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
