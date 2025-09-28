const API_URL = process.env.REACT_APP_API_URL;

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: username, password }),
    });

    const data = await response.json();

    if (response.ok && data.data?.token) {
      // Kiểm tra xem response có chứa thông tin user không
      const userInfo = data.data.user || data.data;
      
      return { 
        success: true, 
        message: "Đăng nhập thành công!", 
        token: data.data.token,
        user: {
          id: userInfo.id || userInfo._id,
          email: userInfo.email || username,
          name: userInfo.name || userInfo.username,
          role: userInfo.role || 'user', // Mặc định là 'user' nếu không có
          department: userInfo.department || '',
          // Thêm các trường khác nếu cần
        }
      };
    } else {
      return { 
        success: false, 
        message: data.message || "Sai thông tin đăng nhập!" 
      };
    }
  } catch (error) {
    return { success: false, message: "Lỗi kết nối tới server!" };
  }
};

// Hàm lấy thông tin user từ token (nếu token chứa thông tin)
export const getUserInfoFromToken = (token: string) => {
  try {
    // Giải mã JWT token để lấy thông tin
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const userInfo = JSON.parse(decodedPayload);
    
    return { 
      success: true, 
      user: {
        id: userInfo.id || userInfo._id || userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
        role: userInfo.role || 'user',
        department: userInfo.department || '',
      }
    };
  } catch (error) {
    return { success: false, message: "Token không hợp lệ!" };
  }
};

// Hàm helper để lấy thông tin user
export const getUserInfo = async (token: string) => {
  // Vì chỉ có API login, chúng ta sẽ lấy thông tin từ token
  return getUserInfoFromToken(token);
};