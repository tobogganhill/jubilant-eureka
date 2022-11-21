const hre = require('hardhat');

// Returns the Ether balance of a given address.
async function getBalance(address) {
	const balanceBigInt = await hre.ethers.provider.getBalance(address);
	return hre.ethers.utils.formatEther(balanceBigInt);
}

// Logs the Ether balances for a list of addresses.
async function printBalances(addresses) {
	let idx = 0;
	for (const address of addresses) {
		console.log(`Address ${idx} bal: `, await getBalance(address));
		idx++;
	}
}

// Logs the memos stored on-chain from coffee purchases.
async function printMemos(memos) {
	for (const memo of memos) {
		const timestamp = memo.timestamp;
		const tipper = memo.name;
		const tipperAddress = memo.from;
		const message = memo.message;
		console.log(
			`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`
		);
	}
}

async function main() {
	// Get the example accounts we'll be working with.
	const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

	// We get the contract to deploy.
	const BuyMeACoffee = await hre.ethers.getContractFactory('BuyMeACoffee');
	const buyMeACoffee = await BuyMeACoffee.deploy();

	// Deploy the contract.
	await buyMeACoffee.deployed();
	console.log('BuyMeACoffee deployed to:', buyMeACoffee.address);

	// Check balances before the coffee purchase.
	const addresses = [owner.address, tipper.address, buyMeACoffee.address];
	console.log('== Initial State ==');
	await printBalances(addresses);

	// Buy the owner a few coffees.
	const tip = { value: hre.ethers.utils.parseEther('1') };
	await buyMeACoffee.connect(tipper).buyCoffee('Jane', 'The best!', tip);
	await buyMeACoffee.connect(tipper2).buyCoffee('John', 'Amazing!', tip);
	await buyMeACoffee.connect(tipper3).buyCoffee('Joe', 'Excellent!', tip);

	// Check balances after the coffee purchase.
	console.log('== After Tipping ==');
	await printBalances(addresses);

	// Withdraw.
	await buyMeACoffee.connect(owner).withdrawTips();

	// Check balances after withdrawal.
	console.log('== Balances After Tips Withdrawn From Contract ==');
	await printBalances(addresses);

	// Check out the memos.
	console.log('== Memos ==');
	const memos = await buyMeACoffee.getMemos();
	printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
