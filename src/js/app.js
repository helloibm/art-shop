
const addresses = {"tokenAddress":"0x345ca3e014aaf5dca488057592ee47305d9b3e10","auctionAddress":"0x8f0483125fcb9aaaefa9209d8e9d7b9c8b9fb90f"}
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

    //Init Card Token
    $.getJSON('/abi/CardToken.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      App.contracts.CardToken = TruffleContract(data);    
      // Set the provider for our contract
      App.contracts.CardToken.setProvider(App.web3Provider);    
      //get deployed instance // AWAIT/ASYNC somehow does not work with getJSON, so lets use promises instead
      //App.contracts.CardToken.deployed().then( function(inst) {
      App.contracts.CardToken.at(addresses.tokenAddress).then( (inst)=> {
        tokenInstance = inst;
        tokenInstance.owner().then( (ownr)=> {
          tokenContractOwner = ownr;
          console.log("Token Contract Owner: " + tokenContractOwner);
        });
        //Fetch existing card records from our blockchain
        App.fetchExistingTokens();
      }).catch( (err) => {
        alert(err);
      });     
    });

  },

  fetchExistingTokens: async function() {    
    
    try {
      
      let cardCount = await tokenInstance.totalTokens.call();
      
      for (i = 0; i < cardCount; i ++) {
        let card = await tokenInstance.getCard(i);
        App.allTokens.push(card);        
      }
    }
    catch(err) { console.log(err); alert(err); return; }

    //Once all the tokens are fetched, fetch auction related details
    $.getJSON('/abi/TokenAuction.json', function(data) {
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
      
      var cardsRow = $('#cardRow');
      var cardTemplate = $('#cardTemplate');
      
      $.each(App.allTokens, async (i, card)=>{
        var cardTemplate = $('#cardTemplate').clone(true);
        let cardid = card[0];
        let auction = await auctionInstance.tokenIdToAuction(cardid);
        
        if(auction[0] === App.emptyAdress) {
          //this token is not for auction
          if(card[4] === App.account) { //only the owner can sell
            cardTemplate.find('.btn-sell').attr("style", "display: block;");
            cardTemplate.find('.panel-heading:first').attr("style", "background-color:lightgreen;");
          }          
          cardTemplate.find('.card-owner').text(card[4]); //pick the default owner
        
        } else {
          
          if(auction[3] === true) { //sold
            if(auction[0] === App.account) {
              cardTemplate.find('.panel-heading:first').attr("style", "background-color:lightgreen;");
            }            
          } else {
            if(auction[0] !== App.account || App.account !== App.adminAddress) {
              //item is available for auction and current account is auction seller as well.
              cardTemplate.find('.btn-buy').attr("style", "display: block;");
              cardTemplate.find('.panel-heading:first').attr("style", "background-color:yellow;");
            } 
        
          }
          
          cardTemplate.find('.card-owner').text(auction[0]); //pick the owner from auction
        
        }

        cardTemplate.find('.panel-title').text(card[1]);

        cardTemplate.find('img').attr('src', card[2]);
        cardTemplate.find('.card-id').text(cardid);        
        cardTemplate.find('.card-price').text(card[3]);
        cardTemplate.find('.btn-buy').attr('data-id', cardid);
        cardTemplate.find('.btn-buy').attr('data-price', card[3]);
        cardTemplate.find('.btn-sell').attr('data-id', cardid);
        cardTemplate.find('.btn-sell').attr('data-price', card[3]);
        cardsRow.append(cardTemplate.html());        
      });      
    }
    catch(err) { console.log(err); alert(err); return; }

    return App.bindEvents();
  },

  handleBuy: function(event) {
    event.preventDefault();

    var cardId = parseInt($(event.target).data('id'));
    var cardPrice = parseInt($(event.target).data('price'));
    cardPrice = cardPrice * Math.pow(10, 18);
    //contractInstance.methods.mymethod(param).send({from: address, value: web3.utils.toWei( value, 'ether')})
    //auctionInstance.bid(cardId).send({from: App.account, value: cardPrice}).then(function(result) {      
    auctionInstance.bid(cardId, 
      {from: App.account, value: cardPrice, gas: 4712388, gasPrice: 100000000000}).then(function(result) {
      //{from: App.account, value: cardPrice}).then(function(result) {
      alert("Successfully Purchased!");
      console.log(result);
    }).catch(function(err){
      alert(err);
    });

  },

  handleSell: function(event) {

    event.preventDefault();

    var cardId = parseInt($(event.target).data('id'));
    var cardPrice = parseInt($(event.target).data('price'));
    tokenInstance.approve(addresses.auctionAddress, cardId).then(function(result){
      //alert('item approved for auction.');
      auctionInstance.sell(cardId, cardPrice).then(function(result) {
        alert('item listed for auction.');
        console.log(result);
      }).catch(function(err){
        console.log(err);
        alert(err);      
      });

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
