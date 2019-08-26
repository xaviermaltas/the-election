module.exports = {
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

    development: {
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