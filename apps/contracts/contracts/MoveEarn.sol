pragma solidity ^0.8.19;

import './interfaces/IToken.sol';

contract MoveEarn {
    IToken public token;
    address public ownerName;

    event RewardPaid(address indexed user, uint256 rewardAmt);

    constructor(address _token) {
        ownerName = msg.sender;
        _token = address(IToken(_token));
    }

    function rewardUser(address user, uint256 rewardAmt) public {
        require(msg.sender == ownerName, "Only owner can reward users");
        token.transfer(user, rewardAmt);
        emit RewardPaid(user, rewardAmt);
    }

}

