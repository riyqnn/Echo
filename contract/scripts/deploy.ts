import { ethers } from "hardhat";

async function main() {
  const WifiRegistry = await ethers.getContractFactory("WifiRegistry");
  const wifi = await WifiRegistry.deploy();

  await wifi.waitForDeployment();

  console.log("WifiRegistry deployed to:", await wifi.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
