import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state:{
    url: 'https://www.chaarat.com/wp-content/uploads/2017/08/placeholder-user-300x300.png',
    accessToken:null,
    clubs:[]
  },
  mutations:{
      url(state, data){
          state.url = data;
      },
      accessToken(state,data){
          state.accessToken = data;
      },
      clubs(state,data){
          state.clubs = data;
      }
  }
});
