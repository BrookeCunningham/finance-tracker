import { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import Button from '@mui/material/Button';
import { getLinkToken, exchangeToken } from '../api/plaid';

export default function ConnectBank({ onSuccess }: { onSuccess?: () => void }) {

  const [linkToken, setLinkToken] = useState<string | null>(null);

  // fetch the link token when the component mounts
  useEffect(() => {
    getLinkToken()
      .then((data) => setLinkToken(data.link_token))
      .catch(console.error);
  }, []);

  // called when the user finishes connecting their bank in Plaid Link
  const handleSuccess = useCallback(
    async (public_token: string, metadata: any) => {
      try {
        await exchangeToken(public_token, metadata);
        onSuccess?.();
      } catch (err) {
        console.error(err);
      }
    },
    [onSuccess]
  );

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: handleSuccess,
  });

  console.log('ready:', ready, 'linkToken:', linkToken);

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => open()}
      disabled={!ready || !linkToken}
    >
      Connect Bank
    </Button>
  );
}