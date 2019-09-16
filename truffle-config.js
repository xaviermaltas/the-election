module.exports = {
  rpc: {
    host:"localhost",
    port:8543
  },

  networks: {
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

    privateNetwork: {
      host: "localhost", //our network is running on localhost
      port: 8543, // port where your blockchain is running
      network_id: 9354,
      // from: "da7e565f43edeea1a7fac8655f6a89a5d86a19d2" // use the account-id generated during the setup process
      gasPrice: 0x0,
      gas: 20000000,
      type: "quorum",
    },

    general1: {
     host: "127.0.0.1",
     port: 22001,
     network_id: 83584648538, // Match any network id
     gas: 0xfffff,
     gasPrice: 0x0,
     type: "quorum",
   },

   general2: {
     host: "127.0.0.1",
     port: 22002,
     network_id: "*", // Match any network id
     gas: 0xfffff,
     gasPrice: 0x0,
     type: "quorum",
     from: "0x0e596199ea5c6d3cbc713183e7514be022a19385"
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
