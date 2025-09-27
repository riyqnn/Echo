require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    u2uTestnet: {
      url: "https://rpc-nebulas-testnet.u2u.xyz/", 
      chainId: 2484, 
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
  }
};
