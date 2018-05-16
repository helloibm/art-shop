pragma solidity ^0.4.21;

import "zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract TokenAuction {

    ERC721 public nonFungibleContract;
    address escrow = 0x8f0483125fcb9aaaefa9209d8e9d7b9c8b9fb90f;

    struct Auction {
        address owner;
        address seller;
        uint128 price;        
        bool sold;
    }

    mapping (uint256 => Auction) public tokenIdToAuction;

    function TokenAuction(address _nftAddress) public {
        nonFungibleContract = ERC721(_nftAddress);
    }
    
    function createAuction( uint256 _tokenId, uint128 _price ) public {
        
        Auction memory _auction = Auction({
            owner: msg.sender, //[this] is the address of the current contract. [TEMP: replacing this with msg.sender]
            seller: msg.sender, //msg.sender is the caller
            price: uint128(_price),
            sold: false
        });
        tokenIdToAuction[_tokenId] = _auction;        
        //nonFungibleContract.approve(this, _tokenId);
        
    }

    function sell( uint256 _tokenId, uint128 _price ) public {
        createAuction(_tokenId, _price);
    }

    function bid( uint256 _tokenId ) public payable {
        
        Auction memory auction = tokenIdToAuction[_tokenId];
        //require(auction.seller != address(0));
        //require(auction.owner != address(0));
        //require(msg.value >= auction.price);

        address seller = auction.seller;
        //uint128 price = auction.price;

        //delete tokenIdToAuction[_tokenId];

        seller.transfer(msg.value);
        auction.owner = msg.sender; //TEMP
        auction.seller = msg.sender; //TEMP
        auction.sold = true;
        tokenIdToAuction[_tokenId] = auction; //TEMP        
        //nonFungibleContract.approve(msg.sender, _tokenId);
        //nonFungibleContract.transferFrom(seller, msg.sender, _tokenId);
        //delete tokenIdToAuction[_tokenId];
    }

    function cancel( uint256 _tokenId ) public {
        
        Auction memory auction = tokenIdToAuction[_tokenId];
        require(auction.seller == msg.sender);

        delete tokenIdToAuction[_tokenId];

        nonFungibleContract.transferFrom(auction.seller, auction.owner, _tokenId);

    }




}