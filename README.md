## Resources

### Building Dapps using Web3, MetaMask

https://medium.com/crowdbotics/building-ethereum-dapps-with-meta-mask-9bd0685dfd57
https://medium.com/quiknode/building-applications-on-compound-finance-cf2640514f4f
https://medium.com/coinmonks/tutorial-how-to-connect-a-javascript-front-end-to-a-smart-contract-6af4bdf45f7a
https://ethereum.stackexchange.com/questions/19665/how-to-calculate-transaction-fee
https://metamask.github.io/metamask-docs/
https://bitsofco.de/calling-smart-contract-functions-using-web3-js-call-vs-send/
https://observablehq.com/@consensys-academy/web3-js-and-metamask
https://ylv.io/10-web3-metamask-use-cases-ever-blockchain-developer-needs/

### General Web Development

https://www.w3schools.com/js/js_popup.asp
https://stackoverflow.com/questions/39679505/using-await-outside-of-an-async-function

### Kovan Test-net : Ether Faucets

https://faucet.kovan.network/
https://gitter.im/kovan-testnet/faucet

<br>

--------------------------------------------------------------------------------------------------

<br>

## Notes

* When testing, use small amounts of ETH and Dai (I used 1 Dai) since faucets can only provide 1-3 KETH (Kovan ETH) in a 24h period.
* Decimal values cannot be used for Dai, and large numbers have to be passed as BigNumber objects or strings

<br>

--------------------------------------------------------------------------------------------------

<br>

## Running the Dapp

1. Clone the repository into a folder `Test`

2. Run `npm init` inside `Test` to ensure that all NodeJS dependencies mentioned are installed

3. Go to `Test/server/server.js` and modify the `proj_dir` variable to hold the path of the `Test` repository in your system

4. Open a terminal inside `Test` directory. Run `npm run dev` to verify that there are no build errors and start the NodeJS server

<br>

--------------------------------------------------------------------------------------------------

<br>

## Video Notes

The Etherscan links corresponding to the transactions executed in the video `demo-vid.mp4` are :

Txn 41 : https://kovan.etherscan.io/tx/0x69182c733ab96e53a210443381999a6fdd42cb2c1cc4995b544dd37b52f69c0e

Txn 42 : https://kovan.etherscan.io/tx/0x934db5f1373e9c4c0c361775d2dc65828224468058e7f1f108ff56be7ce1c577

Txn 43 : https://kovan.etherscan.io/tx/0x65d6484df2205a909c1ed1a96dd575a7813a0eecbc12075222c45de2295f8a7b
