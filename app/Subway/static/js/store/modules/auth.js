import Vue from 'vue';
import { getCookie, setCookie } from '@subway/js/utils';
import { APIS,MUTATION_TYPES, COOKIES } from '@subway/js/constants';

const State = {
  isLogin: false,
  userName: undefined,
  userType: undefined
};

const Getters = {
  UserName: state => state.userName,
  UserType: state => state.userType,
  IsLogin: state => state.isLogin
};

const Mutations = {
  [MUTATION_TYPES.SETUSERNAME](state, name){
    state.userName = name;
  },
  [MUTATION_TYPES.SETUSERTYPE](state, type){
    state.userType = type;
  },
  [MUTATION_TYPES.ISLOGIN](state, status){
    state.isLogin = status;
  }
};

const Actions = {
  getLocalUserInfo({commit}){
    const LocalUserInfo = getCookie(COOKIES.USER_KEY);
    const [name,type] = LocalUserInfo && LocalUserInfo.split('_') || [undefined,undefined];
    if(name&&type){
      commit(MUTATION_TYPES.SETUSERNAME,name);
      commit(MUTATION_TYPES.SETUSERTYPE,type);
      commit(MUTATION_TYPES.ISLOGIN,true);
    }
  }
};

export default {
  state: State,
  getters: Getters,
  actions: Actions,
  mutations: Mutations
};