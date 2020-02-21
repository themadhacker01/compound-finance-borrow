# Resources

==================================================================================================
## Building Dapps using Web3, MetaMask

https://medium.com/quiknode/building-applications-on-compound-finance-cf2640514f4f
https://medium.com/crowdbotics/building-ethereum-dapps-with-meta-mask-9bd0685dfd57
https://medium.com/coinmonks/tutorial-how-to-connect-a-javascript-front-end-to-a-smart-contract-6af4bdf45f7a
https://ethereum.stackexchange.com/questions/19665/how-to-calculate-transaction-fee
https://metamask.github.io/metamask-docs/
https://bitsofco.de/calling-smart-contract-functions-using-web3-js-call-vs-send/
https://observablehq.com/@consensys-academy/web3-js-and-metamask

==================================================================================================
## General Web Development

https://www.w3schools.com/js/js_popup.asp
https://stackoverflow.com/questions/39679505/using-await-outside-of-an-async-function

==================================================================================================
## Kovan Test-net : Ether Faucets

https://faucet.kovan.network/
https://gitter.im/kovan-testnet/faucet

==================================================================================================
# Notes

* When testing, test with small amounts of ETH and Dai (I used 1 Dai) since faucets can only provide 1-3 KETH in a 24h period.
* Decimal values cannot be used for Dai, and large numbers have to be passed as BigNumber objects or strings

==================================================================================================
# Running the Dapp

1. Clone the repository into a folder `Test`

2. Run `npm init` inside `Test` to ensure that all NodeJS dependencies mentioned are installed

3. Go to `Test/server/server.js` and modify the `proj_dir` variable to hold the path of the repository in your system

4. Open a terminal inside `Test` directory. Run `npm run dev` to verify that there are no build errors and start the NodeJS server