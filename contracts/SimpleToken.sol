//SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.28;

import {console} from "hardhat/console.sol";

contract SimpleToken {
    string public name = "My Simple Token";
    string public symbol = "MST";

    uint256 public totalSupply = 1000000;

    address public owner;
    mapping(address => uint256) public balances;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    error NotEnoughTokens(uint256 available, uint256 requested);

    constructor() {
        owner = msg.sender;
        balances[owner] = totalSupply;
    }

    function transfer(address to, uint256 amount) external {
        if (balances[msg.sender] < amount) {
            revert NotEnoughTokens(balances[msg.sender], amount);
        }

        console.log(
            "Transferring from %s to %s %s tokens",
            msg.sender,
            to,
            amount
        );

        balances[msg.sender] -= amount;
        balances[to] += amount;

        emit Transfer(msg.sender, to, amount);
    }

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}
