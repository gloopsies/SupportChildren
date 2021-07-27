const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = "ten collect junk opinion possible egg season devote school call cliff velvet"

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "0" // Match any network id
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/4b02d92a57b24e22a7371229adb41aaf");
      },
      network_id: "4"
    }
  },
  compilers: {
    solc: {
      version: "^0.8.0"
    }
  },
plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: "SWTTC3VAK5TG64SQ57ZZ39FXKMBD1B9KM1"
  }
};