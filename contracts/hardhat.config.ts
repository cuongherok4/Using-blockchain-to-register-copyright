import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    localganache: {
      url: "HTTP://127.0.0.1:7545",
      accounts: [
        "0xc93b1064943332df20e009705ad43dc702b38ca15f801b160b727b55ff353439",
      ],
    },
  },
};

export default config;
