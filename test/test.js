const { expect } = require("chai");
const { ethers } = require("hardhat");

const toWei = (value) => ethers.utils.parseEther(value.toString());
const fromWei = (value) => ethers.utils.formatEther(value);

describe("Fractional NFT", async () => {
  let addr1, addr2, addr3, myNft, mytoken;

  before(async () => {
    [addr1, addr2, addr3] = await ethers.getSigners();

    const MyNft = await hre.ethers.getContractFactory("MyNft");
    myNft = await MyNft.deploy();
    await myNft.deployed();
    console.log("MyNft deployed to:", myNft.address);

    const MyToken = await hre.ethers.getContractFactory("MyToken");
    mytoken = await MyToken.deploy();
    await mytoken.deployed();
    console.log("MyToken deployed to:", mytoken.address);
  });

  it("Mint nft and approve erc20 token", async () => {
    myNft.safeMint(addr1.address, 1);

    const balance = await myNft.balanceOf(addr1.address);
    expect(balance).to.equal(1);

    const owner = await myNft.ownerOf(1);
    expect(owner).to.equal(addr1.address);

    myNft.setApprovalForAll(mytoken.address, true);
  });

  it("initialize erc20 token", async () => {
    mytoken.initialize(myNft.address, 1, toWei(1000));

    // check that now the owner of nft is erc20 contract address
    let owner = await myNft.ownerOf(1);
    expect(owner).to.equal(mytoken.address);
  });

  it("put nft for sale and users can buy it", async () => {
    mytoken.putForSale(toWei(100));
    expect(await mytoken.forSale()).to.equal(true);

    await mytoken.connect(addr2).buyNft({ value: toWei(100) });

    // test the owner of nft will be addr2
    // console.log("addr2", addr2.address);
    let owner = await myNft.ownerOf(1);
    expect(owner).to.equal(addr2.address);

    // test balance of addr2 will be reduced by 100
    let balance = await addr2.getBalance();
    console.log("Addr2 balance after buying NFT", fromWei(balance));
  });

  it("can redeem tokens", async () => {
    let balanceBefore = await mytoken.balanceOf(addr1.address);
    console.log("balance before redeem", fromWei(balanceBefore));

    await mytoken.connect(addr1).redeem(toWei(1000));

    // balance of mytoken will be 0
    let balanceAfter = await mytoken.balanceOf(addr1.address);
    console.log("balance before redeem", fromWei(balanceAfter));
    expect(balanceAfter).to.equal(0);

    // balance of addr1 will be increased by 1000
    let balance = await addr1.getBalance();
    console.log("Addr1 balance: ", fromWei(balance));
  });
});
