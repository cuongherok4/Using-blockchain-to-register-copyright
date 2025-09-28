"use client";

import React, { useState, useRef } from "react";
import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4YjcxNGYwMS0xNTc3LTRiNGItYjkwMC0wMWRjYmQ5Mjc4ZmQiLCJlbWFpbCI6ImN1b25naGVyb2s0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJkMGM1ZTVjMGQyYTM2NTk5NTQyZiIsInNjb3BlZEtleVNlY3JldCI6IjlkMDNmZDc1OTdkZjM2NGQ1MzBkMTY1MWNmYzRlOTBkZGUzNzJjY2QzYzgwMjg2NzMzNWNiYWQxYTliNWU3YjEiLCJleHAiOjE3Nzc1MzYxNjF9.vo1BhRZA0JsaP8AP0_Fn-BKfibmUTgzU7_YNmfnYEQ0",
  pinataGateway: "gateway.pinata.cloud",
});

interface UploadResult {
  cid: string;
  url: string;
  fileName: string;
}

const SoanGiaoDich: React.FC = () => {
  const [formData, setFormData] = useState({
    tendetai: "",
    tensinhvien: "",
    masinhvien: "",
    khoahoc: "",
    cid: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setError("");
    }
  };

  const uploadFileToPinata = async (): Promise<UploadResult> => {
    if (!file) throw new Error("Vui lòng chọn một file.");

    setUploading(true);
    setUploadProgress(0);

    try {
      const result = await new Promise<UploadResult>((resolve, reject) => {
        const interval = setInterval(() => {
          setUploadProgress((prev) => Math.min(prev + 20, 80));
        }, 500);

        pinata.upload
          .public.file(file)
          .then((upload) => {
            clearInterval(interval);
            setUploadProgress(100);
            const result = {
              cid: upload.cid,
              url: `https://gateway.pinata.cloud/ipfs/${upload.cid}`,
              fileName: file.name,
            };
            resolve(result);
          })
          .catch((err) => {
            clearInterval(interval);
            reject(err);
          });
      });

      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return result;
    } catch (err) {
      throw new Error("Lỗi khi upload file: " + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      let cid = formData.cid;
      if (file) {
        const uploadResult = await uploadFileToPinata();
        cid = uploadResult.cid;
        setFormData((prev) => ({ ...prev, cid }));
      }

      if (!cid) {
        throw new Error("Vui lòng chọn file để lấy CID hoặc nhập CID thủ công!");
      }

      const response = await fetch("/api/saveTopic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tendetai: formData.tendetai,
          tensinhvien: formData.tensinhvien,
          masinhvien: formData.masinhvien,
          khoahoc: formData.khoahoc,
          cid,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Lỗi không xác định");

      setMessage("Đề tài đã được gửi yêu cầu thành công!");
      setFormData({
        tendetai: "",
        tensinhvien: "",
        masinhvien: "",
        khoahoc: "",
        cid: "",
      });
      setFile(null);
    } catch (error) {
      //setMessage(error.message || "Đã xảy ra lỗi khi gửi yêu cầu.");
    } finally {
      setLoading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Soạn Giao Dịch</h2>

      {message && (
        <p className={`text-center mb-4 ${message.includes("thành công") ? "text-green-600" : "text-red-500"}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tên đề tài *</label>
          <input
            type="text"
            name="tendetai"
            value={formData.tendetai}
            onChange={(e) => setFormData((prev) => ({ ...prev, tendetai: e.target.value }))}
            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tên sinh viên *</label>
          <input
            type="text"
            name="tensinhvien"
            value={formData.tensinhvien}
            onChange={(e) => setFormData((prev) => ({ ...prev, tensinhvien: e.target.value }))}
            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Mã sinh viên *</label>
          <input
            type="text"
            name="masinhvien"
            value={formData.masinhvien}
            onChange={(e) => setFormData((prev) => ({ ...prev, masinhvien: e.target.value }))}
            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Khóa học *</label>
          <input
            type="text"
            name="khoahoc"
            value={formData.khoahoc}
            onChange={(e) => setFormData((prev) => ({ ...prev, khoahoc: e.target.value }))}
            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">File (tạo CID) *</label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed p-4 mb-4 ${dragging ? "border-blue-500" : "border-gray-300"}`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="w-full p-2"
            />
            <p className="text-center text-sm text-gray-500">Kéo và thả file vào đây hoặc nhấn để chọn</p>
          </div>
          {file && <p className="text-sm text-green-600">File đã chọn: {file.name}</p>}
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        {(uploading || loading) && (
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Đang gửi..." : uploading ? "Đang upload..." : "Gửi yêu cầu"}
        </button>
      </form>
    </div>
  );
};

export default SoanGiaoDich;