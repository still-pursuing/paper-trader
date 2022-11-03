import { Pane, Heading, Paragraph, Spinner } from 'evergreen-ui';
import { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import PaperTraderApi from '../../helpers/PaperTraderApi';
import UserContext from '../../UserContext';

/**
 * Props:
 * - None
 *
 * State:
 * - None
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
  const navigate = useNavigate();

  // make requests to get username and balance, transactions
  // add a try catch in case accessing db has issues
  useEffect(() => {
    async function loadPortfolio() {
      try {
        const userProfile = await PaperTraderApi.getUserProfile();
        setPortfolio(userProfile);
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
    <Pane display='flex' flexDirection='column' alignItems='center'>
      <Heading is='h1' size={900}>
        Profile Page
      </Heading>
      {portfolio && (
        <Paragraph>
          Hi <>{portfolio.username}!</>
        </Paragraph>
      )}
      {portfolio && (
        <Paragraph>
          You have <>${portfolio.balance} available funds to trade with!</>
        </Paragraph>
      )}
      {!portfolio && (
        <Pane display='flex' flexDirection='column' alignItems='center'>
          <Paragraph>Loading...</Paragraph>
          <Spinner marginX='auto' marginY={30} />
        </Pane>
      )}
    </Pane>
  );
}

export default Profile;
