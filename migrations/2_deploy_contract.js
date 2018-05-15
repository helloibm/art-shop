const ArtToken = artifacts.require("ArtToken");
const TokenAuction = artifacts.require("TokenAuction");
const util = require("util");
const fs = require("fs");
const path = require("path");
const writeFile = util.promisify(fs.writeFile);

module.exports = async function(deployer) {
  const artToken = await deployer.deploy(ArtToken, "ArtToken", "ART");
  
  const auctionContract = await deployer.deploy(
    TokenAuction,
    ArtToken.address
  );
  const addresses = {
    tokenAddress: ArtToken.address,
    auctionAddress: TokenAuction.address
  };

  let stringyAdresses = JSON.stringify(addresses);
  console.log(stringyAdresses);

  var filePath = path.join(__dirname, "..", "src", "addresses.json");
  console.log(filePath);

  await writeFile(filePath, stringyAdresses);
  
};
