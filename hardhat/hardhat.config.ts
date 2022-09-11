import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
require('dotenv').config()

const DEPLOYER_KEY = process.env.DEPLOYER_KEY
if (!DEPLOYER_KEY) throw new Error('DEPLOYER_KEY not set.')

const POLYSCAN_KEY = process.env.POLYSCAN_KEY
if (!POLYSCAN_KEY) throw new Error('POLYSCAN_KEY not set.')

const config: HardhatUserConfig = {
  solidity: "0.8.12",
  networks: {
    mumbai: {
      url: 'https://rpc-mumbai.maticvigil.com',
      accounts: [DEPLOYER_KEY],
      gas: 10000000
    },
  },
  etherscan: {
    apiKey: {
      polygonMumbai: POLYSCAN_KEY
    }
  }
};

export default config;
