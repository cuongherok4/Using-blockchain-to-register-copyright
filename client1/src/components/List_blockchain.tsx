// "use client";

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import AcademicNFTABI from "../../abi/AcademicNFTABI.json";

const AcademicNFTAddress = "0x3AbE9ffe34F2b64eD7C2ccC41B76A3dF0cf6C59d";

const AllListedNFTs: React.FC = () => {
  const [listedNFTs, setListedNFTs] = useState<any[]>([]);
  const [filteredNFTs, setFilteredNFTs] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    name: "",
    academicYear: "",
    department: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchListedNFTs = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
          AcademicNFTAddress,
          AcademicNFTABI.abi,
          provider
        );
        const nfts = await contract.getAllListedNFTs();

        const detailedNFTs = await Promise.all(
          nfts.map(async (nft: any) => {
            let metadata = {};
            if (nft.uri) {
              try {
                const response = await fetch(nft.uri);
                if (response.ok) {
                  metadata = await response.json();
                }
              } catch (error) {
                console.error(`Lỗi tải metadata từ URI: ${nft.uri}`, error);
              }
            }
            return { ...nft, metadata };
          })
        );

        setListedNFTs(detailedNFTs);
        setFilteredNFTs(detailedNFTs);
      } catch (error) {
        console.error(error);
        setMessage("Đã có lỗi xảy ra khi lấy danh sách NFT.");
      } finally {
        setLoading(false);
      }
    };

    fetchListedNFTs();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });

    const filtered = listedNFTs.filter((nft) =>
      (filters.name === "" || nft.title.toLowerCase().includes(filters.name.toLowerCase())) &&
      (filters.academicYear === "" || nft.academicYear.includes(filters.academicYear)) &&
      (filters.department === "" || nft.department.toLowerCase().includes(filters.department.toLowerCase()))
    );

    setFilteredNFTs(filtered);
  };

  if (loading) {
    return <p className="text-center text-lg font-semibold text-gray-700">Đang tải danh sách NFT...</p>;
  }

  if (message) {
    return <p className="text-center text-red-500 font-medium">{message}</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <table className="w-full table-auto border-collapse bg-white rounded-lg shadow-lg overflow-hidden">
        <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <tr>
            <th className="p-4 text-center font-semibold">STT</th>
            <th className="p-4 text-center font-semibold">Tiêu đề</th>
            <th className="p-4 text-center font-semibold">Năm học</th>
            <th className="p-4 text-center font-semibold">Khoa</th>
            <th className="p-4 text-center font-semibold">Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {filteredNFTs.map((nft, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="p-4 text-center text-gray-700">{index + 1}</td>
              <td className="p-4 text-gray-800">{nft.title}</td>
              <td className="p-4 text-gray-800">{nft.academicYear}</td>
              <td className="p-4 text-gray-800">{nft.department}</td>
              <td className="p-4 text-center">
                <button
                  onClick={() => window.open(`/detail/${nft.id}`, "_blank", "noopener,noreferrer")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Xem chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllListedNFTs;