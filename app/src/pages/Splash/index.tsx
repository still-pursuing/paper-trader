import { Link as ReactRouterLink } from 'react-router-dom';
import { Heading, Link, Pane, Paragraph, Alert, Spinner } from 'evergreen-ui';
import { useEffect, useState } from 'react';

import PaperTraderApi from '../../helpers/PaperTraderApi';
import DataTable from '../../components/DataTable';
import './Splash.css';

interface ActivityList extends Array<Activity> {}

interface Activity {
  ticker?: string;
  quantity?: number;
  price?: number;
  transactionType?: string;
  from?: string;
}

export function Splash() {
  const [tradeActivity, setTradeActivity] = useState<ActivityList | undefined>(
    undefined
  );
  const [errors, setErrors] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function loadActivity() {
      try {
        const activity = await PaperTraderApi.getHomeFeed();
        setTradeActivity(activity);
        setErrors(undefined);
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
      <Pane background='tint2' elevation={1}>
        <Heading
          is='h1'
          display='flex'
          justifyContent='space-around'
          size={900}
        >
          Paper Trader
        </Heading>
        <Paragraph display='flex' justifyContent='space-around' marginTop={10}>
          Trading real stocks with fake money.
        </Paragraph>
      </Pane>
      <Pane padding={10}>
        {errors ? (
          <Pane>
            <Alert intent='danger' title='Something went wrong'>
              {errors}
            </Alert>
          </Pane>
        ) : tradeActivity ? (
          <DataTable tradeActivity={tradeActivity} />
        ) : (
          <Pane display='flex' flexDirection='column' alignItems='center'>
            <Heading is='h4' size={900}>
              Loading Transaction Activity...
            </Heading>
            <Spinner marginX='auto' marginY={50} />
          </Pane>
        )}
      </Pane>
      <Link is={ReactRouterLink} to='/login'>
        Discord Log In
      </Link>
      <p>Deployed on Firebase.</p>
    </Pane>
  );
}
