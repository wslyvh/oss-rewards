import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { expect, assert } from "chai"
import { ethers } from "hardhat"

describe("Collectible", function () {
  async function deployCollectibleFixture() {
    const [owner, otherAccount] = await ethers.getSigners()

    const Collectible = await ethers.getContractFactory("Collectible")
    const collectible = await Collectible.deploy()

    return { collectible, owner, otherAccount }
  }

  describe("Deployment", function () {
    it("Should deploy Collectible", async function () {
      const { collectible } = await loadFixture(deployCollectibleFixture)

      assert.isNotNull(collectible)
    })

    it("Should set the right owner", async function () {
      const { collectible, owner } = await loadFixture(deployCollectibleFixture)

      expect(await collectible.owner()).to.equal(owner.address)
    })
  })
})
