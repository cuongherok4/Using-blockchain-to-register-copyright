import { Injectable, OnModuleInit ,NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { NFT,NFTCreatedEvent } from '../../model/interfaces/academic-nft.interface';
import * as AcademicNFTArtifact from 'src/context/Contract.json'; // ABI của smart contract
import { BlockChainModel } from 'src/model/entity/blockchain.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios'; // <--- import axios

@Injectable() // Đánh dấu service này để NestJS có thể inject
export class BlockchainService implements OnModuleInit {
  private provider: ethers.JsonRpcProvider; // Kết nối tới blockchain
  private contract: ethers.Contract;        // Đối tượng tương tác với smart contract
  private wallet: ethers.Wallet;            // Ví Ethereum để ký giao dịch

  constructor(
    private configService: ConfigService, 
    @InjectRepository(BlockChainModel) // Inject repository của TypeORM để làm việc với DB
    private readonly blockchainRepository: Repository<BlockChainModel>,
  ) {}

  // Hàm chạy khi module được khởi tạo
  async onModuleInit() {
    await this.initializeBlockchain();
  }

  // Khởi tạo kết nối blockchain
  private async initializeBlockchain() {
    try {
      // Kết nối tới node blockchain (mặc định Ganache local)
      const providerUrl = this.configService.get<string>('BLOCKCHAIN_PROVIDER_URL') || 'http://127.0.0.1:7545';
      this.provider = new ethers.JsonRpcProvider(providerUrl);

      // Lấy private key từ biến môi trường để tạo ví
      const privateKey = this.configService.get<string>('PRIVATE_KEY');
      if (!privateKey) throw new Error('Private key not found in environment variables');
      this.wallet = new ethers.Wallet(privateKey, this.provider);

      // Lấy địa chỉ contract từ biến môi trường
      const contractAddress = this.configService.get<string>('CONTRACT_ADDRESS');
      if (!contractAddress) throw new Error('Contract address not found in environment variables');

      // Khởi tạo đối tượng contract
      this.contract = new ethers.Contract(
        contractAddress,
        AcademicNFTArtifact.abi,
        this.wallet
      );

      // Bắt sự kiện NFT mới tạo
      this.listenToNFTCreated();

      console.log('Blockchain service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize blockchain service:', error);
      throw error;
    }
  }

  // Lắng nghe sự kiện NFTCreated từ blockchain
  private listenToNFTCreated() {
    this.contract.on('NFTCreated', 
      (id: bigint, title: string, uri: string, academicYear: string, department: string, owner: string) => {
        console.log('New NFT Created:', {
          id: id.toString(),
          title,
          uri,
          academicYear,
          department,
          owner
        });
        // Có thể xử lý thêm: gửi thông báo, cập nhật cache, ...
    });
  }

  // API tạo NFT (lưu vào DB, có thể mở rộng để ghi lên blockchain)
  async createNFT(
    title: string,
    uri: string,
    department: string,
    name: string,
    msv: string
  ) {
    try {
      // Kiểm tra dữ liệu bắt buộc
      if (!title) throw new Error('Title cannot be empty');
      if (!uri) throw new Error('URI cannot be empty');
      if (!department) throw new Error('Department cannot be empty');

      // Tạo entity NFT mới
      const nft = this.blockchainRepository.create({
        title,
        uri,
        department,
        name,
        masv: msv,
      });

      // Lưu vào DB
      const savedNFT = await this.blockchainRepository.save(nft);

      return { message: 'NFT created successfully!', data: savedNFT };
    } catch (error) {
      throw new Error(`Failed to create NFT: ${error.message}`);
    }
  }

  // Lấy chi tiết 1 NFT từ blockchain
  async getNFTDetail(id: number): Promise<NFT> {
    try {
      if (id <= 0) throw new Error('Invalid NFT ID');

      const nextId = await this.contract.nextId();
      if (id >= nextId) throw new Error('NFT does not exist');

      const nft = await this.contract.getNFTDetail(id);
      return this.formatNFTResponse([nft])[0];
    } catch (error) {
      throw new Error(`Failed to get NFT detail: ${error.message}`);
    }
  }

  // Lấy toàn bộ NFT từ blockchain
  async getAllNFTs(): Promise<NFT[]> {
    try {
      const nfts = await this.contract.getAllListedNFTs();
      return this.formatNFTResponse(nfts);
    } catch (error) {
      throw new Error(`Failed to get all NFTs: ${error.message}`);
    }
  }

  // Lấy NFT của một ví cụ thể
  async getUserNFTs(address: string): Promise<NFT[]> {
    try {
      if (!ethers.isAddress(address)) throw new Error('Invalid Ethereum address');

      const nfts = await this.contract.getUserNFTs(address);
      return this.formatNFTResponse(nfts);
    } catch (error) {
      throw new Error(`Failed to get user NFTs: ${error.message}`);
    }
  }

  // Lấy số lượng NFT đã tạo
  async getNextId(): Promise<number> {
    try {
      const nextId = await this.contract.nextId();
      return Number(nextId) - 1; // Trừ 1 vì nextId bắt đầu từ 1
    } catch (error) {
      throw new Error(`Failed to get next ID: ${error.message}`);
    }
  }

  // Chuyển dữ liệu từ blockchain thành object NFT chuẩn
  private formatNFTResponse(nfts: any[]): NFT[] {
    return nfts.map(nft => ({
      id: nft.id.toString(),
      title: nft.title,
      uri: nft.uri,
      academicYear: nft.academicYear,
      department: nft.department,
      owner: nft.owner.toLowerCase(),
      msv: nft.msv,
      name: nft.name
    }));
  }

  // Kiểm tra NFT có tồn tại không
  async nftExists(id: number): Promise<boolean> {
    try {
      const nextId = await this.contract.nextId();
      return id > 0 && id < Number(nextId);
    } catch (error) {
      throw new Error(`Failed to check NFT existence: ${error.message}`);
    }
  }

  // Lấy toàn bộ NFT lưu trong DB (chưa có ví liên kết)
  async getAllNftNoWallet() {
    const data = await this.blockchainRepository.find();
    return data;
  }


  // Tải file từ Pinata/IPFS theo NFT ID
  async downloadNFTFile(id: number): Promise<Buffer> {
    const nft = await this.getNFTDetail(id);
    if (!nft.uri) {
      throw new NotFoundException(`NFT ID ${id} chưa có file đính kèm`);
    }

    try {
      // Sử dụng axios để tải file từ Pinata/IPFS
      const response = await axios.get(nft.uri, {
        responseType: 'arraybuffer', // nhận dữ liệu dưới dạng buffer
      });
      return Buffer.from(response.data);
    } catch (error) {
      throw new Error(`Không tải được file từ URI: ${nft.uri}`);
    }
  }

  // Lấy danh sách NFT đã duyệt theo mã sinh viên
async getApprovedNFTsByStudent(masv: string): Promise<NFT[]> {
  const allNFTs = await this.getAllNFTs(); // Lấy tất cả NFT từ blockchain
  return allNFTs.filter(
    (nft) => nft.msv === masv // Lọc theo masv và status
  );
}

// Lấy danh sách đề tài chưa duyệt của sinh viên
async getMyPendingNFTs(masv: string): Promise<BlockChainModel[]> {
  if (!masv) throw new Error('Mã sinh viên không được để trống');

  // Lọc DB all_nft_db theo masv
  const pendingNFTs = await this.blockchainRepository.find({
    where: { masv },
  });

  return pendingNFTs;
}


// src/modules/blockchain/blockchain.service.ts
async updatePendingNFT(id: number, updateData: Partial<BlockChainModel>): Promise<BlockChainModel> {
  // Lấy đề tài từ DB
  const nft = await this.blockchainRepository.findOne({ where: { id } });
  if (!nft) throw new NotFoundException(`Đề tài ID ${id} không tồn tại`);
  
  // Nếu muốn chỉ sửa đề tài chưa duyệt
  // all_nft_db chỉ chứa đề tài chờ duyệt, nên mặc định là chưa duyệt

  // Cập nhật các trường hợp lệ
  Object.assign(nft, updateData);

  return await this.blockchainRepository.save(nft);
}

// Xóa đề tài chưa duyệt theo ID
  async deletePendingNFT(id: number): Promise<void> {
    const result = await this.blockchainRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy đề tài ID ${id}`);
    }
  }

  // Tìm kiếm đề tài chưa duyệt theo title, name, masv
  async searchPendingNFTs(filters: { title?: string; name?: string; masv?: string }) {
    const query = this.blockchainRepository.createQueryBuilder('nft');

    if (filters.title) {
      query.andWhere('nft.title LIKE :title', { title: `%${filters.title}%` });
    }
    if (filters.name) {
      query.andWhere('nft.name LIKE :name', { name: `%${filters.name}%` });
    }
    if (filters.masv) {
      query.andWhere('nft.masv LIKE :masv', { masv: `%${filters.masv}%` });
    }

    return await query.getMany();
  }


  // src/modules/blockchain/blockchain.service.ts
async downloadPendingNFTFile(id: number): Promise<Buffer> {
  // Lấy dữ liệu từ DB chờ duyệt
  const pendingNFT = await this.blockchainRepository.findOne({ where: { id } });
  if (!pendingNFT) {
    throw new NotFoundException(`Đề tài chờ duyệt ID ${id} không tồn tại`);
  }

  if (!pendingNFT.uri) {
    throw new NotFoundException(`Đề tài chờ duyệt ID ${id} chưa có file đính kèm`);
  }

  try {
    const response = await axios.get(pendingNFT.uri, {
      responseType: 'arraybuffer',
    });
    return Buffer.from(response.data);
  } catch (error) {
    throw new Error(`Không tải được file từ URI: ${pendingNFT.uri}`);
  }
}



// src/modules/blockchain/blockchain.service.ts
async getPendingNFTDetail(id: number) {
  const pendingNFT = await this.blockchainRepository.findOne({ where: { id } });

  if (!pendingNFT) {
    throw new NotFoundException(`Đề tài chờ duyệt ID ${id} không tồn tại`);
  }

  // Trả về dữ liệu chi tiết
  return {
    id: pendingNFT.id,
    title: pendingNFT.title,
    name: pendingNFT.name,
    masv: pendingNFT.masv,
    department: pendingNFT.department,
    academicYear: pendingNFT.academicYear,
    uri: pendingNFT.uri,
  };
}

}



