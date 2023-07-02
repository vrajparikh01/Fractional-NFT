# Basic Information 
This is a simple Fractional NFT project

Fractional NFTs involve multiple individuals to own a portion of NFT and that NFT's value will be divided into smaller, tradable fractions. (eg: company's share is an example of fractionalization.)

There are many approaches to implement fractional NFTs like smart contracts, tokenization, DAO Governance and fractional nft marketplaces. Here in this project, I have used tokenization approach. 

Approach: Make an NFT, transfer it to a smart contract and that smart contract will in turn give us ERC20 tokens which represent the ownership of that NFT smart contract. And once we sell the nft, those tokens will be redeemable for the money recieved by selling the underlying nft. (We can trasfer the ownership of this contract to the multisig wallet for buying and selling decisions)

## Quick start
Clone the repository and install all the packages

``` git clone https://github.com/vrajparikh01/Fractional-NFT ```

``` npm install ```

## Deployment
To deploy all the contracts , run the following command

``` npx hardhat run scripts/deploy.js ```

## Tests
To test the conttracts and see if the user is eligible for airdrop or not

``` npx hardhat test test/test.js ```

