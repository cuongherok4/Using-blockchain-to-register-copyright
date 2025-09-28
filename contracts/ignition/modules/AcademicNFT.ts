import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const AcademicNFTModule = buildModule("AcademicNFTModule", (m) => {

  const AcademicNFT = m.contract("AcademicNFT")

  return { AcademicNFT };
});

export default AcademicNFTModule;
