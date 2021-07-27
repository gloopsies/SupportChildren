// SPDX-License-Identifier: MIT
pragma solidity >=0.7.4;

import "./FundRaising.sol";

contract FundRaisings {
    address[] public deployedCampaigns;

    function createCampaign(uint deadline, uint goalInt,uint goalFloat, address recipient) public {
        address newFundRaising = address (new FundRaising(deadline, goalInt, goalFloat, msg.sender, recipient ));
        deployedCampaigns.push(newFundRaising);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
    
}