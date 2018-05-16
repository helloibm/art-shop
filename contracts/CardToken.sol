pragma solidity ^0.4.21;

import "zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";


contract CardToken is ERC721Token, Ownable {

    string public name = "CardToken";
    string public symbol = "CT";
    
    struct Card {
        uint id;
        string name;
        string picture;
        uint price;
    }

    Card[] cards;

    function CardToken(string _name, string _symbol) ERC721Token(_name, _symbol) public {
        owner = msg.sender;
        name = _name;
        symbol = _symbol;
    }

    function mint(uint _id, string _name, string _picture, uint _price) public onlyOwner {
        Card memory _card = Card({ id: _id, name: _name, picture: _picture, price: _price });
        uint _cardId = cards.push(_card) - 1;

        _mint(msg.sender, _cardId);
    }

    function getCard(uint _cardId) public view returns(uint _id, string _name, string _picture,  uint _price, address _owner) {
        Card memory _card = cards[_cardId];
        address _owneraddress = this.ownerOf(_cardId);
        return (_card.id, _card.name, _card.picture, _card.price, _owneraddress);
    }

    function totalTokens() public view returns(uint) {
        return cards.length;
    }
}