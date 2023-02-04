import { Pane, Heading, Paragraph, Spinner, Strong, Text } from 'evergreen-ui';
import { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import PaperTraderApi from '../../helpers/PaperTraderApi';
import UserContext from '../../UserContext';
import { Profile } from '../../interfaces/profile';
import { Holdings } from '../../interfaces/holdings';
import DataTable from '../../components/DataTable';

const holdingsTableHeaders = [
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
 * - profile: profile interface or undefined
 *
 * Events:
 * - None
 *
 * Routes --> Account
 */

interface LogoutParams {
  handleLogout: () => void;
}

function Account({ handleLogout }: LogoutParams) {
  const user = useContext(UserContext);
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const [holdings, setHoldings] = useState<Holdings[] | undefined>(undefined);
  const [totalHoldings, setTotalHoldings] = useState<string | undefined>(
    undefined
  );
  const [totalValue, setTotalValue] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  // make requests to get username and balance, transactions
  // add a try catch in case accessing db has issues
  useEffect(() => {
    async function loadAccount() {
      try {
        const {
          userProfile,
          userHoldings,
          totalHoldingsValue,
          totalUserValue,
        } = await PaperTraderApi.getUserAccount();
        setProfile(userProfile);
        setHoldings(userHoldings);
        setTotalHoldings(totalHoldingsValue);
        setTotalValue(totalUserValue);
      } catch (error) {
        const message: string = "Couldn't load profile, please log in again";
        handleLogout();
        return navigate('/login', { state: { message }, replace: true });
      }
    }
    if (user) loadAccount();
  }, [user, navigate, handleLogout]);

  if (!user) return <Navigate to='/login' replace />;

  return (
    <Pane>
      {profile ? (
        <Pane>
          <Heading
            is='h1'
            size={900}
            display='flex'
            flexDirection='column'
            alignItems='center'
          >
            Hi <>{profile.username}!</>
          </Heading>
          <Pane display='flex' flexDirection='column' alignItems='center'>
            <Paragraph>
              You have a balance of {profile.balance} to trade with.
            </Paragraph>
          </Pane>
          <Pane>
            {holdings && (
              <Pane>
                <DataTable
                  tableHeaders={holdingsTableHeaders}
                  tableContent={holdings}
                />
                <Pane
                  display='flex'
                  flexDirection='column'
                  alignItems='end'
                  marginRight={10}
                >
                  <Pane>
                    <Strong size={400}>Total Holdings Value: </Strong>
                    <Text size={400}>{totalHoldings}</Text>
                  </Pane>
                  <Pane>
                    <Strong size={400}>Total Account Value: </Strong>
                    <Text size={400}>{totalValue}</Text>
                  </Pane>
                </Pane>
              </Pane>
            )}
          </Pane>
        </Pane>
      ) : (
        <Pane display='flex' flexDirection='column' alignItems='center'>
          <Heading is='h1' size={900}>
            Loading User Data...
          </Heading>
          <Spinner marginX='auto' marginY={30} />
        </Pane>
      )}
    </Pane>
  );
}

export default Account;
