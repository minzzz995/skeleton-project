import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    username: '',
    password: '',
    phone: '',
    profileImage: '',
  }),
  actions: {
    setUser(data) {
      this.name = data.name;
      this.username = data.username;
      this.password = data.password;
      this.phone = data.phone;
      this.profileImage = data.profileImage;
    },
    clearUser() {
      this.name = '';
      this.username = '';
      this.password = '';
      this.phone = '';
      this.profileImage = '';
    },
  },
});
