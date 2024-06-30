import { updateConfig, config } from '@repo/config-contract';
import { ethers } from 'hardhat';
async function deployMugshot() {
    const [owner] = await ethers.getSigners();

    const MoveEarn = await ethers.getContractFactory('MoveEarn');

    const moveEarnInstance = await MoveEarn.deploy(
        config.TOKEN_ADDRESS,
    );

    const ecoEarnAddress = await moveEarnInstance.getAddress();

    console.log(`MoveEarn deployed to: ${ecoEarnAddress}`);

    updateConfig({
        ...config,
        CONTRACT_ADDRESS: ecoEarnAddress,
    });
}

deployMugshot()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
