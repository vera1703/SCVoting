const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("SCVotingModule", (m) => {
  const voting = m.contract("SCVoting");
  return { voting };
});