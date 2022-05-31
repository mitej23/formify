require("@nomiclabs/hardhat-waffle");
require('dotenv').config({path:__dirname+'/.env'});

module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/DlFhEPvKZG4tWpZTS9b88hApIlN58sF9",
      accounts: [process.env.pk]
    },
    // polygon: {
    //   url: "https://polygon-rpc.com/",
    //   accounts: [process.env.pk]
    // }
  }
};