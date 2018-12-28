var BloodBank = artifacts.require('./BloodBank.sol')

module.exports = function (deployer) {
  deployer.deploy(BloodBank)
}
