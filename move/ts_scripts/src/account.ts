// https://aptos-labs.github.io/aptos-ts-sdk/@aptos-labs/ts-sdk-1.5.1/
import { Ed25519PrivateKey } from "@aptos-labs/ts-sdk";
import { client } from "./utils";
import { PRIVATE_KEY } from "./config";

export async function getAccount() {
  const privateKey = new Ed25519PrivateKey(PRIVATE_KEY);

  const account = await client.deriveAccountFromPrivateKey({ privateKey });
  return account;
}
