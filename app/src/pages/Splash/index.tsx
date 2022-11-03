import { Link as ReactRouterLink } from 'react-router-dom';
import { Heading, Link, Pane, Paragraph } from 'evergreen-ui';

import DataTable from '../../components/DataTable';
import './Splash.css';

export function Splash() {
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
        <DataTable></DataTable>
      </Pane>
      <Link is={ReactRouterLink} to='/login'>
        Discord Log In
      </Link>
      <p>Deployed on Firebase.</p>
    </Pane>
  );
}
