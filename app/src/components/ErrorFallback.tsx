import { Pane, Heading, Alert } from 'evergreen-ui';

function ErrorFallback({ error }: any) {
  let { message } = error;

  message = 'Either generic or a specific message.';
  return (
    <Pane display='flex' flexDirection='column' alignItems='center'>
      <Heading is='h1' size={900}>
        Oh no!
      </Heading>
      <Alert intent='danger' title='Something went wrong.'>
        {message}
      </Alert>
    </Pane>
  );
}

export default ErrorFallback;
