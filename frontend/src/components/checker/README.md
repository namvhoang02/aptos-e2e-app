## Coding style

1. Connect Checker

```tsx
<Checker.Connect variant='outline' size='default' fullWidth>
  {/** do something that requires wallet connection */}
</Checker.Connect>
```

2. Network Checker

```tsx
<Checker.Network
  variant='outline'
  size='default'
  fullWidth
  chainId={pool.chainId as ChainId}
>
  {/** do something that requires wallet connection */}
</Checker.Network>
```

## Reference

- https://github.com/sushiswap/sushiswap/tree/1721e93e061c3e81535058b84d8460c73e9f37b7/apps/web/src/lib/wagmi/systems/Checker

- https://github.com/sushiswap/sushiswap/tree/1721e93e061c3e81535058b84d8460c73e9f37b7/apps/web/src/app/(non-evm)/aptos/(common)/ui/checker
