// hardhat.config.js

// Project needs access to these dependencies.

require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-waffle');
require('dotenv').config();

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more.

// Access environment variables to use in our config file while not exposing the secret values.

const GOERLI_URL = process.env.GOERLI_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
	solidity: '0.8.4',
	networks: {
		goerli: {
			url: GOERLI_URL,
			accounts: [PRIVATE_KEY],
		},
	},
};
