# SimpleToken (non ERC20) Smart Contract written using Solidity and tested with Hardhat

## Installing dependencies
```
npm i
```

## Compiling the Smart Contract Hardhat
```
npx hardhat compile
```

## Linting Solidity code
```
npx hardhat check
```

## Running mocha tests with Hardhat
```
npx hardhat test
```

## Deploying the contract on Ethereum testnet (Sepolia)
```
npx hardhat ignition deploy ./ignition/modules/SimpleToken.js --network sepolia
```
