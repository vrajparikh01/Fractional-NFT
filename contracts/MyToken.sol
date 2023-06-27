// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract MyToken is ERC20, ERC20Burnable, Ownable, ERC20Permit, ERC721Holder {
    IERC721 public nftAddress;  // NFT address that we'll fractionalize
    uint256 public tokenId;
    bool public initialized = false;
    bool public forSale = false;
    uint256 public salePrice;
    bool public canRedeem = false;

    constructor() ERC20("MyToken", "MTK") ERC20Permit("MyToken") {}

    // user sends nft to this contract and get erc20 in return
    // before calling this function, owner need to approve this contract to operate nft
    function initialize(address _nftAddress, uint256 _tokenId, uint256 _amount) external onlyOwner() {
        require(!initialized, "Already initialized");
        require(_amount > 0, "Amount must be greater than 0");
        nftAddress = IERC721(_nftAddress);
        nftAddress.safeTransferFrom(msg.sender, address(this), _tokenId);
        tokenId = _tokenId;
        initialized = true;
        _mint(msg.sender, _amount);
    }

    function putForSale(uint256 price) external onlyOwner(){
        salePrice = price;
        forSale = true;
    }

    // anyone can buy the nft for the salePrice
    function buyNft() external payable {
        require(forSale, "Not for sale");
        require(msg.value == salePrice, "Not enough ether to but NFT");
        nftAddress.safeTransferFrom(address(this), msg.sender, tokenId);
        forSale = false;
        canRedeem = true;
    }

    // once nft is sold, user can redeem their erc20 for ether
    function redeem(uint256 _amount) external {
        require(canRedeem, "Not ready to redeem");
        uint256 totalBalance = address(this).balance;
        uint256 toRedeem = totalBalance * _amount / totalSupply();
        _burn(msg.sender, _amount);
        payable(msg.sender).transfer(toRedeem);
    }
}