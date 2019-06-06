import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import Spinner from "./components/Spinner";
import Adsense from "./components/Adsense";
import Champion from "./components/Champion";
import Feature from "./components/Feature"

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

const plugin = {};
plugin.install = (Vue, options) => {
    Vue.component('feature', {
        render: function(create){
            if (true) {
                return create(
                    'div',
                    {
                        class: 'feature-flag',
                    }, 
                    [
                    this.$scopedSlots.default({
                        data: this.featureData
                      }),
                    create('div', 'wooow man')
                    ]
                )
            }
            
        },
        data: function() {
            return {
              environment: '',
              featureData: {
                action: {},
                show: false,
                template: {}
              },
              list: {},
            }
        },
        props: {
            featureName: {
                required: true,
                default: '',
                type: String
            }
        },
        methods: {
            getFeatureData() {
                if (this.envStatus !== undefined) {
                this.featureData = this.list[this.environment][this.featureName];
        
                return;
                }
                if (this.globalStatus !== undefined) {
                this.featureData = this.list.global[this.featureName];
        
                return;
                }
            },
            getFeatureList: async function() {
                const domain = window.location.origin;
                const timestamp = new Date().toISOString();
                try {
                const response = await fetch(`${domain}/feature.json?t=${timestamp}`);
                this.list = await response.json();
                console.log(this.list.global.wow)
                } catch (e) {
                console.warn(new Error(e))
                }
            }
        
        },
        created: async function() {
            console.log('heeeeey')
            console.log(this.$scopedSlots)
            await this.getFeatureList();
            this.environment = (process.env.NODE_ENV !== undefined)
                ? process.env.NODE_ENV
                : '';
            this.getFeatureData();
            this.$emit('feature-flag', this.featureData);
        },
        computed: {
            devMode() {
                return this.environment === 'development';
            },
            envStatus() {
                const env = this.environment;
                const featureName = this.featureName;
                if (env !== '' && env in this.list && featureName in this.list[env]) {
                return this.list[env][featureName].show;
                }
        
                return undefined;
            },
            globalStatus() {
                if ('global' in this.list && this.featureName in this.list.global) {
                return this.list.global[this.featureName].show;
                }
        
                return undefined;
            },
        
            status() {
                if (typeof this.envStatus === 'boolean') {
                return this.envStatus;
                }
                if (this.devMode) {
                return this.devMode;
                }
                if (typeof this.globalStatus === 'boolean') {
                return this.globalStatus;
                }
        
                return this.devMode;
            }
        }
    });
};

Vue.use(plugin);

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
