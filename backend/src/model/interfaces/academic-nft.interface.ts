//src/model/interfaces/academic-nft.interface.ts
export interface NFT {
  id: string;
  title: string;
  uri: string;
  academicYear: string;
  department: string;
  owner: string;
  name: string;
  msv: string;
}

export interface NFTCreatedEvent {
  id: string;
  title: string;
  uri: string;
  academicYear: string;
  department: string;
  owner: string;
}

export interface CreateNFTResponse {
  transactionHash: string;
  nftId: string;
} 