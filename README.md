# Build an End-to-End Dapp on Aptos

A common way to learn a new framework or programming language is to build a simple todo list. In this tutorial, we will learn how to build an end-to-end todo list dapp, starting from the smart contract side through the front-end side and finally use of a wallet to interact with the two.

See the completed code in the [my_first_dapp](https://github.com/aptos-labs/aptos-core/tree/main/aptos-move/move-examples/my_first_dapp).

## Chapters

After meeting the [prerequisites](https://aptos.dev/en/build/guides/build-e2e-dapp#prerequisites) and [getting set up](https://aptos.dev/en/build/guides/build-e2e-dapp#setup) as described below, you will follow this tutorial in this order:

1. [Create a smart contract](./chapters/1_create_a_smart_contract.md)
2. [Set up React app](./chapters/2_set_up_react_app.md)
3. [Add Wallet support](./chapters/3_add_wallet_support.md)
4. [Fetch Data from Chain](./chapters/4_fetch_data_from_chain.md)
5. [Submit data to chain](./chapters/5_submit_data_to_chain.md)
6. [Handle Tasks](./chapters/6_handle_tasks.md)

## Prerequisites

You must have:

- [Aptos CLI](/en/build/cli)
- [Aptos TypeScript SDK](/en/build/sdks/ts-sdk)
- [Aptos Wallet Adapter](/en/build/sdks/wallet-adapter)
- [Create React App](https://create-react-app.dev/)
- [Node and npm](https://nodejs.org/en/)

Although we will explain some React decisions, we are not going to deep dive into how React works; so we assume you have some previous experience with React.

## Setup

In this section, we will create a `my-first-dapp` directory to hold our project files, both client-side code (React based) and the Move code (our smart contract).

1. Open a terminal and navigate to the desired directory for the project (for example, the `Desktop` directory).
2. Create a new directory called `my-first-dapp`, for example:

    ```bash
    mkdir my-first-dapp
    ```

3. Navigate into that directory:

    ```bash
    cd my-first-dapp
    ```

Now let’s [create a smart contract](./chapters/1_create_a_smart_contract.md).
