"use strict";
// Sources have been taken from 
// https://yuichiroaoki.medium.com/testing-erc20-smart-contracts-in-typescript-hardhat-9ad20eb40502
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const hardhat_1 = require("hardhat");
describe('Token contract', function () {
    let Rzhuken;
    let owner;
    let addrAlice;
    let addrBob;
    let addrs;
    beforeEach(async function () {
        [owner, addrAlice, addrBob, ...addrs] = await hardhat_1.ethers.getSigners();
        const RzhukenFactory = (await hardhat_1.ethers.getContractFactory('Rzhuken', owner));
        const initialSupply = (10 ** 9).toString();
        Rzhuken = await RzhukenFactory.deploy(hardhat_1.ethers.utils.parseEther(initialSupply));
    });
    describe('Deployment', function () {
        it('Should assign the total supply of tokens to the owner', async function () {
            const ownerBalance = await Rzhuken.balanceOf(owner.address);
            (0, chai_1.expect)(await Rzhuken.totalSupply()).to.equal(ownerBalance);
        });
    });
    describe('Transactions', function () {
        it('Should transfer tokens between accounts', async function () {
            // Transfer 50 tokens from owner to addr1
            await Rzhuken.transfer(addrAlice.address, 50);
            const aliceBalance = await Rzhuken.balanceOf(addrAlice.address);
            (0, chai_1.expect)(aliceBalance).to.equal(50);
            // Transfer 50 tokens from addr1 to addr2
            // We use .connect(signer) to send a transaction from another account
            await Rzhuken.connect(addrAlice).transfer(addrBob.address, 50);
            const bobBalance = await Rzhuken.balanceOf(addrBob.address);
            (0, chai_1.expect)(bobBalance).to.equal(50);
        });
        it('Should fail if sender doesn’t have enough tokens', async function () {
            const initialOwnerBalance = await Rzhuken.balanceOf(owner.address);
            // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
            // `require` will evaluate false and revert the transaction.
            await (0, chai_1.expect)(Rzhuken.connect(addrAlice).transfer(owner.address, 1)).to.be.revertedWith('ERC20: transfer amount exceeds balance');
            // Owner balance shouldn't have changed.
            (0, chai_1.expect)(await Rzhuken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
        });
        it('Should update balances after transfers', async function () {
            const initialOwnerBalance = await Rzhuken.balanceOf(owner.address);
            // Transfer 100 tokens from owner to addr1.
            await Rzhuken.transfer(addrAlice.address, 100);
            // Transfer another 50 tokens from owner to addr2.
            await Rzhuken.transfer(addrBob.address, 50);
            // Check balances.
            const finalOwnerBalance = await Rzhuken.balanceOf(owner.address);
            (0, chai_1.expect)(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));
            const aliceBalance = await Rzhuken.balanceOf(addrAlice.address);
            (0, chai_1.expect)(aliceBalance).to.equal(100);
            const bobBalance = await Rzhuken.balanceOf(addrBob.address);
            (0, chai_1.expect)(bobBalance).to.equal(50);
        });
    });
    describe('Changing supply', function () {
        describe('Minting new tokens', function () {
            it('Minting new tokens', async function () {
                // Mint new tokens and validate balance and supply.
                const initialBalance = await Rzhuken.balanceOf(addrAlice.address);
                const initialTotalSupply = await Rzhuken.totalSupply();
                const mintedAmount = 50;
                await Rzhuken.mint(addrAlice.address, mintedAmount);
                const actualBalance = await Rzhuken.balanceOf(addrAlice.address);
                const actualTotalSupply = await Rzhuken.totalSupply();
                (0, chai_1.expect)(actualBalance).to.equal(initialBalance.add(mintedAmount));
                (0, chai_1.expect)(actualTotalSupply).to.equal(initialTotalSupply.add(mintedAmount));
            });
        });
        describe('Burning tokens', function () {
            it('Should success', async function () {
                const initialBalance = await Rzhuken.balanceOf(owner.address);
                const initialTotalSupply = await Rzhuken.totalSupply();
                // Check if balance if the balance is sufficient.
                const amountToBurn = 137;
                (0, chai_1.expect)(initialBalance).to.greaterThan(amountToBurn);
                await Rzhuken.burn(owner.address, amountToBurn);
                const actualBalance = await Rzhuken.balanceOf(owner.address);
                const actualTotalSupply = await Rzhuken.totalSupply();
                (0, chai_1.expect)(actualBalance).to.equal(initialBalance.sub(amountToBurn));
                (0, chai_1.expect)(actualTotalSupply).to.equal(initialTotalSupply.sub(amountToBurn));
            });
            it('Should fail due to insufficient balance', async function () {
                const initialBalance = await Rzhuken.balanceOf(owner.address);
                // Try to burn x2 balance.
                const amountToBurn = initialBalance.mul(2);
                (0, chai_1.expect)(initialBalance).to.lessThan(amountToBurn);
                await (0, chai_1.expect)(Rzhuken.burn(owner.address, amountToBurn)).to.be.revertedWith('ERC20: burn amount exceeds balance');
            });
        });
    });
    describe('Viewers', function () {
        describe('Adding', function () {
            it('Success', async function () {
                await (0, chai_1.expect)(Rzhuken.addViewer(addrAlice.address, 'alice', true)).to.emit(Rzhuken, "LogViewerAdded").withArgs(addrAlice.address, 'alice');
            });
            it('Failure, already exists', async function () {
                await (0, chai_1.expect)(Rzhuken.addViewer(addrAlice.address, 'alice', true)).to.emit(Rzhuken, "LogViewerAdded").withArgs(addrAlice.address, 'alice');
                await (0, chai_1.expect)(Rzhuken.addViewer(addrAlice.address, 'alice', true)).to.be.revertedWith('A viewer with the given address has already been added');
            });
        });
        describe('Removing', function () {
            it('Success', async function () {
                await (0, chai_1.expect)(Rzhuken.addViewer(addrAlice.address, 'alice', true)).to.emit(Rzhuken, "LogViewerAdded").withArgs(addrAlice.address, 'alice');
                await (0, chai_1.expect)(Rzhuken.removeViewer(addrAlice.address)).to.emit(Rzhuken, "LogViewerRemoved").withArgs(addrAlice.address, 'alice');
            });
            it('Failure, not found', async function () {
                await (0, chai_1.expect)(Rzhuken.removeViewer(addrAlice.address)).to.be.revertedWith('Viewer not found');
            });
        });
    });
});
