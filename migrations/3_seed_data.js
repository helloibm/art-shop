const ArtToken = artifacts.require("ArtToken");
const TokenAuction = artifacts.require("TokenAuction");

const arts = require("../src/art.json");

module.exports = async function(deployer, network, accounts) {
  console.log(network);
  if(network !== 'develop') {
    console.info('seeding test data is only allowed in development network');
    return;
  }
  console.log(arts);
  
  let instance = await ArtToken.deployed();
  for (var i = 0, len = arts.length; i < len; i++) {
    await instance.mint(arts[i].id, arts[i].name, arts[i].picture, arts[i].price);
  }
  /*
  let art = await instance.getArt(10);
  console.log(art);*/
};
