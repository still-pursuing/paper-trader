import { Pane, Heading, Paragraph, Spinner } from 'evergreen-ui';
import { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import PaperTraderApi from '../../helpers/PaperTraderApi';
import UserContext from '../../UserContext';
import { Holdings } from '../../interfaces/holdings';
import DataTable from '../../components/DataTable';

const tableHeaders = [
  'Company',
  'Ticker',
  'Total Shares Owned',
  'Current Value',
  'Total Value',
];

/**
 * Props:
 * - handleLogout: function to be called in App component
 *
 * State:
 * - portfolio: Portfolio interface or undefined
 *
 * Events:
 * - None
 *
 * Routes --> Profile
 */

interface Portfolio {
  username: string;
  balance: string;
}

interface LogoutParams {
  handleLogout: () => void;
}

function Profile({ handleLogout }: LogoutParams) {
  const user = useContext(UserContext);
  const [portfolio, setPortfolio] = useState<Portfolio | undefined>(undefined);
  const [holdings, setHoldings] = useState<Holdings[] | undefined>(undefined);
  const navigate = useNavigate();

  // make requests to get username and balance, transactions
  // add a try catch in case accessing db has issues
  useEffect(() => {
    async function loadPortfolio() {
      try {
        const { userProfile, userPortfolio } =
          await PaperTraderApi.getUserAccount();
        setPortfolio(userProfile);
        setHoldings(userPortfolio);
      } catch (error) {
        const message: string = "Couldn't load profile, please log in again";
        handleLogout();
        return navigate('/login', { state: { message }, replace: true });
      }
    }
    if (user) loadPortfolio();
  }, [user, navigate, handleLogout]);

  if (!user) return <Navigate to='/login' replace />;

  return (
    <Pane>
      <Heading
        is='h1'
        size={900}
        display='flex'
        flexDirection='column'
        alignItems='center'
      >
        Profile Page
      </Heading>
      {portfolio ? (
        <Pane>
          <Pane display='flex' flexDirection='column' alignItems='center'>
            <Paragraph>
              Hi <>{portfolio.username}!</>
            </Paragraph>
            <Paragraph>
              You have a balance of{' '}
              {Number(portfolio.balance).toLocaleString('en', {
                style: 'currency',
                currency: 'USD',
              })}{' '}
              to trade with.
            </Paragraph>
          </Pane>
          <Pane>
            {holdings && (
              <DataTable tableHeaders={tableHeaders} tableContent={holdings} />
            )}
          </Pane>
        </Pane>
      ) : (
        <Pane display='flex' flexDirection='column' alignItems='center'>
          <Paragraph>Loading...</Paragraph>
          <Spinner marginX='auto' marginY={30} />
        </Pane>
      )}
    </Pane>
  );
}

export default Profile;
