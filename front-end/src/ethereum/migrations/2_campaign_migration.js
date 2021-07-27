const FundRaising = artifacts.require("FundRaising.sol");
const FundRaisings = artifacts.require("FundRaisings.sol");

module.exports = function (deployer) {
  deployer.deploy(FundRaising, 500, 1, 0, "0xD3b7015c6ad598d889ED8a819c99e852c0243E20", "0xf6258385F06E771b0fD705f37BfDCfeb8B07cf7e");
  deployer.deploy(FundRaisings);
};
