// npx ts-node ./src/create_list.ts
import { client } from "./utils";
import { MODULE_ADDRESS } from "./config";
import { getAccount } from "./account";

async function main() {
  try {
    const account = await getAccount();

    // build transaction
    const transaction = await client.transaction.build.simple({
      sender: account.accountAddress,
      data: {
        function:`${MODULE_ADDRESS}::todolist::create_list`,
        functionArguments:[]
      },
    });
    // using sign and submit separately
    const senderAuthenticator = client.transaction.sign({ signer: account, transaction });
    const committedTransaction = await client.transaction.submit.simple({ transaction, senderAuthenticator });

    // wait for transaction
    const res = await client.waitForTransaction({ transactionHash: committedTransaction.hash });
    console.log(res);
  } catch (error: any) {
    console.log(error);
  }
}

main();