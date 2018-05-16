const CardToken = artifacts.require("CardToken");
const TokenAuction = artifacts.require("TokenAuction");
const util = require("util");
const fs = require("fs");
const path = require("path");
const copy = require("copy");
const writeFile = util.promisify(fs.writeFile);

module.exports = async function(deployer) {
  const cardToken = await deployer.deploy(CardToken, "CardToken", "CT");
  
  const auctionContract = await deployer.deploy(
    TokenAuction,
    CardToken.address
  );
  const addresses = {
    tokenAddress: CardToken.address,
    auctionAddress: TokenAuction.address
  };

  let stringyAdresses = JSON.stringify(addresses);
  console.log(stringyAdresses);

  var filePath = path.join(__dirname, "..", "src", "addresses.json");
  console.log(filePath);

  await writeFile(filePath, stringyAdresses);

  /*
  var cardTokenFile = path.join(__dirname, "..", "build", "contracts", "CardToken.json");
  var auctionTokenFile = path.join(__dirname, "..", "build", "contracts", "TokenAuction.json");
  var cardTokenDestPath = path.join(__dirname, "..", "src", "CardToken.json");
  var auctionTokenDestPath = path.join(__dirname, "..", "src", "TokenAuction.json");

  copyFile(cardTokenFile, cardTokenDestPath);
  copyFile(auctionTokenFile, auctionTokenDestPath);
  */
  // await fs.copyFile(cardTokenFile, srcPath + "\\CardToken.json", function(err){
  //   console.log(err);
  // });
  // await fs.copyFile(auctionTokenFile, srcPath + "\\TokenAuction.json", function(err){
  //   console.log(err);
  // });
  // await copy("build/contracts/CardToken.json", "src/CardToken.json", function(err, file){
  //   console.log(err);
  // });
  // await copy("build/contracts/TokenAuction.json", "src/TokenAuction.json", function(err, file){
  //   console.log(err);
  // });
  
  
};

function copyFile(srcPath, savPath) {
  console.log(srcPath + " -> " + savPath)
  fs.readFile(srcPath, 'utf8', function (err, data) {
          if (err) throw err;
          //Do your processing, MD5, send a satellite to the moon, etc.
          fs.writeFile (savPath, data, function(err) {
              if (err) throw err;
              console.log('complete');
          });
      });
}
