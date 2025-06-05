const { expect } = require("chai");

const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Token contract", function () {

  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const contract = await ethers.deployContract("SimpleToken");
    await contract.waitForDeployment();

    return { contract, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { contract, owner } = await loadFixture(deployTokenFixture);
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const { contract, owner } = await loadFixture(deployTokenFixture);
      const ownerBalance = await contract.balanceOf(owner.address);
      expect(await contract.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const { contract, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );
      // Transfer 50 tokens from owner to addr1
      await expect(
        contract.transfer(addr1.address, 50)
      ).to.changeTokenBalances(contract, [owner, addr1], [-50, 50]);

      // Transfer 50 tokens from addr1 to addr2
      await expect(
        contract.connect(addr1).transfer(addr2.address, 50)
      ).to.changeTokenBalances(contract, [addr1, addr2], [-50, 50]);
    });

    it("Should emit Transfer events", async function () {
      const { contract, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );

      // Transfer 50 tokens from owner to addr1
      await expect(contract.transfer(addr1.address, 50))
        .to.emit(contract, "Transfer")
        .withArgs(owner.address, addr1.address, 50);

      // Transfer 50 tokens from addr1 to addr2
      await expect(contract.connect(addr1).transfer(addr2.address, 50))
        .to.emit(contract, "Transfer")
        .withArgs(addr1.address, addr2.address, 50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const { contract, owner, addr1 } = await loadFixture(
        deployTokenFixture
      );
      const initialOwnerBalance = await contract.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner.
      await expect(
        contract.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("Not enough tokens");

      // Owner balance shouldn't have changed.
      expect(await contract.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });
  });
});