import axios from "axios";
const BASE = "/api/";
export const get = async (target, params) => {
  try {
    console.log("[GET]", BASE + target, params);
    const response = await axios.get(BASE + target, { params });
    return response.data;
  } catch (e) {
    alert("데이터 로드 실패");
  }
};
export const post = async (target, product) => {
  try {
    console.log("[POST]", BASE + target, product);
    const response = await axios.post(BASE + target, product);
    return response.data;
  } catch (e) {
    alert("등록 실패");
  }
};
export const put = async (target, product) => {
  try {
    console.log("[PUT]", BASE + target, product);
    const response = await axios.put(BASE + target, product);
    return response.data;
  } catch (e) {
    alert("수정 실패");
  }
};
export const remove = async (target, params) => {
  try {
    console.log("[DELETE]", BASE + target, params);
    const response = await axios.delete(BASE + target, { params });
    return response.data;
  } catch (e) {
    alert("삭제 실패");
  }
};

// 사용자 정보 수정 API
export const updateUserInfo = (formData) => {
  return axios.put("/api/user", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 사용자 계정 삭제 API
export const deleteUserAccount = () => {
  return axios.delete("/api/user");
};

export async function getUserInfo() {
  const response = await fetch("http://localhost:3000/user?id=test");
  const data = await response.json();
  return data[0]; // 배열의 첫 번째 항목만 반환
}
