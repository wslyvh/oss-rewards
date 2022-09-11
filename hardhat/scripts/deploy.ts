import { ethers } from "hardhat"

async function main() {
  const Collectible = await ethers.getContractFactory("Collectible")
  const collectible = await Collectible.deploy()

  await collectible.deployed()

  console.log(`Collectible deployed to ${collectible.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
