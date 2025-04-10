import axios from 'axios';

// json-server 기본 주소에 맞춤
const instance = axios.create({
  baseURL: 'http://localhost:3000', // 👉 json-server 실행 주소
});

// GET
export const get = async (target, params) => {
  try {
    console.log('[GET]', target, params);
    const response = await instance.get(target, { params });
    return response.data;
  } catch (e) {
    console.error(e);
    alert('데이터 로드 실패');
  }
};

// POST
export const post = async (target, data) => {
  try {
    console.log('[POST]', target, data);
    const response = await instance.post(target, data);
    return response.data;
  } catch (e) {
    console.error(e);
    alert('등록 실패');
  }
};

// PUT
export const put = async (target, data) => {
  try {
    console.log('[PUT]', target, data);
    const response = await instance.put(target, data);
    return response.data;
  } catch (e) {
    console.error(e);
    alert('수정 실패');
  }
};

// DELETE
export const remove = async (target) => {
  try {
    console.log('[DELETE]', target);
    const response = await instance.delete(target);
    return response.data;
  } catch (e) {
    console.error(e);
    alert('삭제 실패');
  }
};
