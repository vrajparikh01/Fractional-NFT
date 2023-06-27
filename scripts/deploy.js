const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const MyNft = await hre.ethers.getContractFactory("MyNft");
  let myNft = await MyNft.deploy();
  await myNft.deployed();
  console.log("MyNft deployed to:", myNft.address);

  const MyToken = await hre.ethers.getContractFactory("MyToken");
  let mytoken = await MyToken.deploy();
  await mytoken.deployed();
  console.log("MyToken deployed to:", mytoken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
