const Web3 = require('web3');
const request = require('request');

// Assumptions
const DAI_TO_ETH = 0.003901;
const COLLAT_FACTOR = 0.75;
const COLLAT_RATIO = 1.5;

App = {

/*======================================================================================================
		DEFINE ESSENTIALS
		
		CF : Compound Finance
======================================================================================================*/

  web3Provider: null,
	userAccount: {},
	gasLimit: 0,
	
	// For cEth tokens
	cEthAddress: "",
	cEthAbi: "",
	CEthContract: "",

	// For cDai tokens
	cDaiAddress: "",
	cDaiAbi: "",
	CDaiContract: "",

	// For comptroller
	trollAddress: "",
	trollAbi: "",
	TrollContract: "",
  
  // Integrates web3 with our web app
  initWeb3 : async function (){
    if (process.env.MODE == 'development' || typeof window.web3 === 'undefined'){
      App.web3Provider = new Web3(window.ethereum);
    }
    else{
      App.web3Provider = web3.currentProvider;
    }
		web3 = new Web3(App.web3Provider);

		// For cEth tokens
		cEthAddress ="0xf92fbe0d3c0dcdae407923b2ac17ec223b1084e4";
		cEthAbi = [
			{
					"inputs": [
							{
									"internalType": "contract ComptrollerInterface",
									"name": "comptroller_",
									"type": "address"
							},
							{
									"internalType": "contract InterestRateModel",
									"name": "interestRateModel_",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "initialExchangeRateMantissa_",
									"type": "uint256"
							},
							{
									"internalType": "string",
									"name": "name_",
									"type": "string"
							},
							{
									"internalType": "string",
									"name": "symbol_",
									"type": "string"
							},
							{
									"internalType": "uint8",
									"name": "decimals_",
									"type": "uint8"
							},
							{
									"internalType": "address payable",
									"name": "admin_",
									"type": "address"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "constructor",
					"signature": "constructor"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "cashPrior",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "interestAccumulated",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "borrowIndex",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "totalBorrows",
									"type": "uint256"
							}
					],
					"name": "AccrueInterest",
					"type": "event",
					"signature": "0x4dec04e750ca11537cabcd8a9eab06494de08da3735bc8871cd41250e190bc04"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": true,
									"internalType": "address",
									"name": "owner",
									"type": "address"
							},
							{
									"indexed": true,
									"internalType": "address",
									"name": "spender",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "amount",
									"type": "uint256"
							}
					],
					"name": "Approval",
					"type": "event",
					"signature": "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "address",
									"name": "borrower",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "borrowAmount",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "accountBorrows",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "totalBorrows",
									"type": "uint256"
							}
					],
					"name": "Borrow",
					"type": "event",
					"signature": "0x13ed6866d4e1ee6da46f845c46d7e54120883d75c5ea9a2dacc1c4ca8984ab80"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "error",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "info",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "detail",
									"type": "uint256"
							}
					],
					"name": "Failure",
					"type": "event",
					"signature": "0x45b96fe442630264581b197e84bbada861235052c5a1aadfff9ea4e40a969aa0"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "address",
									"name": "liquidator",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "address",
									"name": "borrower",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "repayAmount",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "address",
									"name": "cTokenCollateral",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "seizeTokens",
									"type": "uint256"
							}
					],
					"name": "LiquidateBorrow",
					"type": "event",
					"signature": "0x298637f684da70674f26509b10f07ec2fbc77a335ab1e7d6215a4b2484d8bb52"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "address",
									"name": "minter",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "mintAmount",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "mintTokens",
									"type": "uint256"
							}
					],
					"name": "Mint",
					"type": "event",
					"signature": "0x4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "address",
									"name": "oldAdmin",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "address",
									"name": "newAdmin",
									"type": "address"
							}
					],
					"name": "NewAdmin",
					"type": "event",
					"signature": "0xf9ffabca9c8276e99321725bcb43fb076a6c66a54b7f21c4e8146d8519b417dc"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "contract ComptrollerInterface",
									"name": "oldComptroller",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "contract ComptrollerInterface",
									"name": "newComptroller",
									"type": "address"
							}
					],
					"name": "NewComptroller",
					"type": "event",
					"signature": "0x7ac369dbd14fa5ea3f473ed67cc9d598964a77501540ba6751eb0b3decf5870d"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "contract InterestRateModel",
									"name": "oldInterestRateModel",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "contract InterestRateModel",
									"name": "newInterestRateModel",
									"type": "address"
							}
					],
					"name": "NewMarketInterestRateModel",
					"type": "event",
					"signature": "0xedffc32e068c7c95dfd4bdfd5c4d939a084d6b11c4199eac8436ed234d72f926"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "address",
									"name": "oldPendingAdmin",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "address",
									"name": "newPendingAdmin",
									"type": "address"
							}
					],
					"name": "NewPendingAdmin",
					"type": "event",
					"signature": "0xca4f2f25d0898edd99413412fb94012f9e54ec8142f9b093e7720646a95b16a9"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "oldReserveFactorMantissa",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "newReserveFactorMantissa",
									"type": "uint256"
							}
					],
					"name": "NewReserveFactor",
					"type": "event",
					"signature": "0xaaa68312e2ea9d50e16af5068410ab56e1a1fd06037b1a35664812c30f821460"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "address",
									"name": "redeemer",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "redeemAmount",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "redeemTokens",
									"type": "uint256"
							}
					],
					"name": "Redeem",
					"type": "event",
					"signature": "0xe5b754fb1abb7f01b499791d0b820ae3b6af3424ac1c59768edb53f4ec31a929"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "address",
									"name": "payer",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "address",
									"name": "borrower",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "repayAmount",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "accountBorrows",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "totalBorrows",
									"type": "uint256"
							}
					],
					"name": "RepayBorrow",
					"type": "event",
					"signature": "0x1a2a22cb034d26d1854bdc6666a5b91fe25efbbb5dcad3b0355478d6f5c362a1"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "address",
									"name": "benefactor",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "addAmount",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "newTotalReserves",
									"type": "uint256"
							}
					],
					"name": "ReservesAdded",
					"type": "event",
					"signature": "0xa91e67c5ea634cd43a12c5a482724b03de01e85ca68702a53d0c2f45cb7c1dc5"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "address",
									"name": "admin",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "reduceAmount",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "newTotalReserves",
									"type": "uint256"
							}
					],
					"name": "ReservesReduced",
					"type": "event",
					"signature": "0x3bad0c59cf2f06e7314077049f48a93578cd16f5ef92329f1dab1420a99c177e"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": true,
									"internalType": "address",
									"name": "from",
									"type": "address"
							},
							{
									"indexed": true,
									"internalType": "address",
									"name": "to",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "amount",
									"type": "uint256"
							}
					],
					"name": "Transfer",
					"type": "event",
					"signature": "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
			},
			{
					"payable": true,
					"stateMutability": "payable",
					"type": "fallback"
			},
			{
					"constant": false,
					"inputs": [],
					"name": "_acceptAdmin",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xe9c714f2"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "uint256",
									"name": "reduceAmount",
									"type": "uint256"
							}
					],
					"name": "_reduceReserves",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x601a0bf1"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "contract ComptrollerInterface",
									"name": "newComptroller",
									"type": "address"
							}
					],
					"name": "_setComptroller",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x4576b5db"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "contract InterestRateModel",
									"name": "newInterestRateModel",
									"type": "address"
							}
					],
					"name": "_setInterestRateModel",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xf2b3abbd"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address payable",
									"name": "newPendingAdmin",
									"type": "address"
							}
					],
					"name": "_setPendingAdmin",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xb71d1a0c"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "uint256",
									"name": "newReserveFactorMantissa",
									"type": "uint256"
							}
					],
					"name": "_setReserveFactor",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xfca7820b"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "accrualBlockNumber",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x6c540baf"
			},
			{
					"constant": false,
					"inputs": [],
					"name": "accrueInterest",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xa6afed95"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "admin",
					"outputs": [
							{
									"internalType": "address payable",
									"name": "",
									"type": "address"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xf851a440"
			},
			{
					"constant": true,
					"inputs": [
							{
									"internalType": "address",
									"name": "owner",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "spender",
									"type": "address"
							}
					],
					"name": "allowance",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xdd62ed3e"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "spender",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "amount",
									"type": "uint256"
							}
					],
					"name": "approve",
					"outputs": [
							{
									"internalType": "bool",
									"name": "",
									"type": "bool"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x095ea7b3"
			},
			{
					"constant": true,
					"inputs": [
							{
									"internalType": "address",
									"name": "owner",
									"type": "address"
							}
					],
					"name": "balanceOf",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x70a08231"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "owner",
									"type": "address"
							}
					],
					"name": "balanceOfUnderlying",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x3af9e669"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "uint256",
									"name": "borrowAmount",
									"type": "uint256"
							}
					],
					"name": "borrow",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xc5ebeaec"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "account",
									"type": "address"
							}
					],
					"name": "borrowBalanceCurrent",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x17bfdfbc"
			},
			{
					"constant": true,
					"inputs": [
							{
									"internalType": "address",
									"name": "account",
									"type": "address"
							}
					],
					"name": "borrowBalanceStored",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x95dd9193"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "borrowIndex",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xaa5af0fd"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "borrowRatePerBlock",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xf8f9da28"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "comptroller",
					"outputs": [
							{
									"internalType": "contract ComptrollerInterface",
									"name": "",
									"type": "address"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x5fe3b567"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "decimals",
					"outputs": [
							{
									"internalType": "uint8",
									"name": "",
									"type": "uint8"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x313ce567"
			},
			{
					"constant": false,
					"inputs": [],
					"name": "exchangeRateCurrent",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xbd6d894d"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "exchangeRateStored",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x182df0f5"
			},
			{
					"constant": true,
					"inputs": [
							{
									"internalType": "address",
									"name": "account",
									"type": "address"
							}
					],
					"name": "getAccountSnapshot",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							},
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							},
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							},
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xc37f68e2"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "getCash",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x3b1d21a2"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "contract ComptrollerInterface",
									"name": "comptroller_",
									"type": "address"
							},
							{
									"internalType": "contract InterestRateModel",
									"name": "interestRateModel_",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "initialExchangeRateMantissa_",
									"type": "uint256"
							},
							{
									"internalType": "string",
									"name": "name_",
									"type": "string"
							},
							{
									"internalType": "string",
									"name": "symbol_",
									"type": "string"
							},
							{
									"internalType": "uint8",
									"name": "decimals_",
									"type": "uint8"
							}
					],
					"name": "initialize",
					"outputs": [],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x99d8c1b4"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "interestRateModel",
					"outputs": [
							{
									"internalType": "contract InterestRateModel",
									"name": "",
									"type": "address"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xf3fdb15a"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "isCToken",
					"outputs": [
							{
									"internalType": "bool",
									"name": "",
									"type": "bool"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xfe9c44ae"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "borrower",
									"type": "address"
							},
							{
									"internalType": "contract CToken",
									"name": "cTokenCollateral",
									"type": "address"
							}
					],
					"name": "liquidateBorrow",
					"outputs": [],
					"payable": true,
					"stateMutability": "payable",
					"type": "function",
					"signature": "0xaae40a2a"
			},
			{
					"constant": false,
					"inputs": [],
					"name": "mint",
					"outputs": [],
					"payable": true,
					"stateMutability": "payable",
					"type": "function",
					"signature": "0x1249c58b"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "name",
					"outputs": [
							{
									"internalType": "string",
									"name": "",
									"type": "string"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x06fdde03"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "pendingAdmin",
					"outputs": [
							{
									"internalType": "address payable",
									"name": "",
									"type": "address"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x26782247"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "uint256",
									"name": "redeemTokens",
									"type": "uint256"
							}
					],
					"name": "redeem",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xdb006a75"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "uint256",
									"name": "redeemAmount",
									"type": "uint256"
							}
					],
					"name": "redeemUnderlying",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x852a12e3"
			},
			{
					"constant": false,
					"inputs": [],
					"name": "repayBorrow",
					"outputs": [],
					"payable": true,
					"stateMutability": "payable",
					"type": "function",
					"signature": "0x4e4d9fea"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "borrower",
									"type": "address"
							}
					],
					"name": "repayBorrowBehalf",
					"outputs": [],
					"payable": true,
					"stateMutability": "payable",
					"type": "function",
					"signature": "0xe5974619"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "reserveFactorMantissa",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x173b9904"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "liquidator",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "borrower",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "seizeTokens",
									"type": "uint256"
							}
					],
					"name": "seize",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xb2a02ff1"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "supplyRatePerBlock",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xae9d70b0"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "symbol",
					"outputs": [
							{
									"internalType": "string",
									"name": "",
									"type": "string"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x95d89b41"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "totalBorrows",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x47bd3718"
			},
			{
					"constant": false,
					"inputs": [],
					"name": "totalBorrowsCurrent",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x73acee98"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "totalReserves",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x8f840ddd"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "totalSupply",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x18160ddd"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "dst",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "amount",
									"type": "uint256"
							}
					],
					"name": "transfer",
					"outputs": [
							{
									"internalType": "bool",
									"name": "",
									"type": "bool"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xa9059cbb"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "src",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "dst",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "amount",
									"type": "uint256"
							}
					],
					"name": "transferFrom",
					"outputs": [
							{
									"internalType": "bool",
									"name": "",
									"type": "bool"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x23b872dd"
			}
	];
		CEthContract = new web3.eth.Contract(cEthAbi, cEthAddress);
		
		// For cDai tokens
		cDaiAddress = "0xe7bc397dbd069fc7d0109c0636d06888bb50668c"
		cDaiAbi = [
			{
					"inputs": [
							{
									"internalType": "address",
									"name": "underlying_",
									"type": "address"
							},
							{
									"internalType": "contract ComptrollerInterface",
									"name": "comptroller_",
									"type": "address"
							},
							{
									"internalType": "contract InterestRateModel",
									"name": "interestRateModel_",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "initialExchangeRateMantissa_",
									"type": "uint256"
							},
							{
									"internalType": "string",
									"name": "name_",
									"type": "string"
							},
							{
									"internalType": "string",
									"name": "symbol_",
									"type": "string"
							},
							{
									"internalType": "uint8",
									"name": "decimals_",
									"type": "uint8"
							},
							{
									"internalType": "address payable",
									"name": "admin_",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "implementation_",
									"type": "address"
							},
							{
									"internalType": "bytes",
									"name": "becomeImplementationData",
									"type": "bytes"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "constructor",
					"signature": "constructor"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "cashPrior",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "interestAccumulated",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "borrowIndex",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "totalBorrows",
									"type": "uint256"
							}
					],
					"name": "AccrueInterest",
					"type": "event",
					"signature": "0x4dec04e750ca11537cabcd8a9eab06494de08da3735bc8871cd41250e190bc04"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": true,
									"internalType": "address",
									"name": "owner",
									"type": "address"
							},
							{
									"indexed": true,
									"internalType": "address",
									"name": "spender",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "amount",
									"type": "uint256"
							}
					],
					"name": "Approval",
					"type": "event",
					"signature": "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "address",
									"name": "borrower",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "borrowAmount",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "accountBorrows",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "totalBorrows",
									"type": "uint256"
							}
					],
					"name": "Borrow",
					"type": "event",
					"signature": "0x13ed6866d4e1ee6da46f845c46d7e54120883d75c5ea9a2dacc1c4ca8984ab80"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "error",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "info",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "detail",
									"type": "uint256"
							}
					],
					"name": "Failure",
					"type": "event",
					"signature": "0x45b96fe442630264581b197e84bbada861235052c5a1aadfff9ea4e40a969aa0"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "address",
									"name": "liquidator",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "address",
									"name": "borrower",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "repayAmount",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "address",
									"name": "cTokenCollateral",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "seizeTokens",
									"type": "uint256"
							}
					],
					"name": "LiquidateBorrow",
					"type": "event",
					"signature": "0x298637f684da70674f26509b10f07ec2fbc77a335ab1e7d6215a4b2484d8bb52"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "address",
									"name": "minter",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "mintAmount",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "mintTokens",
									"type": "uint256"
							}
					],
					"name": "Mint",
					"type": "event",
					"signature": "0x4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "address",
									"name": "oldAdmin",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "address",
									"name": "newAdmin",
									"type": "address"
							}
					],
					"name": "NewAdmin",
					"type": "event",
					"signature": "0xf9ffabca9c8276e99321725bcb43fb076a6c66a54b7f21c4e8146d8519b417dc"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "contract ComptrollerInterface",
									"name": "oldComptroller",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "contract ComptrollerInterface",
									"name": "newComptroller",
									"type": "address"
							}
					],
					"name": "NewComptroller",
					"type": "event",
					"signature": "0x7ac369dbd14fa5ea3f473ed67cc9d598964a77501540ba6751eb0b3decf5870d"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "address",
									"name": "oldImplementation",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "address",
									"name": "newImplementation",
									"type": "address"
							}
					],
					"name": "NewImplementation",
					"type": "event",
					"signature": "0xd604de94d45953f9138079ec1b82d533cb2160c906d1076d1f7ed54befbca97a"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "contract InterestRateModel",
									"name": "oldInterestRateModel",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "contract InterestRateModel",
									"name": "newInterestRateModel",
									"type": "address"
							}
					],
					"name": "NewMarketInterestRateModel",
					"type": "event",
					"signature": "0xedffc32e068c7c95dfd4bdfd5c4d939a084d6b11c4199eac8436ed234d72f926"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "address",
									"name": "oldPendingAdmin",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "address",
									"name": "newPendingAdmin",
									"type": "address"
							}
					],
					"name": "NewPendingAdmin",
					"type": "event",
					"signature": "0xca4f2f25d0898edd99413412fb94012f9e54ec8142f9b093e7720646a95b16a9"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "oldReserveFactorMantissa",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "newReserveFactorMantissa",
									"type": "uint256"
							}
					],
					"name": "NewReserveFactor",
					"type": "event",
					"signature": "0xaaa68312e2ea9d50e16af5068410ab56e1a1fd06037b1a35664812c30f821460"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "address",
									"name": "redeemer",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "redeemAmount",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "redeemTokens",
									"type": "uint256"
							}
					],
					"name": "Redeem",
					"type": "event",
					"signature": "0xe5b754fb1abb7f01b499791d0b820ae3b6af3424ac1c59768edb53f4ec31a929"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "address",
									"name": "payer",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "address",
									"name": "borrower",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "repayAmount",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "accountBorrows",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "totalBorrows",
									"type": "uint256"
							}
					],
					"name": "RepayBorrow",
					"type": "event",
					"signature": "0x1a2a22cb034d26d1854bdc6666a5b91fe25efbbb5dcad3b0355478d6f5c362a1"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "address",
									"name": "benefactor",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "addAmount",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "newTotalReserves",
									"type": "uint256"
							}
					],
					"name": "ReservesAdded",
					"type": "event",
					"signature": "0xa91e67c5ea634cd43a12c5a482724b03de01e85ca68702a53d0c2f45cb7c1dc5"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "address",
									"name": "admin",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "reduceAmount",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "newTotalReserves",
									"type": "uint256"
							}
					],
					"name": "ReservesReduced",
					"type": "event",
					"signature": "0x3bad0c59cf2f06e7314077049f48a93578cd16f5ef92329f1dab1420a99c177e"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": true,
									"internalType": "address",
									"name": "from",
									"type": "address"
							},
							{
									"indexed": true,
									"internalType": "address",
									"name": "to",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "amount",
									"type": "uint256"
							}
					],
					"name": "Transfer",
					"type": "event",
					"signature": "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
			},
			{
					"payable": true,
					"stateMutability": "payable",
					"type": "fallback"
			},
			{
					"constant": false,
					"inputs": [],
					"name": "_acceptAdmin",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xe9c714f2"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "uint256",
									"name": "addAmount",
									"type": "uint256"
							}
					],
					"name": "_addReserves",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x3e941010"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "uint256",
									"name": "reduceAmount",
									"type": "uint256"
							}
					],
					"name": "_reduceReserves",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x601a0bf1"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "contract ComptrollerInterface",
									"name": "newComptroller",
									"type": "address"
							}
					],
					"name": "_setComptroller",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x4576b5db"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "implementation_",
									"type": "address"
							},
							{
									"internalType": "bool",
									"name": "allowResign",
									"type": "bool"
							},
							{
									"internalType": "bytes",
									"name": "becomeImplementationData",
									"type": "bytes"
							}
					],
					"name": "_setImplementation",
					"outputs": [],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x555bcc40"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "contract InterestRateModel",
									"name": "newInterestRateModel",
									"type": "address"
							}
					],
					"name": "_setInterestRateModel",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xf2b3abbd"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address payable",
									"name": "newPendingAdmin",
									"type": "address"
							}
					],
					"name": "_setPendingAdmin",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xb71d1a0c"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "uint256",
									"name": "newReserveFactorMantissa",
									"type": "uint256"
							}
					],
					"name": "_setReserveFactor",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xfca7820b"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "accrualBlockNumber",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x6c540baf"
			},
			{
					"constant": false,
					"inputs": [],
					"name": "accrueInterest",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xa6afed95"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "admin",
					"outputs": [
							{
									"internalType": "address payable",
									"name": "",
									"type": "address"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xf851a440"
			},
			{
					"constant": true,
					"inputs": [
							{
									"internalType": "address",
									"name": "owner",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "spender",
									"type": "address"
							}
					],
					"name": "allowance",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xdd62ed3e"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "spender",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "amount",
									"type": "uint256"
							}
					],
					"name": "approve",
					"outputs": [
							{
									"internalType": "bool",
									"name": "",
									"type": "bool"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x095ea7b3"
			},
			{
					"constant": true,
					"inputs": [
							{
									"internalType": "address",
									"name": "owner",
									"type": "address"
							}
					],
					"name": "balanceOf",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x70a08231"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "owner",
									"type": "address"
							}
					],
					"name": "balanceOfUnderlying",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x3af9e669"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "uint256",
									"name": "borrowAmount",
									"type": "uint256"
							}
					],
					"name": "borrow",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xc5ebeaec"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "account",
									"type": "address"
							}
					],
					"name": "borrowBalanceCurrent",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x17bfdfbc"
			},
			{
					"constant": true,
					"inputs": [
							{
									"internalType": "address",
									"name": "account",
									"type": "address"
							}
					],
					"name": "borrowBalanceStored",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x95dd9193"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "borrowIndex",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xaa5af0fd"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "borrowRatePerBlock",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xf8f9da28"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "comptroller",
					"outputs": [
							{
									"internalType": "contract ComptrollerInterface",
									"name": "",
									"type": "address"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x5fe3b567"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "decimals",
					"outputs": [
							{
									"internalType": "uint8",
									"name": "",
									"type": "uint8"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x313ce567"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "bytes",
									"name": "data",
									"type": "bytes"
							}
					],
					"name": "delegateToImplementation",
					"outputs": [
							{
									"internalType": "bytes",
									"name": "",
									"type": "bytes"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x0933c1ed"
			},
			{
					"constant": true,
					"inputs": [
							{
									"internalType": "bytes",
									"name": "data",
									"type": "bytes"
							}
					],
					"name": "delegateToViewImplementation",
					"outputs": [
							{
									"internalType": "bytes",
									"name": "",
									"type": "bytes"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x4487152f"
			},
			{
					"constant": false,
					"inputs": [],
					"name": "exchangeRateCurrent",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xbd6d894d"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "exchangeRateStored",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x182df0f5"
			},
			{
					"constant": true,
					"inputs": [
							{
									"internalType": "address",
									"name": "account",
									"type": "address"
							}
					],
					"name": "getAccountSnapshot",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							},
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							},
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							},
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xc37f68e2"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "getCash",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x3b1d21a2"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "implementation",
					"outputs": [
							{
									"internalType": "address",
									"name": "",
									"type": "address"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x5c60da1b"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "interestRateModel",
					"outputs": [
							{
									"internalType": "contract InterestRateModel",
									"name": "",
									"type": "address"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xf3fdb15a"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "isCToken",
					"outputs": [
							{
									"internalType": "bool",
									"name": "",
									"type": "bool"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xfe9c44ae"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "borrower",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "repayAmount",
									"type": "uint256"
							},
							{
									"internalType": "contract CTokenInterface",
									"name": "cTokenCollateral",
									"type": "address"
							}
					],
					"name": "liquidateBorrow",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xf5e3c462"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "uint256",
									"name": "mintAmount",
									"type": "uint256"
							}
					],
					"name": "mint",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xa0712d68"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "name",
					"outputs": [
							{
									"internalType": "string",
									"name": "",
									"type": "string"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x06fdde03"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "pendingAdmin",
					"outputs": [
							{
									"internalType": "address payable",
									"name": "",
									"type": "address"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x26782247"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "uint256",
									"name": "redeemTokens",
									"type": "uint256"
							}
					],
					"name": "redeem",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xdb006a75"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "uint256",
									"name": "redeemAmount",
									"type": "uint256"
							}
					],
					"name": "redeemUnderlying",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x852a12e3"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "uint256",
									"name": "repayAmount",
									"type": "uint256"
							}
					],
					"name": "repayBorrow",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x0e752702"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "borrower",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "repayAmount",
									"type": "uint256"
							}
					],
					"name": "repayBorrowBehalf",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x2608f818"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "reserveFactorMantissa",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x173b9904"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "liquidator",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "borrower",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "seizeTokens",
									"type": "uint256"
							}
					],
					"name": "seize",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xb2a02ff1"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "supplyRatePerBlock",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xae9d70b0"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "symbol",
					"outputs": [
							{
									"internalType": "string",
									"name": "",
									"type": "string"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x95d89b41"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "totalBorrows",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x47bd3718"
			},
			{
					"constant": false,
					"inputs": [],
					"name": "totalBorrowsCurrent",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x73acee98"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "totalReserves",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x8f840ddd"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "totalSupply",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x18160ddd"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "dst",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "amount",
									"type": "uint256"
							}
					],
					"name": "transfer",
					"outputs": [
							{
									"internalType": "bool",
									"name": "",
									"type": "bool"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xa9059cbb"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "src",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "dst",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "amount",
									"type": "uint256"
							}
					],
					"name": "transferFrom",
					"outputs": [
							{
									"internalType": "bool",
									"name": "",
									"type": "bool"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x23b872dd"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "underlying",
					"outputs": [
							{
									"internalType": "address",
									"name": "",
									"type": "address"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x6f307dc3"
			}
	];
		CDaiContract = new web3.eth.Contract(cDaiAbi, cDaiAddress);
		
		// For comptroller, acts as regulator of the various CF markets
		trollAddress = "0x1f5d7f3caac149fe41b8bd62a3673fe6ec0ab73b";
		trollAbi = [
			{
					"inputs": [],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "constructor",
					"signature": "constructor"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "error",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "info",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "detail",
									"type": "uint256"
							}
					],
					"name": "Failure",
					"type": "event",
					"signature": "0x45b96fe442630264581b197e84bbada861235052c5a1aadfff9ea4e40a969aa0"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "address",
									"name": "oldAdmin",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "address",
									"name": "newAdmin",
									"type": "address"
							}
					],
					"name": "NewAdmin",
					"type": "event",
					"signature": "0xf9ffabca9c8276e99321725bcb43fb076a6c66a54b7f21c4e8146d8519b417dc"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "address",
									"name": "oldImplementation",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "address",
									"name": "newImplementation",
									"type": "address"
							}
					],
					"name": "NewImplementation",
					"type": "event",
					"signature": "0xd604de94d45953f9138079ec1b82d533cb2160c906d1076d1f7ed54befbca97a"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "address",
									"name": "oldPendingAdmin",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "address",
									"name": "newPendingAdmin",
									"type": "address"
							}
					],
					"name": "NewPendingAdmin",
					"type": "event",
					"signature": "0xca4f2f25d0898edd99413412fb94012f9e54ec8142f9b093e7720646a95b16a9"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "address",
									"name": "oldPendingImplementation",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "address",
									"name": "newPendingImplementation",
									"type": "address"
							}
					],
					"name": "NewPendingImplementation",
					"type": "event",
					"signature": "0xe945ccee5d701fc83f9b8aa8ca94ea4219ec1fcbd4f4cab4f0ea57c5c3e1d815"
			},
			{
					"payable": true,
					"stateMutability": "payable",
					"type": "fallback"
			},
			{
					"constant": false,
					"inputs": [],
					"name": "_acceptAdmin",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xe9c714f2"
			},
			{
					"constant": false,
					"inputs": [],
					"name": "_acceptImplementation",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xc1e80334"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "newPendingAdmin",
									"type": "address"
							}
					],
					"name": "_setPendingAdmin",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xb71d1a0c"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "newPendingImplementation",
									"type": "address"
							}
					],
					"name": "_setPendingImplementation",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xe992a041"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "admin",
					"outputs": [
							{
									"internalType": "address",
									"name": "",
									"type": "address"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xf851a440"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "comptrollerImplementation",
					"outputs": [
							{
									"internalType": "address",
									"name": "",
									"type": "address"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xbb82aa5e"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "pendingAdmin",
					"outputs": [
							{
									"internalType": "address",
									"name": "",
									"type": "address"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x26782247"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "pendingComptrollerImplementation",
					"outputs": [
							{
									"internalType": "address",
									"name": "",
									"type": "address"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xdcfbc0c7"
			},
			{
					"inputs": [],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "constructor",
					"signature": "constructor"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "error",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "info",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "detail",
									"type": "uint256"
							}
					],
					"name": "Failure",
					"type": "event",
					"signature": "0x45b96fe442630264581b197e84bbada861235052c5a1aadfff9ea4e40a969aa0"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "contract CToken",
									"name": "cToken",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "address",
									"name": "account",
									"type": "address"
							}
					],
					"name": "MarketEntered",
					"type": "event",
					"signature": "0x3ab23ab0d51cccc0c3085aec51f99228625aa1a922b3a8ca89a26b0f2027a1a5"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "contract CToken",
									"name": "cToken",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "address",
									"name": "account",
									"type": "address"
							}
					],
					"name": "MarketExited",
					"type": "event",
					"signature": "0xe699a64c18b07ac5b7301aa273f36a2287239eb9501d81950672794afba29a0d"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "contract CToken",
									"name": "cToken",
									"type": "address"
							}
					],
					"name": "MarketListed",
					"type": "event",
					"signature": "0xcf583bb0c569eb967f806b11601c4cb93c10310485c67add5f8362c2f212321f"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "oldCloseFactorMantissa",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "newCloseFactorMantissa",
									"type": "uint256"
							}
					],
					"name": "NewCloseFactor",
					"type": "event",
					"signature": "0x3b9670cf975d26958e754b57098eaa2ac914d8d2a31b83257997b9f346110fd9"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "contract CToken",
									"name": "cToken",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "oldCollateralFactorMantissa",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "newCollateralFactorMantissa",
									"type": "uint256"
							}
					],
					"name": "NewCollateralFactor",
					"type": "event",
					"signature": "0x70483e6592cd5182d45ac970e05bc62cdcc90e9d8ef2c2dbe686cf383bcd7fc5"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "oldLiquidationIncentiveMantissa",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "newLiquidationIncentiveMantissa",
									"type": "uint256"
							}
					],
					"name": "NewLiquidationIncentive",
					"type": "event",
					"signature": "0xaeba5a6c40a8ac138134bff1aaa65debf25971188a58804bad717f82f0ec1316"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "oldMaxAssets",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "newMaxAssets",
									"type": "uint256"
							}
					],
					"name": "NewMaxAssets",
					"type": "event",
					"signature": "0x7093cf1eb653f749c3ff531d6df7f92764536a7fa0d13530cd26e070780c32ea"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "contract PriceOracle",
									"name": "oldPriceOracle",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "contract PriceOracle",
									"name": "newPriceOracle",
									"type": "address"
							}
					],
					"name": "NewPriceOracle",
					"type": "event",
					"signature": "0xd52b2b9b7e9ee655fcb95d2e5b9e0c9f69e7ef2b8e9d2d0ea78402d576d22e22"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "contract Unitroller",
									"name": "unitroller",
									"type": "address"
							},
							{
									"internalType": "contract PriceOracle",
									"name": "_oracle",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "_closeFactorMantissa",
									"type": "uint256"
							},
							{
									"internalType": "uint256",
									"name": "_maxAssets",
									"type": "uint256"
							},
							{
									"internalType": "bool",
									"name": "reinitializing",
									"type": "bool"
							}
					],
					"name": "_become",
					"outputs": [],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x32000e00"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "uint256",
									"name": "newCloseFactorMantissa",
									"type": "uint256"
							}
					],
					"name": "_setCloseFactor",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x317b0b77"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "contract CToken",
									"name": "cToken",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "newCollateralFactorMantissa",
									"type": "uint256"
							}
					],
					"name": "_setCollateralFactor",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xe4028eee"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "uint256",
									"name": "newLiquidationIncentiveMantissa",
									"type": "uint256"
							}
					],
					"name": "_setLiquidationIncentive",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x4fd42e17"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "uint256",
									"name": "newMaxAssets",
									"type": "uint256"
							}
					],
					"name": "_setMaxAssets",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xd9226ced"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "contract PriceOracle",
									"name": "newOracle",
									"type": "address"
							}
					],
					"name": "_setPriceOracle",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x55ee1fe1"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "contract CToken",
									"name": "cToken",
									"type": "address"
							}
					],
					"name": "_supportMarket",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xa76b3fda"
			},
			{
					"constant": true,
					"inputs": [
							{
									"internalType": "address",
									"name": "",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"name": "accountAssets",
					"outputs": [
							{
									"internalType": "contract CToken",
									"name": "",
									"type": "address"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xdce15449"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "admin",
					"outputs": [
							{
									"internalType": "address",
									"name": "",
									"type": "address"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xf851a440"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "cToken",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "borrower",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "borrowAmount",
									"type": "uint256"
							}
					],
					"name": "borrowAllowed",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xda3d454c"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "cToken",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "borrower",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "borrowAmount",
									"type": "uint256"
							}
					],
					"name": "borrowVerify",
					"outputs": [],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x5c778605"
			},
			{
					"constant": true,
					"inputs": [
							{
									"internalType": "address",
									"name": "account",
									"type": "address"
							},
							{
									"internalType": "contract CToken",
									"name": "cToken",
									"type": "address"
							}
					],
					"name": "checkMembership",
					"outputs": [
							{
									"internalType": "bool",
									"name": "",
									"type": "bool"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x929fe9a1"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "closeFactorMantissa",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xe8755446"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "comptrollerImplementation",
					"outputs": [
							{
									"internalType": "address",
									"name": "",
									"type": "address"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xbb82aa5e"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address[]",
									"name": "cTokens",
									"type": "address[]"
							}
					],
					"name": "enterMarkets",
					"outputs": [
							{
									"internalType": "uint256[]",
									"name": "",
									"type": "uint256[]"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xc2998238"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "cTokenAddress",
									"type": "address"
							}
					],
					"name": "exitMarket",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xede4edd0"
			},
			{
					"constant": true,
					"inputs": [
							{
									"internalType": "address",
									"name": "account",
									"type": "address"
							}
					],
					"name": "getAccountLiquidity",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							},
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							},
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x5ec88c79"
			},
			{
					"constant": true,
					"inputs": [
							{
									"internalType": "address",
									"name": "account",
									"type": "address"
							}
					],
					"name": "getAssetsIn",
					"outputs": [
							{
									"internalType": "contract CToken[]",
									"name": "",
									"type": "address[]"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xabfceffc"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "isComptroller",
					"outputs": [
							{
									"internalType": "bool",
									"name": "",
									"type": "bool"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x007e3dd2"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "cTokenBorrowed",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "cTokenCollateral",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "liquidator",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "borrower",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "repayAmount",
									"type": "uint256"
							}
					],
					"name": "liquidateBorrowAllowed",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x5fc7e71e"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "cTokenBorrowed",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "cTokenCollateral",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "liquidator",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "borrower",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "repayAmount",
									"type": "uint256"
							},
							{
									"internalType": "uint256",
									"name": "seizeTokens",
									"type": "uint256"
							}
					],
					"name": "liquidateBorrowVerify",
					"outputs": [],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x47ef3b3b"
			},
			{
					"constant": true,
					"inputs": [
							{
									"internalType": "address",
									"name": "cTokenBorrowed",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "cTokenCollateral",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "repayAmount",
									"type": "uint256"
							}
					],
					"name": "liquidateCalculateSeizeTokens",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							},
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xc488847b"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "liquidationIncentiveMantissa",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x4ada90af"
			},
			{
					"constant": true,
					"inputs": [
							{
									"internalType": "address",
									"name": "",
									"type": "address"
							}
					],
					"name": "markets",
					"outputs": [
							{
									"internalType": "bool",
									"name": "isListed",
									"type": "bool"
							},
							{
									"internalType": "uint256",
									"name": "collateralFactorMantissa",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x8e8f294b"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "maxAssets",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x94b2294b"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "cToken",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "minter",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "mintAmount",
									"type": "uint256"
							}
					],
					"name": "mintAllowed",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x4ef4c3e1"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "cToken",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "minter",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "mintAmount",
									"type": "uint256"
							},
							{
									"internalType": "uint256",
									"name": "mintTokens",
									"type": "uint256"
							}
					],
					"name": "mintVerify",
					"outputs": [],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x41c728b9"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "oracle",
					"outputs": [
							{
									"internalType": "contract PriceOracle",
									"name": "",
									"type": "address"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x7dc0d1d0"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "pendingAdmin",
					"outputs": [
							{
									"internalType": "address",
									"name": "",
									"type": "address"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x26782247"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "pendingComptrollerImplementation",
					"outputs": [
							{
									"internalType": "address",
									"name": "",
									"type": "address"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xdcfbc0c7"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "cToken",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "redeemer",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "redeemTokens",
									"type": "uint256"
							}
					],
					"name": "redeemAllowed",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xeabe7d91"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "cToken",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "redeemer",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "redeemAmount",
									"type": "uint256"
							},
							{
									"internalType": "uint256",
									"name": "redeemTokens",
									"type": "uint256"
							}
					],
					"name": "redeemVerify",
					"outputs": [],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x51dff989"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "cToken",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "payer",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "borrower",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "repayAmount",
									"type": "uint256"
							}
					],
					"name": "repayBorrowAllowed",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x24008a62"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "cToken",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "payer",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "borrower",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "repayAmount",
									"type": "uint256"
							},
							{
									"internalType": "uint256",
									"name": "borrowerIndex",
									"type": "uint256"
							}
					],
					"name": "repayBorrowVerify",
					"outputs": [],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x1ededc91"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "cTokenCollateral",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "cTokenBorrowed",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "liquidator",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "borrower",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "seizeTokens",
									"type": "uint256"
							}
					],
					"name": "seizeAllowed",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xd02f7351"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "cTokenCollateral",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "cTokenBorrowed",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "liquidator",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "borrower",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "seizeTokens",
									"type": "uint256"
							}
					],
					"name": "seizeVerify",
					"outputs": [],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x6d35bf91"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "cToken",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "src",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "dst",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "transferTokens",
									"type": "uint256"
							}
					],
					"name": "transferAllowed",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xbdcdc258"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "cToken",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "src",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "dst",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "transferTokens",
									"type": "uint256"
							}
					],
					"name": "transferVerify",
					"outputs": [],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x6a56947e"
			},
			{
					"inputs": [],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "constructor",
					"signature": "constructor"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "string",
									"name": "action",
									"type": "string"
							},
							{
									"indexed": false,
									"internalType": "bool",
									"name": "pauseState",
									"type": "bool"
							}
					],
					"name": "ActionPaused",
					"type": "event",
					"signature": "0xef159d9a32b2472e32b098f954f3ce62d232939f1c207070b584df1814de2de0"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "error",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "info",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "detail",
									"type": "uint256"
							}
					],
					"name": "Failure",
					"type": "event",
					"signature": "0x45b96fe442630264581b197e84bbada861235052c5a1aadfff9ea4e40a969aa0"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "contract CToken",
									"name": "cToken",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "address",
									"name": "account",
									"type": "address"
							}
					],
					"name": "MarketEntered",
					"type": "event",
					"signature": "0x3ab23ab0d51cccc0c3085aec51f99228625aa1a922b3a8ca89a26b0f2027a1a5"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "contract CToken",
									"name": "cToken",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "address",
									"name": "account",
									"type": "address"
							}
					],
					"name": "MarketExited",
					"type": "event",
					"signature": "0xe699a64c18b07ac5b7301aa273f36a2287239eb9501d81950672794afba29a0d"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "contract CToken",
									"name": "cToken",
									"type": "address"
							}
					],
					"name": "MarketListed",
					"type": "event",
					"signature": "0xcf583bb0c569eb967f806b11601c4cb93c10310485c67add5f8362c2f212321f"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "oldCloseFactorMantissa",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "newCloseFactorMantissa",
									"type": "uint256"
							}
					],
					"name": "NewCloseFactor",
					"type": "event",
					"signature": "0x3b9670cf975d26958e754b57098eaa2ac914d8d2a31b83257997b9f346110fd9"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "contract CToken",
									"name": "cToken",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "oldCollateralFactorMantissa",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "newCollateralFactorMantissa",
									"type": "uint256"
							}
					],
					"name": "NewCollateralFactor",
					"type": "event",
					"signature": "0x70483e6592cd5182d45ac970e05bc62cdcc90e9d8ef2c2dbe686cf383bcd7fc5"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "oldLiquidationIncentiveMantissa",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "newLiquidationIncentiveMantissa",
									"type": "uint256"
							}
					],
					"name": "NewLiquidationIncentive",
					"type": "event",
					"signature": "0xaeba5a6c40a8ac138134bff1aaa65debf25971188a58804bad717f82f0ec1316"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "oldMaxAssets",
									"type": "uint256"
							},
							{
									"indexed": false,
									"internalType": "uint256",
									"name": "newMaxAssets",
									"type": "uint256"
							}
					],
					"name": "NewMaxAssets",
					"type": "event",
					"signature": "0x7093cf1eb653f749c3ff531d6df7f92764536a7fa0d13530cd26e070780c32ea"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "address",
									"name": "oldPauseGuardian",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "address",
									"name": "newPauseGuardian",
									"type": "address"
							}
					],
					"name": "NewPauseGuardian",
					"type": "event",
					"signature": "0x0613b6ee6a04f0d09f390e4d9318894b9f6ac7fd83897cd8d18896ba579c401e"
			},
			{
					"anonymous": false,
					"inputs": [
							{
									"indexed": false,
									"internalType": "contract PriceOracle",
									"name": "oldPriceOracle",
									"type": "address"
							},
							{
									"indexed": false,
									"internalType": "contract PriceOracle",
									"name": "newPriceOracle",
									"type": "address"
							}
					],
					"name": "NewPriceOracle",
					"type": "event",
					"signature": "0xd52b2b9b7e9ee655fcb95d2e5b9e0c9f69e7ef2b8e9d2d0ea78402d576d22e22"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "contract Unitroller",
									"name": "unitroller",
									"type": "address"
							}
					],
					"name": "_become",
					"outputs": [],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x1d504dc6"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "bool",
									"name": "state",
									"type": "bool"
							}
					],
					"name": "_setBorrowPaused",
					"outputs": [
							{
									"internalType": "bool",
									"name": "",
									"type": "bool"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x56133fc8"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "uint256",
									"name": "newCloseFactorMantissa",
									"type": "uint256"
							}
					],
					"name": "_setCloseFactor",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x317b0b77"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "contract CToken",
									"name": "cToken",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "newCollateralFactorMantissa",
									"type": "uint256"
							}
					],
					"name": "_setCollateralFactor",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xe4028eee"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "uint256",
									"name": "newLiquidationIncentiveMantissa",
									"type": "uint256"
							}
					],
					"name": "_setLiquidationIncentive",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x4fd42e17"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "uint256",
									"name": "newMaxAssets",
									"type": "uint256"
							}
					],
					"name": "_setMaxAssets",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xd9226ced"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "bool",
									"name": "state",
									"type": "bool"
							}
					],
					"name": "_setMintPaused",
					"outputs": [
							{
									"internalType": "bool",
									"name": "",
									"type": "bool"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x9845f280"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "newPauseGuardian",
									"type": "address"
							}
					],
					"name": "_setPauseGuardian",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x5f5af1aa"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "contract PriceOracle",
									"name": "newOracle",
									"type": "address"
							}
					],
					"name": "_setPriceOracle",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x55ee1fe1"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "bool",
									"name": "state",
									"type": "bool"
							}
					],
					"name": "_setSeizePaused",
					"outputs": [
							{
									"internalType": "bool",
									"name": "",
									"type": "bool"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x2d70db78"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "bool",
									"name": "state",
									"type": "bool"
							}
					],
					"name": "_setTransferPaused",
					"outputs": [
							{
									"internalType": "bool",
									"name": "",
									"type": "bool"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x8ebf6364"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "contract CToken",
									"name": "cToken",
									"type": "address"
							}
					],
					"name": "_supportMarket",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xa76b3fda"
			},
			{
					"constant": true,
					"inputs": [
							{
									"internalType": "address",
									"name": "",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"name": "accountAssets",
					"outputs": [
							{
									"internalType": "contract CToken",
									"name": "",
									"type": "address"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xdce15449"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "admin",
					"outputs": [
							{
									"internalType": "address",
									"name": "",
									"type": "address"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xf851a440"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "cToken",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "borrower",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "borrowAmount",
									"type": "uint256"
							}
					],
					"name": "borrowAllowed",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xda3d454c"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "borrowGuardianPaused",
					"outputs": [
							{
									"internalType": "bool",
									"name": "",
									"type": "bool"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x9530f644"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "cToken",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "borrower",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "borrowAmount",
									"type": "uint256"
							}
					],
					"name": "borrowVerify",
					"outputs": [],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x5c778605"
			},
			{
					"constant": true,
					"inputs": [
							{
									"internalType": "address",
									"name": "account",
									"type": "address"
							},
							{
									"internalType": "contract CToken",
									"name": "cToken",
									"type": "address"
							}
					],
					"name": "checkMembership",
					"outputs": [
							{
									"internalType": "bool",
									"name": "",
									"type": "bool"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x929fe9a1"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "closeFactorMantissa",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xe8755446"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "comptrollerImplementation",
					"outputs": [
							{
									"internalType": "address",
									"name": "",
									"type": "address"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xbb82aa5e"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address[]",
									"name": "cTokens",
									"type": "address[]"
							}
					],
					"name": "enterMarkets",
					"outputs": [
							{
									"internalType": "uint256[]",
									"name": "",
									"type": "uint256[]"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xc2998238"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "cTokenAddress",
									"type": "address"
							}
					],
					"name": "exitMarket",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xede4edd0"
			},
			{
					"constant": true,
					"inputs": [
							{
									"internalType": "address",
									"name": "account",
									"type": "address"
							}
					],
					"name": "getAccountLiquidity",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							},
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							},
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x5ec88c79"
			},
			{
					"constant": true,
					"inputs": [
							{
									"internalType": "address",
									"name": "account",
									"type": "address"
							}
					],
					"name": "getAssetsIn",
					"outputs": [
							{
									"internalType": "contract CToken[]",
									"name": "",
									"type": "address[]"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xabfceffc"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "isComptroller",
					"outputs": [
							{
									"internalType": "bool",
									"name": "",
									"type": "bool"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x007e3dd2"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "cTokenBorrowed",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "cTokenCollateral",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "liquidator",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "borrower",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "repayAmount",
									"type": "uint256"
							}
					],
					"name": "liquidateBorrowAllowed",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x5fc7e71e"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "cTokenBorrowed",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "cTokenCollateral",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "liquidator",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "borrower",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "actualRepayAmount",
									"type": "uint256"
							},
							{
									"internalType": "uint256",
									"name": "seizeTokens",
									"type": "uint256"
							}
					],
					"name": "liquidateBorrowVerify",
					"outputs": [],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x47ef3b3b"
			},
			{
					"constant": true,
					"inputs": [
							{
									"internalType": "address",
									"name": "cTokenBorrowed",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "cTokenCollateral",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "actualRepayAmount",
									"type": "uint256"
							}
					],
					"name": "liquidateCalculateSeizeTokens",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							},
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xc488847b"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "liquidationIncentiveMantissa",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x4ada90af"
			},
			{
					"constant": true,
					"inputs": [
							{
									"internalType": "address",
									"name": "",
									"type": "address"
							}
					],
					"name": "markets",
					"outputs": [
							{
									"internalType": "bool",
									"name": "isListed",
									"type": "bool"
							},
							{
									"internalType": "uint256",
									"name": "collateralFactorMantissa",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x8e8f294b"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "maxAssets",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x94b2294b"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "cToken",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "minter",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "mintAmount",
									"type": "uint256"
							}
					],
					"name": "mintAllowed",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x4ef4c3e1"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "mintGuardianPaused",
					"outputs": [
							{
									"internalType": "bool",
									"name": "",
									"type": "bool"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x5dce0515"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "cToken",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "minter",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "actualMintAmount",
									"type": "uint256"
							},
							{
									"internalType": "uint256",
									"name": "mintTokens",
									"type": "uint256"
							}
					],
					"name": "mintVerify",
					"outputs": [],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x41c728b9"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "oracle",
					"outputs": [
							{
									"internalType": "contract PriceOracle",
									"name": "",
									"type": "address"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x7dc0d1d0"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "pauseGuardian",
					"outputs": [
							{
									"internalType": "address",
									"name": "",
									"type": "address"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x24a3d622"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "pendingAdmin",
					"outputs": [
							{
									"internalType": "address",
									"name": "",
									"type": "address"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x26782247"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "pendingComptrollerImplementation",
					"outputs": [
							{
									"internalType": "address",
									"name": "",
									"type": "address"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xdcfbc0c7"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "cToken",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "redeemer",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "redeemTokens",
									"type": "uint256"
							}
					],
					"name": "redeemAllowed",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xeabe7d91"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "cToken",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "redeemer",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "redeemAmount",
									"type": "uint256"
							},
							{
									"internalType": "uint256",
									"name": "redeemTokens",
									"type": "uint256"
							}
					],
					"name": "redeemVerify",
					"outputs": [],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x51dff989"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "cToken",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "payer",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "borrower",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "repayAmount",
									"type": "uint256"
							}
					],
					"name": "repayBorrowAllowed",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x24008a62"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "cToken",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "payer",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "borrower",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "actualRepayAmount",
									"type": "uint256"
							},
							{
									"internalType": "uint256",
									"name": "borrowerIndex",
									"type": "uint256"
							}
					],
					"name": "repayBorrowVerify",
					"outputs": [],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x1ededc91"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "cTokenCollateral",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "cTokenBorrowed",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "liquidator",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "borrower",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "seizeTokens",
									"type": "uint256"
							}
					],
					"name": "seizeAllowed",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xd02f7351"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "seizeGuardianPaused",
					"outputs": [
							{
									"internalType": "bool",
									"name": "",
									"type": "bool"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0xac0b0bb7"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "cTokenCollateral",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "cTokenBorrowed",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "liquidator",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "borrower",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "seizeTokens",
									"type": "uint256"
							}
					],
					"name": "seizeVerify",
					"outputs": [],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x6d35bf91"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "cToken",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "src",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "dst",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "transferTokens",
									"type": "uint256"
							}
					],
					"name": "transferAllowed",
					"outputs": [
							{
									"internalType": "uint256",
									"name": "",
									"type": "uint256"
							}
					],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0xbdcdc258"
			},
			{
					"constant": true,
					"inputs": [],
					"name": "transferGuardianPaused",
					"outputs": [
							{
									"internalType": "bool",
									"name": "",
									"type": "bool"
							}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function",
					"signature": "0x87f76303"
			},
			{
					"constant": false,
					"inputs": [
							{
									"internalType": "address",
									"name": "cToken",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "src",
									"type": "address"
							},
							{
									"internalType": "address",
									"name": "dst",
									"type": "address"
							},
							{
									"internalType": "uint256",
									"name": "transferTokens",
									"type": "uint256"
							}
					],
					"name": "transferVerify",
					"outputs": [],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function",
					"signature": "0x6a56947e"
			}
		];
		TrollContract = new web3.eth.Contract(trollAbi, trollAddress);

		gasLimit = 1000000;
		
    return App.bindEvents();
  },
  
  // Binds button clicks to the repective functions
  bindEvents: function() { 
		$('#calcCollatBtn').click(App.ExeCalcCollat);
		$('#approveLoanBtn').click(App.ExeApproveLoan);
		$("#getLiquidityBtn").click(App.CallGetLiquidity);
		$("#debugBorrowBtn").click(App.CallBorrowDai);
  },

  // Defines functionality for OUTPUT label
  showMessage: function (msg){
    document.getElementById('output').value = msg;
    $('#output').show();
    $('#errorHolder').hide();
  },
  
  // Defines functionality for ERROR label
  showError: function(err){
    document.getElementById('errorHolder').value = err;
    $('#errorHolder').show();
    $('#output').hide();
  },

/*
======================================================================================================
CALCULATING COLLATERAL

This calculates the minimum collateral amount required to comply with the CF protocol
and displays it in the field minCollatAmt uneditable field
======================================================================================================
*/

	ExeCalcCollat: function (){
		console.log("In app.js CalcCollat");

		// Calculating borrow amount : Dai => ETH
		var borrowAmtDai = $("#borrowAmt").val();
		var borrowAmtEth = borrowAmtDai * DAI_TO_ETH / COLLAT_FACTOR;
		var minCollatEth = COLLAT_RATIO * borrowAmtEth;
		$("#minCollatAmt").val("" + minCollatEth);

		window.alert("The minimum collateral required to comply with the protocol will be mentioned below. You can copy the same into the field below or enter a higher amount of ETH that you wish to use as collateral.");
	},

/*
======================================================================================================
EXECUTE BORROWING PROCESS

This performs 3 operations to approve the loan :
1. Mints cEth for the ETH supplied as collateral
2. Enters markets for cEth and cDai tokens
3. Deposits the Dai from CF smart contract into the user's MetaMask wallet
======================================================================================================
*/
	
	ExeApproveLoan: function (){
		console.log("In app.js ApproveLoan");
		var finalCollatEth = Number($("#finalCollatAmt").val());

		if(finalCollatEth < $("#minCollatAmt").val()){
			console.log("Insufficient collateral amount");
			return;
		}
		
		web3.eth.getAccounts().then(async function(accountList){
			userAccount = accountList[0];
			// Verify that userAccount != null
			if(userAccount){
				var balance = await web3.eth.getBalance(userAccount);
				var gasPrice = await web3.eth.getGasPrice();

				// Proceed only if user has sufficient ETH account balance
				if(balance >= finalCollatEth + (gasPrice * gasLimit * 3 / 10**18))
				{
					console.log('MetaMask account ' + userAccount + ' has required balance', balance);
					window.confirm("Are you sure you want to proceed to borrow " + $("#minCollatAmt").val() + " Dai and deposit " + finalCollatEth + " as collateral?", function(res){
						if(res == true){
							App.ExeBorrowAmount(userAccount, finalCollatEth);
						}
						else{
							window.alert("The process was cancelled.");
						}
					});
				}
				else{
					console.log("MetaMask account " + userAccount + " has insufficient balance", balance);
				}
				console.log("Required ETH balance : ", finalCollatEth + (gasPrice * gasLimit * 3 / 10**18));
			}
			else{
				console.log("Metamask is not connected");
			}		
		});
	},

	ExeBorrowAmount: async function(userAccount, finalCollatAmt){
		console.log("In ExeBorrowAmount");
		
		window.alert("You will need to confirm 3 transactions in succession from you MetaMask wallet to successfully borrow the Dai via the Compound Finance protocol.");

		// Mints cEth from the ETH sent as collateral
		CEthContract.methods.mint().send({from: userAccount, value: finalCollatAmt * 10**18, gas: gasLimit})
		.then(function(confirmedTxn){
			if(confirmedTxn){
				console.log("SUCCESS 1: minting txn", confirmedTxn);
				
				// What does "entering market" mean?
				TrollContract.methods.enterMarkets([cEthAddress, cDaiAddress]).send({from: userAccount, gas: gasLimit})
				.then(async function(confirmedTxn){
					if(confirmedTxn){
						console.log("SUCCESS 2: entering markets txn", confirmedTxn);

						// Account liquidity before borrowing
						var initLiq = await TrollContract.methods.getAccountLiquidity(userAccount).call();
						console.log("Initial liquidity = ", initLiq[1]);

						// Withdraws borrow amount from CF pool
						var borrowAmtDai = Number($("#borrowAmt").val());
						CDaiContract.methods.borrow((borrowAmtDai * 10**18).toString()).send({from: userAccount , gas: gasLimit})
						.then(async function(confirmedTxn){
							if(confirmedTxn){
								console.log("SUCCESS 3: borrowing txn", confirmedTxn);

								// Account liquidity after borrowing
								var finalLiq = await TrollContract.methods.getAccountLiquidity(userAccount).call();
								console.log("Final liquidity = ", finalLiq[1]);
							}
							else{
								console.log("REJECTED 3: borrowing txn");
							}
						}).catch(function (err){
							console.log("ERROR 3: borrowing txn", err);
							return;
						});
					}
					else{
						console.log("REJECTED 2: entering markets txn");
					}
				}).catch(function (err){
					console.log("ERROR 2: entering markets txn", err);
					return;
				});
			}
			else{
				console.log("REJECTED 1: minting txn");
			}
		}).catch(function (err){
			console.log("ERROR 1: minting txn", err);
			return;
		});
		console.log("process ends");
	},

/*
======================================================================================================
GET ACCOUNT LIQUIDITY

Retrives the liquid capacity of a user account. Its value depends on the collateral supplied and
the stability of the tokens being used.
======================================================================================================
*/

	CallGetLiquidity: function(){
		web3.eth.getAccounts().then(async function(accountList){
			userAccount = accountList[0];
			
			// Verify that userAccount != null
			if(userAccount){
				var result = await TrollContract.methods.getAccountLiquidity(userAccount).call();
				// Format of result = {0: error, 1: liquidity, 2: shortfall}
				console.log(result[1]);
			}
		});
	},

/*
======================================================================================================
GET BORROW DAI

Used to debug part-3 of the CF borrow mechanism
======================================================================================================
*/

	CallBorrowDai: async function(){
		console.log("In CallBorrowDai");
		web3.eth.getAccounts().then(async function(accountList){
			userAccount = accountList[0];

			if(userAccount){
				// Account liquidity before borrowing
				var initLiq = await TrollContract.methods.getAccountLiquidity(userAccount).call();
				console.log("Initial liquidity = ", initLiq[1]);

				// Withdraws borrow amount from CF pool
				var borrowAmtDai = Number($("#borrowAmt").val());
				// (borrowAmtDai * 10**18).toString()
				CDaiContract.methods.borrow((borrowAmtDai * 10**18).toString()).send({from: userAccount, gas: 1000000})
				.then(async function(confirmedTxn){
					if(confirmedTxn){
						console.log("SUCCESS db3: borrowing txn", confirmedTxn);

						// Account liquidity after borrowing
						var finalLiq = await TrollContract.methods.getAccountLiquidity(userAccount).call();
						console.log("Final liquidity = ", finalLiq[1]);
						console.log("diff liquidity = ", finalLiq[1] - initLiq[1]);

						CDaiContract.methods.borrowBalanceCurrent(userAccount).call().then(function(result){
							console.log("SUCCESS db4: borrowing balance", Number(result) / 10**18);
						}).catch(function (err){
							console.log("ERROR db4: borrowing balance", err);
							return;
						});
					}
					else{
						console.log("REJECTED db3: borrowing txn");
					}
				}).catch(function (err){
					console.log("ERROR db3: borrowing txn", err);
					return;
				});
			}
		});
	},


/*======================================================================================================
  INITIALISATION : Intialises web3 when webpage is loaded onto browser
======================================================================================================*/

	init : async function (){
		await App.initWeb3();
		console.log("In app.js init, initiated App");
	}
 
}  
 
$(function() {
  $(window).load(function(){
		// Set value of collateral factor
		// Ideally, take these values using the CF comptroller API
		$('#minCollatRatio').val(COLLAT_RATIO * 100 + ' %');
		$('#collatFactor').val('' + COLLAT_FACTOR);

		// Check if MetaMask (= web3) is installed
		if (typeof web3 !== 'undefined' && window.ethereum.isMetaMask == true){
			// Initialise app functions only if the user permits website
			window.ethereum.enable().then(function(){
				App.init();
			});
		}
		else{
			// MetaMask is not installed
			window.alert('This dapp needs MetaMask to function. Please install it from here https://metamask.io/')
		}
  });
});
