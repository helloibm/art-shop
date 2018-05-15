
const addresses = {"tokenAddress":"0x345ca3e014aaf5dca488057592ee47305d9b3e10","auctionAddress":"0x8f0483125fcb9aaaefa9209d8e9d7b9c8b9fb90f"}
//const addresses = {"tokenAddress":"0xfb88de099e13c3ed21f80a7a1e49f8caecf10df6","auctionAddress":"0xf204a4ef082f5c04bb89f7d5e6568b796096735a"}
//EXAMPLE to send value thru a contract method.
//contractInstance.methods.mymethod(param).send({from: address, value: web3.utils.toWei( value, 'ether')})

App = {
  web3Provider: null,
  contracts: {},
  allTokens: [], //local array to store information of all tokens fetched from blockchain
  
  tokenInstance: null,   //ArtToken instance
  auctionInstance: null, //TokenAuction instance
  account: null, //current metamask account
  tokenContractOwner: null, //account who deployed the token contract (optional)
  adminAddress: "0x627306090abab3a6e1400e9345bc60c78a8bef57", //first account used in truffle develop
  emptyAdress: "0x0000000000000000000000000000000000000000",

  init: async function() {    
    await App.initWeb3();    
  },

  initWeb3: async function() {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache //this fallback is not secure for production scenarios
      //App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      alert("Make sure to connect Mist or MetaMask with the network.");
      return;
    }
    
    web3 = new Web3(App.web3Provider);

    App.initContract();    
  },

  initContract: function() {
    //init Account details    
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
        alert("Error in getting account details.");
        return;
      }
      App.account = accounts[0];
      $("#currentAccount").text(App.account);
      console.log("Current Account: " + App.account);      
    });

    //Init Art Token
    $.getJSON('ArtToken.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      App.contracts.ArtToken = TruffleContract(data);    
      // Set the provider for our contract
      App.contracts.ArtToken.setProvider(App.web3Provider);    
      //get deployed instance // AWAIT/ASYNC somehow does not work with getJSON, so lets use promises instead
      //App.contracts.ArtToken.deployed().then( function(inst) {
      App.contracts.ArtToken.at(addresses.tokenAddress).then( (inst)=> {
        tokenInstance = inst;
        tokenInstance.owner().then( (ownr)=> {
          tokenContractOwner = ownr;
          console.log("Token Contract Owner: " + tokenContractOwner);
        });
        //Fetch existing art records from our blockchain
        App.fetchExistingTokens();
      }).catch( (err) => {
        alert(err);
      });     
    });

  },

  fetchExistingTokens: async function() {    
    
    try {
      
      let artCount = await tokenInstance.totalTokens.call();
      
      for (i = 0; i < artCount; i ++) {
        let art = await tokenInstance.getArt(i);
        App.allTokens.push(art);        
      }
    }
    catch(err) { console.log(err); alert(err); return; }

    //Once all the tokens are fetched, fetch auction related details
    $.getJSON('TokenAuction.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      App.contracts.TokenAuction = TruffleContract(data);    
      // Set the provider for our contract
      App.contracts.TokenAuction.setProvider(App.web3Provider);    
      //get deployed instance // AWAIT/ASYNC somehow does not work, so lets use promises instead
      App.contracts.TokenAuction.at(addresses.auctionAddress).then( function(inst) {
        auctionInstance = inst;
        //Fetch existing art records from our blockchain
        App.populateGallery();
      }).catch( (err) => {
        alert(err);
      });
    });

  },

  populateGallery: async function() {
    try {
      
      var artsRow = $('#artRow');
      var artTemplate = $('#artTemplate');
      
      $.each(App.allTokens, async (i, art)=>{
        var artTemplate = $('#artTemplate');
        let artid = art[0];
        let auction = await auctionInstance.tokenIdToAuction(artid);
        
        artTemplate.find('.panel-heading:first').attr("style", "background-color:lightgrey;");
        if(auction[0] === App.emptyAdress) {
          //this token is not for auction
          artTemplate.find('.btn-buy').attr("style", "display: none;");

          if(art[4] !== App.account) { //only the owner can sell
            artTemplate.find('.btn-sell').attr("style", "display: none;");            
          } else {
            artTemplate.find('.btn-sell').attr("style", "display: block;");
            artTemplate.find('.panel-heading:first').attr("style", "background-color:lightgreen;");
          }
          
          artTemplate.find('.art-owner').text(art[4]); //pick the default owner
        } else {
          artTemplate.find('.btn-sell').attr("style", "display: none;");
          if(auction[3] === true) { //sold
            artTemplate.find('.btn-buy').attr("style", "display: none;");
            if(auction[0] === App.account) {
              artTemplate.find('.panel-heading:first').attr("style", "background-color:lightgreen;");
            }            
          } else {
            if(auction[0] !== App.account || App.account !== App.adminAddress) {
              //item is available for auction and current account is auction seller as well.
              artTemplate.find('.btn-buy').attr("style", "display: block;");
              artTemplate.find('.panel-heading:first').attr("style", "background-color:yellow;");
            } 
            //artTemplate.find('.panel-heading:first').attr("style", "background-color:yellow;");
            // if(auction[0] === App.account || auction[1] === App.account) { //item is available for auction and current account is auction seller as well.
            //   //if(art[4] === App.account) {          
            //     artTemplate.find('.btn-buy').attr("style", "display: none;");
            //   } else {
            //     artTemplate.find('.btn-buy').attr("style", "display: block;");
            //     //artTemplate.find('.panel-heading:first').attr("style", "background-color:yellow;");
            //   }
          }
          
          artTemplate.find('.art-owner').text(auction[0]); //pick the owner from auction
          //artTemplate.find('.art-owner').text(art[4]); //pick the owner from auction
        }

        artTemplate.find('.panel-title').text(art[1]);

        artTemplate.find('img').attr('src', art[2]);
        artTemplate.find('.art-id').text(artid);        
        artTemplate.find('.art-price').text(art[3]);
        artTemplate.find('.btn-buy').attr('data-id', artid);
        artTemplate.find('.btn-buy').attr('data-price', art[3]);
        artTemplate.find('.btn-sell').attr('data-id', artid);
        artTemplate.find('.btn-sell').attr('data-price', art[3]);
        artsRow.append(artTemplate.html());        
      });      
    }
    catch(err) { console.log(err); alert(err); return; }

    return App.bindEvents();
  },

  handleBuy: function(event) {
    event.preventDefault();

    var artId = parseInt($(event.target).data('id'));
    var artPrice = parseInt($(event.target).data('price'));
    artPrice = artPrice * Math.pow(10, 18);
    //contractInstance.methods.mymethod(param).send({from: address, value: web3.utils.toWei( value, 'ether')})
    //auctionInstance.bid(artId).send({from: App.account, value: artPrice}).then(function(result) {      
    auctionInstance.bid(artId, 
      {from: App.account, value: artPrice, gas: 4712388, gasPrice: 100000000000}).then(function(result) {
      //{from: App.account, value: artPrice}).then(function(result) {
      alert("Successfully Purchased!");
      console.log(result);
    }).catch(function(err){
      alert(err);
    });

  },

  handleSell: function(event) {

    event.preventDefault();

    var artId = parseInt($(event.target).data('id'));
    var artPrice = parseInt($(event.target).data('price'));
    auctionInstance.sell(artId, artPrice).then(function(result) {
      alert('item listed for auction.');
      console.log(result);
    }).catch(function(err){
      console.log(err);
      alert(err);      
    });

  },

  bindEvents: function() {
    $(document).on('click', '.btn-buy', App.handleBuy);
    $(document).on('click', '.btn-sell', App.handleSell);
  },

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
