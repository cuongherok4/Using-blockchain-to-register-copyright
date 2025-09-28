// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AcademicNFT {
    struct NFT {
        uint256 id;
        string title;
        string uri;
        string academicYear;
        string department;
        address owner;
        string name;
        string msv;
    }

    uint256 public nextId = 1;
    mapping(uint256 => NFT) public nfts;
    mapping(address => uint256[]) public userNFTs;

    event NFTCreated(
        uint256 id,
        string title,
        string uri,
        string academicYear,
        string department,
        address owner,
        string name,
        string msv
    );

    function createNFT(
        string memory _title,
        string memory _uri,
        string memory _academicYear,
        string memory _department,
        string memory _name,
        string memory _msv
    ) public {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_uri).length > 0, "URI cannot be empty");
        require(
            bytes(_academicYear).length > 0,
            "Academic Year cannot be empty"
        );
        require(bytes(_department).length > 0, "Department cannot be empty");
        uint256 currentId = nextId;
        // Lấy ID hiện tại từ biến đếm nextId (ví dụ nextId=1 thì currentId=1).
        // Đây sẽ là ID của NFT mới sắp được tạo.

        nfts[currentId] = NFT( // Lưu dữ liệu vào mapping nfts (tủ tổng)
            currentId, // id của NFT
            _title, // tiêu đề do người dùng nhập
            _uri, // đường dẫn đến metadata (ví dụ IPFS link)
            _academicYear, // năm học
            _department, // khoa / bộ môn
            msg.sender, // địa chỉ ví của người gọi (chủ sở hữu NFT này)
            _name, // tên sinh viên
            _msv // mã số sinh viên
        );
        // Sau dòng này, trong mapping nfts sẽ có 1 mục mới:
        // nfts[currentId] = {id, title, uri, academicYear, department, owner, name, msv}

        userNFTs[msg.sender].push(currentId);
        // Lưu ID NFT vừa tạo vào "tủ phụ" userNFTs.
        // Tức là gắn currentId vào danh sách NFT mà người dùng này sở hữu.

        emit NFTCreated(
            currentId,
            _title,
            _uri,
            _academicYear,
            _department,
            msg.sender,
            _name,
            _msv
        );
        // Phát ra 1 sự kiện log trên blockchain để bên ngoài (client dApp / frontend)
        // có thể "nghe" và biết rằng 1 NFT mới đã được tạo thành công.

        nextId++;
        // Tăng biến đếm lên 1 để chuẩn bị ID cho NFT tiếp theo.
        // Nhờ đó các NFT có ID duy nhất và liên tiếp (1,2,3,...).
    }

    function getNFTDetail(uint256 _id) public view returns (NFT memory) {
        require(_id > 0 && _id < nextId, "NFT does not exist");
        return nfts[_id];
    }

    function getUserNFTs(address user) public view returns (NFT[] memory) {
        uint256[] memory nftIds = userNFTs[user];
        NFT[] memory userOwnedNFTs = new NFT[](nftIds.length);

        for (uint256 i = 0; i < nftIds.length; i++) {
            userOwnedNFTs[i] = nfts[nftIds[i]];
        }

        return userOwnedNFTs;
    }

    function getAllListedNFTs() public view returns (NFT[] memory) {
        // Cấp phát một mảng NFT trong bộ nhớ (memory) có độ dài = số NFT đã tạo.
        // nextId bắt đầu từ 1, nên tổng số NFT hiện có = nextId - 1.
        NFT[] memory allNFTs = new NFT[](nextId - 1);

        // allnfts sẽ bằng NTFs[1] đến NTF[nextId - 1]
        // Vì nfts[0] không được sử dụng, nên chúng ta bắt đầu từ i = 1.
        // NFT sẽ được gán nội dung từ nfts[i] vào allNFTs[i - 1].
        for (uint256 i = 1; i < nextId; i++) {
            // nfts[i] là dữ liệu nằm trong STORAGE (trạng thái on-chain của contract).
            // Gán vào allNFTs[i - 1] sẽ tạo bản sao trong MEMORY (tạm thời cho lần gọi hàm này).
            allNFTs[i - 1] = nfts[i];
        }

        // Trả về toàn bộ mảng NFT ở memory.
        // Khi trả về, EVM ABI-encode mảng struct này (bao gồm các string động)
        // rồi gửi về client (RPC).
        return allNFTs;
    }
}
