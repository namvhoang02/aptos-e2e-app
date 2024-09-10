import { Aptos, AptosConfig, Network, NetworkToNetworkName } from "@aptos-labs/ts-sdk";

// Setup the client
const APTOS_NETWORK: Network = NetworkToNetworkName[process.env.APTOS_NETWORK ?? Network.DEVNET];
const config = new AptosConfig({ network: APTOS_NETWORK });
const client = new Aptos(config);

export { client };