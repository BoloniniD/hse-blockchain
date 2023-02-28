"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hat = require("hardhat");
async function main() {
    const initialSupply = (0).toString();
    const Rzhuken = await hat.ethers.getContractFactory("Rzhuken");
    const token = await Rzhuken.deploy(hat.ethers.utils.parseEther(initialSupply));
    await token.deployed();
    console.log(`Rzhuken is now deployed to ${token.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
