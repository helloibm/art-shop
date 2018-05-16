const CardToken = artifacts.require("CardToken");
//import CardToken from "CardToken";

contract("Card Token", accounts => {
    /*
    it("Should make first account an owner", async () => {
        let instance = await CardToken.deployed();
        let owner = await instance.owner();
        assert.equal(owner, accounts[0]);
    });
    
    it("creates token with specified art attributes", async () => {
          let instance = await CardToken.deployed();
          let owner = await instance.owner();
      
          let count1 = await instance.totalSupply();
          let token1 = await instance.mint(1, "Irfan", "URL1", 10);
          let token2 = await instance.mint(2, "Imran", "URL2", 20);
          let token3 = await instance.mint(3, "Umer", "URL3", 30);
          
      
          let token = await instance.tokenOfOwnerByIndex(owner, count1+2);
          let art = await instance.getArt(token);
           
          assert.equal(art[1], "Umer");
          let count2 = await instance.totalSupply();
          console.log(count2);
          
          assert.equal(count2.valueOf(), 15, "Only 15 tokens were minted.")
    });
    
   
    it("allows to mint only to owner", async () => {
        let instance = await CardToken.deployed();
        let other = accounts[1];

        await instance.mint("4", "Hamza", "URL4", 40);
        let count = await instance.totalSupply();
        console.log(count);
        await instance.transferOwnership(other);
        
        //await assert(instance.mint("5", "Bilal", 50));
        //assert(instance.mint("#ff00hh", "#ddddff"));
        //await assertRevert(instance.mint());
    });
    */      
});