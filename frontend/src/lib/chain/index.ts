// https://github.com/sushiswap/sushiswap/blob/master/packages/sushi/src/chain/index.ts

export function getAccountUrl(
  accountAddress: string,
  network = 'mainnet',
): string {
  if (network === 'mainnet') {
    return `https://aptoscan.com/account/${accountAddress}`;
  }
  return `https://aptoscan.com/account/${accountAddress}?network=${network}`;
}

export function getTxUrl(txHash: string, network = 'mainnet'): string {
  return `https://aptoscan.com/transaction/${txHash}?network=${network}`;
}
