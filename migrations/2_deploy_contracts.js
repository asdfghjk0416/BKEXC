const TBE = artifacts.require("TBE");

module.exports = function (deployer) {
  deployer.deploy(TBE,100000);
};
