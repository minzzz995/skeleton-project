// store/userStore.js
import { defineStore } from 'pinia';
import { get, put } from '@/services/api';

export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    id: '',
    password: '',
    phone: '',
    profileImage: '',
  }),
  actions: {
    setUser(data) {
      this.name = data.name;
      this.id = data.id;
      this.password = data.password;
      this.phone = data.phone;
      this.profileImage = data.profileImage;
    },
    clearUser() {
      this.name = '';
      this.id = '';
      this.password = '';
      this.phone = '';
      this.profileImage = '';
    },

    // ✅ 사용자 정보 불러오기
    async fetchUserInfo(id = 'test') {
      const user = await get(`user/${id}`);
      if (user) {
        this.setUser({
          name: user.name,
          id: user.id,
          password: user.password,
          phone: user.tel,
          profileImage: user.imgpath,
        });
      }
    },

    // ✅ 사용자 정보 업데이트
    async updateUserInfo(form) {
      const payload = {
        name: form.name,
        password: form.password,
        tel: `${form.phone1}-${form.phone2}-${form.phone3}`,
        imgpath: form.profileImage,
      };

      await put(`user/${form.id}`, payload);
      this.setUser({
        name: form.name,
        id: form.id,
        password: form.password,
        phone: `${form.phone1}-${form.phone2}-${form.phone3}`,
        profileImage: form.profileImage,
      });
    },
  },
});
