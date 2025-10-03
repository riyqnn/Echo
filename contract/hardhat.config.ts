require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    u2uMainnet: {
      url: "https://rpc-mainnet.uniultra.xyz", 
      chainId: 39, 
      accounts: [process.env.PRIVATE_KEY] 
    }
  },
  etherscan: {
  }
};
