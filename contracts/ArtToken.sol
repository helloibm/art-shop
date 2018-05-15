pragma solidity ^0.4.21;

import "zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";


contract ArtToken is ERC721Token, Ownable {

    string public name = "ArtToken";
    string public symbol = "ART";
    
    struct Art {
        uint id;
        string name;
        string picture;
        uint price;
    }

    Art[] arts;

    function ArtToken(string _name, string _symbol) ERC721Token(_name, _symbol) public {
        owner = msg.sender;
        name = _name;
        symbol = _symbol;
    }

    function mint(uint _id, string _name, string _picture, uint _price) public onlyOwner {
        Art memory _art = Art({ id: _id, name: _name, picture: _picture, price: _price });
        uint _artId = arts.push(_art) - 1;

        _mint(msg.sender, _artId);
    }

    function getArt(uint _artId) public view returns(uint _id, string _name, string _picture,  uint _price, address _owner) {
        Art memory _art = arts[_artId];
        address _owneraddress = this.ownerOf(_artId);
        return (_art.id, _art.name, _art.picture, _art.price, _owneraddress);
    }

    function totalTokens() public view returns(uint) {
        return arts.length;
    }
}