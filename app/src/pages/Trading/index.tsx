import {
  Pane,
  Heading,
  TextInputField,
  Button,
  RadioGroup,
} from 'evergreen-ui';
import { ChangeEvent, FormEvent, useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import PaperTraderApi from '../../helpers/PaperTraderApi';
import UserContext from '../../UserContext';

const options = [
  { label: 'Buy', value: 'buy' },
  { label: 'Sell', value: 'sell' },
  { label: 'Get Quote', value: 'quote' },
];

function Trading() {
  const user = useContext(UserContext);
  const [formData, setFormData] = useState({ ticker: '', quantity: 0 });
  const [transactionType, setTransactionType] = useState<string>('quote');
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
        quoteRequest(ticker);
      } else if (transactionType === 'buy' && quantity > 0) {
        buyRequest(cleanTicker, quantity);
      } else if (transactionType === 'sell' && quantity > 0) {
        sellRequest(cleanTicker);
      } else {
        console.log('Throw an error: Quantity needs to be > 0');
      }
    }

    setFormData((data) => ({ ...data, ticker: cleanTicker }));
  }

  async function buyRequest(ticker: string, quantity: number) {
    try {
      const { price, qty, total } = await PaperTraderApi.buyStock(
        ticker,
        quantity
      );

      return navigate('/success', {
        state: { ticker, qty, price, total },
        replace: true,
      });
    } catch (error) {
      console.log(error); // change to error handling
    }
  }

  async function sellRequest(ticker: string) {
    console.log('To implement sell');
  }

  async function quoteRequest(ticker: string) {
    console.log('To implement quote');
  }

  return (
    <Pane display='flex' flexDirection='column' alignItems='center'>
      <Heading is='h1' size={900}>
        Trade Stocks
      </Heading>
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
    </Pane>
  );
}

export default Trading;
