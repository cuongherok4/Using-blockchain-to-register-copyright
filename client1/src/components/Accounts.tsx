import React, { useEffect, useState } from "react";

interface User {
  id: number;
  email: string;
  password: string;
  department: string;
  name: string;
  role: string;
}

interface ModalProps {
  modal: {
    isOpen: boolean;
    type: string;
    title: string;
    content: string;
    isSuccess: boolean;
    data: User | null;
  };
  formData: {
    email: string;
    password: string;
    department: string;
    name: string;
    role: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    email: string;
    password: string;
    department: string;
    name: string;
    role: string;
  }>>;
  setModal: React.Dispatch<React.SetStateAction<any>>;
  handleSubmit: () => void;
}

// ======== MODAL COMPONENT (Đưa ra ngoài) ========
const Modal: React.FC<ModalProps> = ({ modal, formData, setFormData, setModal, handleSubmit }) => {
  if (!modal.isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in-50 duration-300">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all animate-in zoom-in-95 duration-300">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-white text-xl">
            {modal.type === "delete" ? "🗑️" : modal.type === "error" ? "⚠️" : modal.type === "success" ? "✅" : "👤"}
          </div>
          <h2 className="text-2xl font-bold text-indigo-800">{modal.title}</h2>
        </div>

        {modal.type === "delete" ? (
          <p className="text-gray-600 mb-6 leading-relaxed">{modal.content}</p>
        ) : modal.type === "error" || modal.type === "success" ? (
          <p className="text-gray-600 mb-6 leading-relaxed">{modal.content}</p>
        ) : (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {modal.type === "create" ? "Mật khẩu" : "Mật khẩu (bỏ trống nếu không đổi)"}
              </label>
              <input
                type="password"
                placeholder={modal.type === "create" ? "Mật khẩu" : "Mật khẩu (bỏ trống nếu không đổi)"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
              <input
                type="text"
                placeholder="Tên"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Khoa</label>
              <input
                type="text"
                placeholder="Khoa"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-6">
          {(modal.type === "error" || modal.type === "success") ? (
            <button
              onClick={() => setModal({ ...modal, isOpen: false, data: null })}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              OK
            </button>
          ) : (
            <>
              <button
                onClick={handleSubmit}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
                  modal.type === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                }`}
              >
                {modal.type === "delete" ? "Xóa" : "Lưu"}
              </button>
              <button
                onClick={() => setModal({ ...modal, isOpen: false, data: null })}
                className="flex-1 py-3 px-4 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300 transform hover:scale-105"
              >
                Hủy
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const UserManagement: React.FC = () => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState({
    isOpen: false,
    type: "", // "create" | "edit" | "delete" | "error" | "success"
    title: "",
    content: "",
    isSuccess: false,
    data: null as User | null,
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    department: "",
    name: "",
    role: "user",
  });

  // ======== API CALLS ========
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await response.text();
      console.log("Response text:", text);

      if (response.ok) {
        const data = JSON.parse(text);
        setUsers(data.data);
        setFilteredUsers(data.data);
      } else {
        throw new Error("Status: " + response.status);
      }
    } catch (error: any) {
      console.error(error);
      setModal({
        isOpen: true,
        type: "error",
        title: "Lỗi",
        content: "Không thể tải danh sách người dùng",
        isSuccess: false,
        data: null,
      });
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      showSuccess("Tạo người dùng thành công");
      resetForm();
      fetchUsers();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const updateUser = async () => {
    if (!modal.data) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/user/${modal.data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      showSuccess("Cập nhật người dùng thành công");
      resetForm();
      fetchUsers();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const deleteUser = async () => {
    if (!modal.data) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/user/${modal.data.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      showSuccess("Xóa người dùng thành công");
      fetchUsers();
    } catch (err: any) {
      showError(err.message);
    }
  };

  // ======== HELPERS ========
  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      department: "",
      name: "",
      role: "user",
    });
  };

  const showError = (msg: string) => {
    setModal({
      isOpen: true,
      type: "error",
      title: "Lỗi",
      content: msg,
      isSuccess: false,
      data: null,
    });
  };

  const showSuccess = (msg: string) => {
    setModal({
      isOpen: true,
      type: "success",
      title: "Thành công",
      content: msg,
      isSuccess: true,
      data: null,
    });
    
    // Tự động đóng sau 2 giây
    setTimeout(() => {
      setModal((prev) => ({ ...prev, isOpen: false }));
    }, 2000);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term) return setFilteredUsers(users);
    const filtered = users.filter(
      (u) =>
        u.email.toLowerCase().includes(term.toLowerCase()) ||
        u.name.toLowerCase().includes(term.toLowerCase()) ||
        u.department.toLowerCase().includes(term.toLowerCase()) ||
        u.role.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const openCreateModal = () => {
    resetForm();
    setModal({
      isOpen: true,
      type: "create",
      title: "Thêm người dùng",
      content: "",
      isSuccess: false,
      data: null,
    });
  };

  const openEditModal = (user: User) => {
    setFormData({
      email: user.email,
      password: "",
      department: user.department,
      name: user.name,
      role: user.role,
    });
    setModal({
      isOpen: true,
      type: "edit",
      title: "Chỉnh sửa người dùng",
      content: "",
      isSuccess: false,
      data: user,
    });
  };

  const openDeleteModal = (user: User) => {
    setModal({
      isOpen: true,
      type: "delete",
      title: "Xóa người dùng",
      content: `Bạn có chắc muốn xóa người dùng ${user.name} (${user.email})?`,
      isSuccess: false,
      data: user,
    });
  };

  const handleSubmit = () => {
    if (modal.type === "create") createUser();
    else if (modal.type === "edit") updateUser();
    else if (modal.type === "delete") deleteUser();
    else if (modal.type === "success" || modal.type === "error") {
      setModal({ ...modal, isOpen: false, data: null });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ======== UI ========
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-800 text-center mb-8 animate-in slide-in-from-top duration-700">
          Quản Lý Tài Khoản
        </h1>

        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4 animate-in fade-in-50 duration-700 delay-200">
          <div className="relative w-full sm:w-1/2">
            <input
              type="text"
              placeholder="Tìm kiếm theo email, tên, khoa hoặc vai trò..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
            />
            <svg
              className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            onClick={openCreateModal}
            className="group relative px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10">+ Thêm Người Dùng</span>
            <div className="absolute inset-0 bg-white/20 transform skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in-50 duration-700 delay-300">
          <div className="relative overflow-x-auto max-h-[calc(100vh-300px)] scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Tên</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Khoa</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Vai trò</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array(5).fill(0).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-2/3"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/3"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div></td>
                    </tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      Không có người dùng nào
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`border-b border-gray-100 hover:bg-indigo-50/50 transition-colors duration-200 animate-in fade-in-50 duration-500 delay-${index * 100}`}
                    >
                      <td className="px-6 py-4 text-gray-700">{user.email}</td>
                      <td className="px-6 py-4 text-gray-700">{user.name}</td>
                      <td className="px-6 py-4 text-gray-700">{user.department}</td>
                      <td className="px-6 py-4 text-gray-700 capitalize">{user.role}</td>
                      <td className="px-6 py-4 text-center space-x-3">
                        <button
                          onClick={() => openEditModal(user)}
                          className="group px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-md transition-all duration-300 transform hover:scale-105"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="group px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:shadow-md transition-all duration-300 transform hover:scale-105"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <Modal 
        modal={modal}
        formData={formData}
        setFormData={setFormData}
        setModal={setModal}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default UserManagement;