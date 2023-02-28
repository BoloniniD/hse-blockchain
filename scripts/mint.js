"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hat = require("hardhat");
async function main() {
    const contractAddress = '0x090b5893D9d327D62Df1D0910Ee8676601F17110';
    const receiverAddress = '0xA26aF1542360623D0E09712BECC425C64D2b23f8';
    const mintAmount = hat.ethers.utils.parseEther('1000');
    const Rzhuken = await (await hat.ethers.getContractFactory("Rzhuken")).attach(contractAddress);
    const mint = await Rzhuken.mint(receiverAddress, mintAmount);
    console.log(`Successfully minted ${mintAmount} tokens, tx: ${mint.hash}`);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
