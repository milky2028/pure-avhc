import User from '@/types/User';
import setState from '@/actors/setState';

interface UserModuleState {
  isAdmin: boolean;
  userId: string;
  userDetails: User;
}

const UserModule = {
  namespaced: true,
  state: {
    isAdmin: false,
    userId: '',
    userDetails: {}
  },
  mutations: {
    setState
  }
};

export default UserModule;
