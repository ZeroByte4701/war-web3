import { useEffect, useState } from 'react';
import { Box, Button, Divider, Paper, Typography } from '@mui/material';
import { useMoralis, useMoralisWeb3Api, useERC20Balances } from 'react-moralis';
import { Moralis } from 'moralis';
import { BalanceResult } from 'utils/types';
import { getBalanceOptions } from 'utils/functions';

const FromWei = Moralis.Units.FromWei;

function BalanceTab() {
  const { Web3API } = useMoralisWeb3Api();
  const { fetchERC20Balances, data: tokens } = useERC20Balances();
  const { user } = useMoralis();
  const [ethBalance, setethBalance] = useState('0');
  const balanceOptions = getBalanceOptions(user);

  const fetchNativeBalance = async () => {
    const result = (await Web3API.account
      .getNativeBalance(balanceOptions)
      .catch((err) => console.error(err))) as BalanceResult;
    if (result.balance) {
      setethBalance(FromWei(result.balance));
    }
  };

  useEffect(() => {
    fetchNativeBalance();
    fetchERC20Balances({ params: balanceOptions });
  }, []);

  const handleClick = () => {};
  return (
    <Paper sx={{ mt: 4, display: 'flex' }} elevation={3}>
      <Typography sx={{ ml: 4, mt: 1 }}>ERC20 Tokens</Typography>
      <Button
        sx={{ m: 4 }}
        color="secondary"
        variant="contained"
        onClick={handleClick}
      >
        {ethBalance}
        <b>&nbsp;eth</b>
      </Button>
      {tokens &&
        tokens.map((token) => (
          <Box key={token.name}>
            <Typography sx={{ ml: 4, mt: 1 }}>
              {FromWei(token.balance)}
              <b>&nbsp;{token.symbol}</b>
            </Typography>

            <Divider />
          </Box>
        ))}
    </Paper>
  );
}

export default BalanceTab;