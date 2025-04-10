import axios from 'axios';
const BASE = '/api/';
export const get = async (target, params) => {
  try {
    console.log('[GET]', BASE + target, params);
    const response = await axios.get(BASE + target, { params });
    return response.data;
  } catch (e) {
    alert('데이터 로드 실패');
  }
};
export const post = async (target, product) => {
  try {
    console.log('[POST]', BASE + target, product);
    const response = await axios.post(BASE + target, product);
    return response.data;
  } catch (e) {
    alert('등록 실패');
  }
};
export const put = async (target, product) => {
  try {
    console.log('[PUT]', BASE + target, product);
    const response = await axios.put(BASE + target, product);
    return response.data;
  } catch (e) {
    alert('수정 실패');
  }
};
export const remove = async (target) => {
  try {
    console.log('[DELETE]', BASE + target);
    const response = await axios.delete(BASE + target);
    return response.data;
  } catch (e) {
    alert('삭제 실패');
  }
};
