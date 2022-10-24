import { Pane, Heading, TextInputField, Button } from 'evergreen-ui';
import { ChangeEvent, useState } from 'react';
import PaperTraderApi from '../../helpers/PaperTraderApi';

function Trading() {
  const [value, setValue] = useState('');

  /** Update form data field */
  function handleChange(evt: ChangeEvent<HTMLInputElement>) {
    // console.log(evt.target.value);
    const { value } = evt.target;
    setValue(value);
  }

  async function buyRequest() {
    if (value.length > 0) {
      const stock = await PaperTraderApi.buyStock(value.trim().toUpperCase());
      setValue(value.trim().toUpperCase());
      console.log(stock);
    }
  }

  async function sellRequest() {
    console.log('To implement');
  }

  return (
    <Pane display='flex' flexDirection='column' alignItems='center'>
      <Heading is='h1' size={900}>
        Trade Stocks
      </Heading>
      <Pane>
        <TextInputField
          label='Please enter a stock symbol:'
          value={value}
          onChange={handleChange}
          maxLength={5}
        />
      </Pane>
      <Pane>
        <Button onClick={buyRequest}>Buy</Button>
        <Button onClick={sellRequest}>Sell</Button>
      </Pane>
    </Pane >
  );

}

export default Trading;