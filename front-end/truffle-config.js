const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = "ten collect junk opinion possible egg season devote school call cliff velvet";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "0" // Match any network id
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/e6d66f035171421dac50f8c94d9c9c09%22");
      },
      network_id: "4"
    }
  },
  compilers: {
    solc: {
      version: "^0.8.0"
    }
  }
};