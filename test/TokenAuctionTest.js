
//import CardToken from "CardToken";
//import TokenAuction from "TokenAuction";

import 'babel-polyfill'; //need this bcz the first function is an async https://github.com/babel/babel/issues/5085

const CardToken = artifacts.require("CardToken"); //this artifact.require is truffle specific
const TokenAuction = artifacts.require("TokenAuction"); //this artifact.require is truffle specific

contract("Token Auction", accounts => {
    let owner = accounts[0];
    let buyer = accounts[1];
    console.log("owner - " + owner);
    console.log("buyer - " + buyer);
    
    it("Should accept nft on creation", async () => {
        let nft = await CardToken.new("CardToken", "CT");
        let auction = await TokenAuction.new(nft.address);
        const nftAddr = await auction.nonFungibleContract();
        //console.log(nft.address);
        assert.equal(nftAddr, nft.address);

    });
    
    it("Should transfer ownership", async () => {

        let nft = await CardToken.deployed();
        token = await nft.getCard(1);
        console.log("token at 0 - BEFORE");
        console.log(token);

        await nft.approve(buyer, 1);
        await nft.transferFrom(owner, buyer, 1);
        token = await nft.getCard(1);
        console.log("token at 0 - AFTER");
        console.log(token);

        await nft.approve(owner, 1);
        await nft.transferFrom(buyer, owner, 1);
        token = await nft.getCard(1);
        console.log("token at 0 - RETURN");
        console.log(token);



        /*
        let nft = await CardToken.new("CardToken", "Card");
        let auction = await TokenAuction.new(nft.address);
        //const nftAddr = await auction.nonFungibleContract();
        await nft.mint(1, "Bashir", "Bashir", 100);
        token = await nft.tokenOfOwnerByIndex(owner, 0);
        console.log("token at 0 - BEFORE");
        console.log(token);
        
        //await nft.approve(buyer, token);
        //await nft.transferFrom(owner, buyer, token);

        //token = await nft.tokenOfOwnerByIndex(owner, 0);
        //console.log("token at 0 - AFTER");
        //console.log(token);
        */
    });
    /*
    describe("createAuction", () => {
        let nft, auctionContract, token;

        before(async () => {
            //let instance = await CardToken.deployed();
            //let auctionContract = await TokenAuction.deployed();
            //let owner = await instance.owner();      
            nft = await CardToken.new("CardToken", "Card");
            auctionContract = await TokenAuction.new(nft.address);
            console.log(auctionContract.address);
                        
            //await nft.mint("10", "Bashir", 100);
            
            token = await nft.tokenOfOwnerByIndex(owner, 0);
            console.log("token at 0" + token);
               
            //await nft.approve(auctionContract.address, token);
            //await nft.transferFrom(owner, auctionContract.address, token);
            //await auctionContract.createAuction(token, 100);
            //let newowner = await nft.ownerOf(token);
            //console.log(owner);
            //console.log(newowner);
        });
        /*
        it("Should take ownership of a token", async () => {
            const tokenOwner = await nft.ownerOf(token);
            assert.equal(tokenOwner, auctionContract.address);
        });

        it("Should create new auction", async () => {
            const auction = await auctionContract.tokenIdToAuction(token);
            console.log(auction);
            assert.equal(auction[0], accounts[0]);
            assert.equal(auction[1], auctionContract.address);
            assert.equal(auction[2].toNumber(), 100);
        });
    }); */
    

});

