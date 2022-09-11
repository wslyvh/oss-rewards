import { ethers } from "hardhat"

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Collectible = await ethers.getContractFactory("Collectible")
  const collectible = await Collectible.deploy()
  await collectible.deployed()

  console.log(`Collectible deployed to ${collectible.address}`)

  console.log('Mint 1. Solarpunk..')
  const solarpunk = await collectible.safeMint(deployer.address, 1, 42, 3)
  console.log('TX:', solarpunk.hash)

  console.log('Mint 2. Solarpunk..')
  const lunarpunk = await collectible.safeMint(deployer.address, 2, 12, 6)
  console.log('TX:', lunarpunk.hash)

  console.log('Mint 3. Unknown..')
  const unknown = await collectible.safeMint(deployer.address, 0, 0, 0)
  console.log('TX:', unknown.hash)

  // Get SVG value 
  // const svg = await collectible.tokenURI(0)
  // console.log('SVG', svg)

  console.log('Ok! All done..')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
