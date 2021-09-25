import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      isEnter: true,
      name: '',
      password: '',
      email: ''
    };
  },
  getters: {},
  mutations: {
    login(state) {
      state.isEnter = false;
    },
    notlogin(state) {
      state.isEnter = true;
    },
    showName(state, login, pass, gmail){
        state.name = login
        state.password = pass
        state.email = gmail
    }
  },
});

export default store