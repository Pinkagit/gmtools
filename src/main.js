// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '../static/font/icon-font/iconfont.css';
import axios from "axios";
import store from './store';
import App from './App';

Vue.config.productionTip = false;
Vue.prototype.$ajax = axios;

Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  data: {
    isUser: true,
    isFirst: 0
  },
  created() {

    // 全局拦截
    axios.interceptors.response.use(response => {

      let logout = false;

      if (typeof (response.data) == "string" && response.data.indexOf("<!DOCTYPE html>") != -1) {
        this.isFirst++;
        logout = true;
      } else {
        logout = false;
      }
      
      if (response.data.err == "401" || logout) {
		this.isUser = false;
      } else {
		  this.isUser = true;
	  }
      return response;
    }, function (error) {
      return Promise.reject(error)
    })  

  },
  watch: {
	isUser(curVal ,oldVal) {
		if (curVal == false) {
      if (this.isFirst == 1) {
        router.replace({ path: "/login" });
      } else {
        this.$alert('你已退出登入状态，请重新登入', {
          confirmButtonText: '确定',
          callback: action => {
            router.replace({ path: "/login" });
          }
        });
      }
			
		}		
	}
  }
})
