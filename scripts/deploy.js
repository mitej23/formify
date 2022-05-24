const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const Formify = await ethers.getContractFactory("Formify");
  const contract = await Formify.deploy();

  await contract.deployed();
  fs.writeFileSync('./config.js',`
    export const contractAddress = "${contract.address}";
    export const ownerAddress = "${contract.signer.address}";
  `);

  console.log("Contract deployed to: ", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
