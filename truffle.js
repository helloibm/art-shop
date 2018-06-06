require('babel-register')

module.exports = {
  development: {
    host: "127.0.0.1",
    port: 7545,
    network_id: "5777",
    gas: 6712388,
    gasPrice: 65000000000,
  },
  develop: {
    host: "127.0.0.1",
    port: 9545,
    network_id: "4447",
    gas: 4712388,
    gasPrice: 100000000000
  }
};
