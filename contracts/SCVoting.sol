// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SCVoting {
    mapping(address => bool) public hasVoted; 
    uint256[3] public votes;

    event Voted(address indexed voter, uint8 option);

    function vote(uint8 option) external {
        require(option < 3, "Option out of range");
        require(!hasVoted[msg.sender], "Already voted");

        hasVoted[msg.sender] = true;
        votes[option] += 1;

        emit Voted(msg.sender, option);
    }

    function getVotes()
        external
        view
        returns (uint256 optionA, uint256 optionB, uint256 optionC)
    {
        return (votes[0], votes[1], votes[2]);
    }
}