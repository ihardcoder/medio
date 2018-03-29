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
  login({commit},info){
    return axios.post(APIS.login,info).then(res => {
      if(!res||!res.data){
        throw '请求失败';
      }
      if(res.data.code === 0){
        Vue.$message.success('登录成功');
        setCookie(COOKIES.USER_KEY, `${res.data.name}_${res.data.type}`,{
          expires: 1000*60*60*24*30
        });
        commit(MUTATION_TYPES.SETUSERNAME, res.data.name);
        commit(MUTATION_TYPES.SETUSERTYPE, res.data.type);
        commit(MUTATION_TYPES.ISLOGIN,true);
      }else{
        throw res.data.msg;
      }
    }).catch(err => {
      Vue.$message.error(err);
    });
  },
  logout({commit}){
    axios.get(APIS.logout).then(res => {
      if(res.data.code === 0){
        setCookie(COOKIES.USER_KEY,'');
        commit(MUTATION_TYPES.SETUSERNAME,undefined);
        commit(MUTATION_TYPES.SETUSERTYPE,undefined);
        commit(MUTATION_TYPES.ISLOGIN,false);
        Vue.$message.success('登出成功');
      }
    }).catch(err => {
      Vue.$message.error(err);
    });;
  },
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