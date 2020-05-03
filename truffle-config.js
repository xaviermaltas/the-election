module.exports = {
  rpc: {
    host:"localhost",
    port:22000
  },

  networks: {

    /* GANACHE */
    ganacheGUI: {
      host: 'localhost',
      port: 7545,
      network_id: '*',
      gas: 5000000
    },

    ganacheTerminal: {
      host: 'localhost',
      port: 8545,
      network_id: '*',
      gas: 5000000
    },


    /* PRIVATE NETWORK PROJECT */
    privateNetwork: {
      host: "localhost", //our network is running on localhost
      port: 21001, // port where your blockchain is running
      network_id: 9354,
      // from: "da7e565f43edeea1a7fac8655f6a89a5d86a19d2" // use the account-id generated during the setup process
      //gasPrice: 0x0,
      gas: 20000000,
      //type: "quorum",
    },


    /*1 NODE GETH */
    nodeGeth:{
      host: "localhost",
      port: 22000,
      network_id: 9354,
      gas: 20000000
    },

    /* ETH3 NODES NET */
    eth3nodesNet:{
      host:"localhost",
      port:8501,
      network_id:1515,
      gas:2000000
    },

    /* ALASTRIA PROJECT */
    mainAlastria: {
      host: "localhost",
      port: 22000,
      network_id: "*", // Match any network id
      gas: 0xfffff,
      gasPrice: 0x0,
      type: "quorum"
    },

    general1: {
      host: "127.0.0.1",
      port: 22001,
      network_id: 83584648538, // Match any network id
      gas: 0xfffff,
      gasPrice: 0x0,
      type: "quorum",
      from: "0x74d4c56d8dcbc10a567341bfac6da0a8f04dc41d" //Required for deploying at the Alastria Network
    },

    general2: {
      host: "127.0.0.1",
      port: 22002,
      network_id: "*", // Match any network id
      gas: 0xfffff,
      gasPrice: 0x0,
      type: "quorum",
      from: "0x0e596199ea5c6d3cbc713183e7514be022a19385"
    },


    /* QUORUM NETWORK PROJECT */
    quorumNet: {
      host: "localhost",
      port: 22000, // was 8545
      network_id: 9354, // Match any network id
      gasPrice: 0x0,
      gas: 0xfffff,
      type: "quorum" // needed for Truffle to support Quorum
    },

    /* WINDOWS PRIVATENETWORK PROJECT */
    windowsPrivateNet: {
      host: "localhost", //our network is running on localhost
      port: 8543, // port where your blockchain is running
      network_id: 9354,
      // from: "da7e565f43edeea1a7fac8655f6a89a5d86a19d2" // use the account-id generated during the setup process
      gas: 20000000
    }

  },

  compilers: {
    solc: {
      version: "0.4.24",
      optimizer:{
        enabled: true,
        runs: 200
      }
    }
  }
}
