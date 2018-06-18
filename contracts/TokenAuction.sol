pragma solidity ^0.4.21;

import "zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract TokenAuction {

    ERC721 public nonFungibleContract;
    address _escrow = 0x8f0483125fcb9aaaefa9209d8e9d7b9c8b9fb90f;

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
    
    /// @dev Returns true if the claimant owns the token.
    /// @param _claimant - Address claiming to own the token.
    /// @param _tokenId - ID of token whose ownership to verify.
    function _owns(address _claimant, uint256 _tokenId) internal view returns (bool) {
        return (nonFungibleContract.ownerOf(_tokenId) == _claimant);
    }

    function createAuction( uint256 _tokenId, uint128 _price ) internal {
        //nonFungibleContract.takeOwnership(_tokenId); //this does not work anymore
        Auction memory _auction = Auction({
            owner: msg.sender, //[this] is the address of the current contract. [TEMP: replacing this with msg.sender]
            seller: msg.sender, //msg.sender is the caller
            price: uint128(_price),
            sold: false
        });
        tokenIdToAuction[_tokenId] = _auction;
    }
    function escrow(address _from, uint256 _tokenId) internal {
        address _contract = address(this);
        //nonFungibleContract.approve(_contract, _tokenId); //cannot call approve like this bcz approves expect msg.sender to be the NFT owner. However calling second contract like this makes msg.sender this contract address
        nonFungibleContract.transferFrom(_from, _contract, _tokenId);
    }

    function sell( uint256 _tokenId, uint128 _price ) public {
        require(_owns(msg.sender, _tokenId));        
        //escrow(msg.sender, _tokenId);

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
        //auction.owner = msg.sender; //TEMP
        //auction.seller = msg.sender; //TEMP
        //auction.sold = true;
        //tokenIdToAuction[_tokenId] = auction; //TEMP        
        //nonFungibleContract.approve(msg.sender, _tokenId);
        nonFungibleContract.transferFrom(seller, msg.sender, _tokenId); //we only approved this contract address and did not transfer ownership. so using seller instead of address(this)
        //nonFungibleContract.transfer(msg.sender, _tokenId); //transfer from the contract address to the buyer.
        delete tokenIdToAuction[_tokenId];
    }

    function changePrice(uint256 _tokenId, uint128 price) public payable{
        require(_owns(msg.sender, _tokenId));
        Auction memory auction = tokenIdToAuction[_tokenId];
        auction.price = price;
        tokenIdToAuction[_tokenId] = auction;
    }

    function cancel( uint256 _tokenId ) public {
        
        Auction memory auction = tokenIdToAuction[_tokenId];
        require(auction.seller == msg.sender);

        delete tokenIdToAuction[_tokenId];

        nonFungibleContract.transferFrom(this, auction.seller, _tokenId);

    }




}