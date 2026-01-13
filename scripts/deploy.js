const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  const SkillCredential = await hre.ethers.getContractFactory("SkillCredential");
  const skillCredential = await SkillCredential.deploy(deployer.address);

  await skillCredential.waitForDeployment();

  const address = await skillCredential.getAddress();
  console.log("SkillCredential deployed to:", address);
  
  console.log("\n✅ Deployment successful!");
  console.log("Update CONTRACT_ADDRESS in frontend/src/pages/Credential.jsx with:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

