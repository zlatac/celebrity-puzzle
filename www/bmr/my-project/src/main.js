import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import Spinner from "./components/Spinner";
import Adsense from "./components/Adsense";
import Champion from "./components/Champion";

Vue.config.productionTip = false;

Vue.directive('imgfallback', {
  bind: function(el,binding,vnode){
      let fallback = 'https://www.chaarat.com/wp-content/uploads/2017/08/placeholder-user-300x300.png'
      //let fallback = vnode.context.$parent.noProfileUrl
      el.onerror = function(){
          if(el.src !== fallback){
              el.src = fallback
              //console.log(vnode)
          }
      }
  }
});

Vue.directive('inputHighlight', {
  bind: function(el,binding,vnode){
      el.onfocus = function(){
          vnode.context.isSearchFocused = true
          if(el.value !== ''){
              el.setSelectionRange(0, 9999)
          } 
          //console.log('i am focused')
      }
      el.onkeyup = function(event){
          if(event.keyCode === 13){ //code for submit 
              el.blur()
          }
          //console.log('am submitted',event) 
      }
      el.onblur = function(){
          vnode.context.isSearchFocused = false
          //console.log('not in focus anymore')
          //vnode.context.toggleSearch()

      }
  },
  componentUpdated: function(el,binding,vnode,oldVnode){
      //console.log('a change happened for the directive',vnode)
      if(binding.value !== binding.oldValue){
          //console.log('now i have a reason to do stuff')
          if(binding.value === true){
              el.focus()
          }
          if(binding.value === false){
              el.blur()
          }
      }
  }
});

Vue.filter('number', function (value) {
value = Number(value)
return Math.round(value)
});

Vue.filter('truncate', function (value) {
  if(value && value.length > 20){
      return value.slice(0,20)
  }
  return value
});

 // Register components globally
 Vue.component('spinner', Spinner);
 Vue.component('champion', Champion);
 Vue.component('adsense', Adsense);

//Bootstrap the app
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
