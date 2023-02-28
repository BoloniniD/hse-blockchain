"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");

var secrets = require('./secrets.json');

const config = {
    solidity: "0.8.17",
    networks: {
        goerli: {
            url: secrets.network.url,
            accounts: [secrets.network.key],
        },
    },
};
exports.default = config;
