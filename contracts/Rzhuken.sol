pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

struct Rzhuman {
    address addr;
    string name;
    bool rzhu;
}

contract Rzhuken is Ownable, ERC20 {
    mapping(address => Rzhuman) public rzhumen;

    event LogAdd(address addr, string name);
    event LogRemove(address addr, string name);

    constructor(uint256 initialSupply) ERC20("Rzhu Token", "RZHU") {
        _mint(msg.sender, initialSupply);
    }

    function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) public onlyOwner {
        _burn(account, amount);
    }

    function addKek(
        address _addr,
        string memory _name,
        bool _rzhu
    ) public {
        bytes memory tmpname = bytes(_name);
        require(tmpname.length != 0, "Name should not be empty");
        require(_addr != address(0x00));

        require(
            rzhumen[_addr].addr == address(0x00),
            "A rzhuman with the given address is already present"
        );

        Rzhuman memory rzhuman = Rzhuman(_addr, _name, _rzhu);
        rzhumen[rzhuman.addr] = rzhuman;

        emit LogAdd(rzhuman.addr, rzhuman.name);
    }

    function removeKek(address _addr) public {
        require(rzhumen[_addr].addr == _addr, "Rzhuman not found");

        Rzhuman memory rzhuman = rzhumen[_addr];
        delete rzhumen[_addr];

        emit LogRemove(rzhuman.addr, rzhuman.name);
    }
}
