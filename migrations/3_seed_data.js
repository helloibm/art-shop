const CardToken = artifacts.require("CardToken");
const TokenAuction = artifacts.require("TokenAuction");

const cards = require("../src/cards.json");

module.exports = async function(deployer, network, accounts) {
  console.log(network);
  if(network !== 'develop') {
    console.info('seeding test data is only allowed in development network');
    return;
  }
  console.log(cards);
  
  let instance = await CardToken.deployed();
  for (var i = 0, len = cards.length; i < len; i++) {
    await instance.mint(cards[i].id, cards[i].name, cards[i].picture, cards[i].price);
  }
  
  let card = await instance.getCard(10);
  console.log(card);
};
